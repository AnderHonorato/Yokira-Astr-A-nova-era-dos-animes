// Persistência do companheiro por conta. Nunca aceita XP vindo de formulários ou API pública.
import { adicionarExperiencia } from './jornada.js';
import { banco } from '../banco/cliente.js';
import type { PrismaClient } from '../banco/gerado/client.js';
import {
  FORMAS_ASTRA,
  XP_MAXIMO,
  nivelPorExperiencia,
  validarCorAura,
  type FormaAstraId
} from '../../mascotes/regras.js';

export const MISSAO_GENEROS = {
  chave: 'generos-3',
  titulo: 'Primeira exploração',
  descricao: 'Adicione três títulos de gêneros diferentes à Minha Lista.',
  experiencia: 420
} as const;

export type BancoDeMascotes = PrismaClient;

const PREFERENCIAS_PADRAO = { visivel: true, acompanhar: true, posicao: 'direita' } as const;

export async function listarColecao(usuarioId: string, cliente: BancoDeMascotes = banco) {
  const [mascotes, preferencia] = await Promise.all([
    cliente.companheiroMascote.findMany({
      where: { usuarioId },
      include: { especie: true, eventos: { orderBy: { criadoEm: 'desc' }, take: 20 } },
      orderBy: { criadoEm: 'asc' }
    }),
    cliente.preferenciasMascote.findUnique({ where: { usuarioId } })
  ]);
  return {
    mascotes,
    equipado: mascotes.find((item) => item.equipado) ?? null,
    preferencias: preferencia ?? PREFERENCIAS_PADRAO
  };
}

export async function desbloquearAstra(usuarioId: string, cliente: BancoDeMascotes = banco) {
  await cliente.especieMascote.upsert({
    where: { id: 'astra' },
    update: { ativo: true },
    create: {
      id: 'astra',
      nome: 'Astra',
      descricao: 'Guardião de energia astral, curioso e leal.',
      imagemUrl: '/mascotes/astra.webp'
    }
  });

  return cliente.companheiroMascote.upsert({
    where: { usuarioId_especieId: { usuarioId, especieId: 'astra' } },
    update: {},
    create: { usuarioId, especieId: 'astra', equipado: true }
  });
}

export async function equiparMascote(
  usuarioId: string,
  companheiroId: string,
  cliente: BancoDeMascotes = banco
) {
  return cliente.$transaction(async (tx) => {
    const encontrado = await tx.companheiroMascote.findFirst({
      where: { id: companheiroId, usuarioId }
    });
    if (!encontrado) throw new Error('Companheiro não encontrado na sua coleção.');
    await tx.companheiroMascote.updateMany({ where: { usuarioId }, data: { equipado: false } });
    return tx.companheiroMascote.update({ where: { id: companheiroId }, data: { equipado: true } });
  });
}

export async function concederMissaoGeneros(
  usuarioId: string,
  companheiroId: string,
  cliente: BancoDeMascotes = banco
) {
  // A transação contém verificação, evento único e incremento de XP; replays não geram XP.
  const executar = async () =>
    cliente.$transaction(async (tx) => {
      const mascote = await tx.companheiroMascote.findFirst({
        where: { id: companheiroId, usuarioId, especie: { ativo: true } }
      });
      if (!mascote) throw new Error('Mascote inválido para esta conta.');

      const concedida = await tx.eventoMascote.findFirst({
        where: { companheiro: { usuarioId }, chave: MISSAO_GENEROS.chave }
      });
      if (concedida) return { ganhou: false, experiencia: mascote.experiencia };

      // A fonte de verdade é a lista e os gêneros relacionados ao catálogo real.
      const lista = await tx.itemLista.findMany({
        where: { usuarioId, titulo: { situacao: 'PUBLICADO' } },
        select: { tituloId: true, titulo: { select: { generos: { select: { generoId: true } } } } }
      });
      const titulos = new Set(lista.map((item) => item.tituloId));
      const generos = new Set(
        lista.flatMap((item) => item.titulo.generos.map((relacao) => relacao.generoId))
      );
      if (titulos.size < 3 || generos.size < 3) {
        throw new Error('Salve três títulos de gêneros diferentes na Minha Lista primeiro.');
      }
      if (mascote.experiencia + MISSAO_GENEROS.experiencia > XP_MAXIMO) {
        throw new Error('Experiência máxima atingida.');
      }
      const experiencia = await adicionarExperiencia(
        tx,
        mascote,
        MISSAO_GENEROS.chave,
        MISSAO_GENEROS.titulo,
        MISSAO_GENEROS.experiencia,
        'MISSAO'
      );
      return { ganhou: true, experiencia };
    });
  try {
    return await executar();
  } catch (erro) {
    // Índice composto único arbitra cliques concorrentes (nunca repetir incremento).
    if (typeof erro === 'object' && erro !== null && 'code' in erro && erro.code === 'P2002') {
      const atual = await cliente.companheiroMascote.findFirst({
        where: { id: companheiroId, usuarioId }
      });
      if (atual) return { ganhou: false, experiencia: atual.experiencia };
    }
    throw erro;
  }
}

export async function personalizarMascote(
  usuarioId: string,
  companheiroId: string,
  forma: string,
  cor: string,
  cliente: BancoDeMascotes = banco
) {
  const pet = await cliente.companheiroMascote.findFirst({
    where: { id: companheiroId, usuarioId }
  });
  if (!pet) throw new Error('Companheiro não encontrado.');
  const valida = FORMAS_ASTRA.find((item) => item.id === forma);
  if (!valida || valida.nivelMinimo > nivelPorExperiencia(pet.experiencia)) {
    throw new Error('Esta forma evolutiva ainda não foi conquistada.');
  }
  const corAura = validarCorAura(cor);
  if (corAura === 'azul' && pet.especieId !== 'luna') {
    const evento = await cliente.eventoMascote.findUnique({
      where: { companheiroId_chave: { companheiroId, chave: MISSAO_GENEROS.chave } }
    });
    if (!evento) throw new Error('Aura azul disponível após a missão de gêneros.');
  }
  if (corAura === 'rosa' && nivelPorExperiencia(pet.experiencia) < 25) {
    throw new Error('Aura rosa disponível no nível 25.');
  }
  return cliente.companheiroMascote.update({
    where: { id: pet.id },
    data: { formaSelecionada: valida.id as FormaAstraId, corAura }
  });
}

export async function atualizarPreferenciasMascote(
  usuarioId: string,
  preferencias: { visivel: boolean; acompanhar: boolean; posicao: string },
  cliente: BancoDeMascotes = banco
) {
  if (!['direita', 'esquerda'].includes(preferencias.posicao)) {
    throw new Error('Posição do mascote inválida.');
  }
  const dados = {
    visivel: preferencias.visivel === true,
    acompanhar: preferencias.acompanhar === true,
    posicao: preferencias.posicao
  };
  return cliente.preferenciasMascote.upsert({
    where: { usuarioId },
    create: { usuarioId, ...dados },
    update: dados
  });
}
