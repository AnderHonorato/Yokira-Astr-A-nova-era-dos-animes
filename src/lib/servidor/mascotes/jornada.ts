import { banco } from '../banco/cliente.js';
import type { Prisma, PrismaClient } from '../banco/gerado/client.js';
import { nivelPorExperiencia, XP_EPISODIO_VALIDADO, XP_MAXIMO } from '../../mascotes/regras.js';

type Tx = Prisma.TransactionClient;

export async function adicionarExperiencia(
  tx: Tx,
  pet: { id: string; experiencia: number; formaSelecionada: string },
  chave: string,
  descricao: string,
  pontos: number,
  tipo: string
) {
  const ganho = Math.min(pontos, XP_MAXIMO - pet.experiencia);
  const experiencia = pet.experiencia + ganho;
  const formas = await tx.formaMascote.findMany({
    where: {
      nivelMinimo: {
        gt: nivelPorExperiencia(pet.experiencia),
        lte: nivelPorExperiencia(experiencia)
      }
    },
    orderBy: { nivelMinimo: 'asc' }
  });
  await tx.eventoMascote.create({
    data: { companheiroId: pet.id, chave, descricao, pontos: ganho, tipo }
  });
  for (const forma of formas) {
    await tx.eventoMascote.create({
      data: {
        companheiroId: pet.id,
        chave: 'forma-' + forma.id,
        tipo: 'EVOLUCAO',
        descricao: forma.nome,
        pontos: 0
      }
    });
  }
  await tx.companheiroMascote.update({
    where: { id: pet.id },
    data: { experiencia, formaSelecionada: formas.at(-1)?.id ?? pet.formaSelecionada }
  });
  return experiencia;
}

// Só credita a parte contínua efetivamente percorrida, limitada pelo relógio do servidor.
// Um único pulso por conta impede contabilizar duas abas ao mesmo tempo.
export function coberturaSeguinte(
  cobertura: number,
  anterior: number,
  atual: number,
  intervaloMs: number
) {
  const delta = atual - anterior;
  if (
    intervaloMs < 900 ||
    intervaloMs > 45_000 ||
    delta <= 0 ||
    delta > Math.ceil(intervaloMs / 1000) + 1 ||
    anterior > cobertura + 1
  )
    return cobertura;
  return Math.max(cobertura, Math.min(atual, cobertura + Math.round(intervaloMs / 1000)));
}

export async function aferirReproducao(
  usuarioId: string,
  episodioId: string,
  segundos: number,
  cliente: PrismaClient = banco,
  agora = new Date()
) {
  return cliente.$transaction(async (tx) => {
    const pet = await tx.companheiroMascote.findFirst({ where: { usuarioId, equipado: true } });
    if (!pet) return;
    const episodio = await tx.episodio.findFirst({
      where: {
        id: episodioId,
        publicadoEm: { lte: agora },
        temporada: { titulo: { situacao: 'PUBLICADO' } },
        fontes: { some: { ativa: true, estado: 'PRONTO' } }
      },
      select: { duracaoSegundos: true }
    });
    if (!episodio || episodio.duracaoSegundos < 1 || segundos > episodio.duracaoSegundos + 1)
      return;
    const chave = { usuarioId, episodioId };
    const progresso = await tx.percursoEpisodio.findUnique({
      where: { usuarioId_episodioId: chave }
    });
    const ultimo = await tx.pulsoJornada.findUnique({ where: { usuarioId } });
    await tx.pulsoJornada.upsert({
      where: { usuarioId },
      create: { ...chave, posicao: segundos, recebidoEm: agora },
      update: { episodioId, posicao: segundos, recebidoEm: agora }
    });
    if (progresso?.validado || !ultimo || ultimo.episodioId !== episodioId) return;
    const cobertura = coberturaSeguinte(
      progresso?.cobertura ?? 0,
      ultimo.posicao,
      segundos,
      agora.getTime() - ultimo.recebidoEm.getTime()
    );
    if (cobertura === (progresso?.cobertura ?? 0)) return;
    const validado = cobertura >= Math.ceil(episodio.duracaoSegundos * 0.92);
    await tx.percursoEpisodio.upsert({
      where: { usuarioId_episodioId: chave },
      create: { ...chave, cobertura, validado },
      update: { cobertura, validado }
    });
    if (validado)
      await adicionarExperiencia(
        tx,
        pet,
        'episodio-' + episodioId,
        'Episódio acompanhado',
        XP_EPISODIO_VALIDADO,
        'EPISODIO'
      );
  });
}

