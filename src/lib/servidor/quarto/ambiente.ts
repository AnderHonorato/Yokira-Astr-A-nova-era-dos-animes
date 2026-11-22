import { banco } from '../banco/cliente.js';
import { experienciaParaNivel } from '../../mascotes/regras.js';
import { luzes, temas } from '../../quarto/ambiente.js';

export class EdicaoInvalida extends Error {}

const selecionarObjeto = {
  id: true,
  chave: true,
  x: true,
  y: true,
  rotacao: true,
  colocado: true,
  titulo: { select: { nome: true, posterUrl: true } }
} as const;
const titulosVisiveis = {
  OR: [{ tituloId: null }, { titulo: { situacao: 'PUBLICADO' as const } }]
};
const selecionarCompanheiros = {
  orderBy: { criadoEm: 'asc' as const },
  select: { especie: { select: { nome: true, imagemUrl: true } } }
};

export async function meuQuarto(usuarioId: string, cliente = banco) {
  return cliente.$transaction(async (tx) => {
    // O primeiro acesso materializa o kit e as conquistas que ainda não entraram no inventário.
    const quarto = await tx.quartoOtaku.upsert({
      where: { usuarioId },
      update: {},
      create: { usuarioId }
    });
    const lista = await tx.itemLista.findMany({
      where: { usuarioId, titulo: { situacao: 'PUBLICADO' } },
      select: { tituloId: true }
    });
    const guardiao = await tx.companheiroMascote.findFirst({
      where: { usuarioId, experiencia: { gte: experienciaParaNivel(10) } },
      select: { id: true }
    });
    const existentes = new Set(
      (
        await tx.objetoQuarto.findMany({
          where: { quartoId: quarto.id },
          select: { chave: true }
        })
      ).map((item) => item.chave)
    );
    const recompensas = [
      { chave: 'estante', x: 19, y: 61, colocado: true },
      { chave: 'tapete', x: 49, y: 81, colocado: true },
      { chave: 'descanso', x: 73, y: 75, colocado: true },
      ...(guardiao ? [{ chave: 'cristal' }] : []),
      ...lista.map(({ tituloId }) => ({ chave: 'poster-' + tituloId, tituloId, x: 31, y: 36 }))
    ].filter((item) => !existentes.has(item.chave));
    if (recompensas.length)
      await tx.objetoQuarto.createMany({
        data: recompensas.map((item) => ({ ...item, quartoId: quarto.id }))
      });
    return tx.quartoOtaku.findUniqueOrThrow({
      where: { id: quarto.id },
      select: {
        id: true,
        tema: true,
        iluminacao: true,
        publico: true,
        objetos: { where: titulosVisiveis, select: selecionarObjeto, orderBy: { chave: 'asc' } },
        usuario: { select: { companheiros: selecionarCompanheiros } }
      }
    });
  });
}

export async function quartoParaVisita(id: string, cliente = banco) {
  return cliente.quartoOtaku.findFirst({
    where: { id, publico: true },
    select: {
      tema: true,
      iluminacao: true,
      objetos: {
        where: { colocado: true, ...titulosVisiveis },
        select: selecionarObjeto,
        orderBy: { chave: 'asc' }
      },
      usuario: { select: { companheiros: selecionarCompanheiros } }
    }
  });
}

export async function configurarQuarto(
  usuarioId: string,
  tema: string,
  iluminacao: string,
  publico: boolean,
  cliente = banco
) {
  if (!Object.hasOwn(temas, tema) || !Object.hasOwn(luzes, iluminacao))
    throw new EdicaoInvalida('Escolha um tema e uma iluminação disponíveis.');
  await cliente.quartoOtaku.update({ where: { usuarioId }, data: { tema, iluminacao, publico } });
}

export interface Posicao {
  x: number;
  y: number;
  rotacao: number;
  colocado: boolean;
}
export async function moverObjeto(
  usuarioId: string,
  id: string,
  posicao: Posicao,
  cliente = banco
) {
  for (const valor of [posicao.x, posicao.y]) {
    if (!Number.isInteger(valor) || valor < 10 || valor > 90)
      throw new EdicaoInvalida('Posição fora dos limites do quarto.');
  }
  if (!Number.isInteger(posicao.rotacao) || posicao.rotacao < -180 || posicao.rotacao > 180)
    throw new EdicaoInvalida('Rotação inválida.');
  const resultado = await cliente.objetoQuarto.updateMany({
    where: { id, quarto: { usuarioId }, ...titulosVisiveis },
    data: posicao
  });
  if (!resultado.count) throw new EdicaoInvalida('O objeto não está no seu inventário.');
}