async function progressoDesafios(tx: Tx, usuarioId: string): Promise<Record<string, number>> {
  const [lista, avaliacoes, percursos] = await Promise.all([
    tx.itemLista.count({ where: { usuarioId, titulo: { situacao: 'PUBLICADO' } } }),
    tx.avaliacao.count({ where: { usuarioId, titulo: { situacao: 'PUBLICADO' } } }),
    tx.percursoEpisodio.findMany({
      where: { usuarioId, validado: true },
      select: {
        episodioId: true,
        episodio: { select: { temporada: { select: { tituloId: true } } } }
      }
    })
  ]);
  const vistos = new Set(percursos.map((p) => p.episodioId));
  const titulos = await tx.titulo.findMany({
    where: {
      id: { in: [...new Set(percursos.map((p) => p.episodio.temporada.tituloId))] },
      situacao: 'PUBLICADO'
    },
    select: {
      temporadas: {
        select: { episodios: { where: { publicadoEm: { lte: new Date() } }, select: { id: true } } }
      }
    }
  });
  let temporadas = 0,
    animes = 0;
  for (const titulo of titulos) {
    const publicadas = titulo.temporadas.filter((t) => t.episodios.length);
    const completas = publicadas.filter((t) => t.episodios.every((e) => vistos.has(e.id)));
    temporadas += completas.length;
    if (publicadas.length && completas.length === publicadas.length) animes++;
  }
  const descobertas = await tx.conquistaJornada.findMany({
    where: { usuarioId, chave: { startsWith: 'descoberta/' } },
    select: { criadoEm: true }
  });
  const colecao = await tx.companheiroMascote.aggregate({
    where: { usuarioId },
    _sum: { experiencia: true }
  });
  const agora = new Date();
  return {
    descoberta: descobertas.length,
    'encontro-lunar':
      agora.getUTCMonth() === 10
        ? descobertas.filter(
            (d) =>
              d.criadoEm.getUTCMonth() === 10 &&
              d.criadoEm.getUTCFullYear() === agora.getUTCFullYear()
          ).length
        : 0,
    veterano: nivelPorExperiencia(colecao._sum.experiencia ?? 0),
    colecionador: lista,
    comunidade: avaliacoes,
    temporada: temporadas,
    anime: animes
  };
}

export async function lerJornada(usuarioId: string, cliente: PrismaClient = banco) {
  const [progresso, conquistas, pet, definicoes] = await Promise.all([
    progressoDesafios(cliente, usuarioId),
    cliente.conquistaJornada.findMany({ where: { usuarioId } }),
    cliente.companheiroMascote.findFirst({
      where: { usuarioId, equipado: true },
      select: { especie: { select: { nome: true } } }
    }),
    cliente.definicaoMissao.findMany({ orderBy: { xp: 'asc' } })
  ]);
  return {
    companheiro: pet?.especie.nome,
    missoes: definicoes.map((m) => ({
      ...m,
      atual: Math.min(m.meta, progresso[m.chave]),
      recebida: conquistas.some((c) => c.chave === m.chave)
    }))
  };
}

export async function resgatarDesafio(
  usuarioId: string,
  chave: string,
  cliente: PrismaClient = banco
) {
  const missao = await cliente.definicaoMissao.findUnique({ where: { chave } });
  if (!missao) throw new Error('Missão desconhecida.');
  return cliente.$transaction(async (tx) => {
    const pet = await tx.companheiroMascote.findFirst({ where: { usuarioId, equipado: true } });
    if (!pet) throw new Error('Equipe um companheiro para receber a experiência.');
    if (await tx.conquistaJornada.findUnique({ where: { usuarioId_chave: { usuarioId, chave } } }))
      return false;
    if (((await progressoDesafios(tx, usuarioId))[missao.chave] ?? 0) < missao.meta)
      throw new Error('Objetivo ainda em andamento.');
    await tx.conquistaJornada.create({ data: { usuarioId, chave } });
    await adicionarExperiencia(tx, pet, 'jornada-' + chave, missao.nome, missao.xp, 'MISSAO');
    if (chave === 'colecionador') {
      await tx.especieMascote.upsert({
        where: { id: 'luna' },
        create: {
          id: 'luna',
          nome: 'Luna',
          descricao: 'Companheira lunar de aura azul.',
          imagemUrl: '/mascotes/astra.webp'
        },
        update: {}
      });
      await tx.companheiroMascote.upsert({
        where: { usuarioId_especieId: { usuarioId, especieId: 'luna' } },
        create: { usuarioId, especieId: 'luna', corAura: 'azul' },
        update: {}
      });
    }
    return true;
  });
}
