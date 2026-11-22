import { listarCatalogoCompleto, listarGeneros } from '$servidor/banco/catalogo';
import { banco } from '$servidor/banco/cliente';
import type { PageServerLoad } from './$types';

function numeroFiltro(valor: string | null, minimo: number, maximo: number) {
  const numero = Number(valor);
  return valor && Number.isInteger(numero) && numero >= minimo && numero <= maximo ? numero : null;
}

export const load: PageServerLoad = async ({ url }) => {
  const generos = await listarGeneros();
  const informado = url.searchParams.get('genero');
  const genero = generos.find((item) => item.slug === informado)?.slug ?? null;
  const ano = numeroFiltro(url.searchParams.get('ano'), 1950, new Date().getFullYear() + 1);
  const nota = numeroFiltro(url.searchParams.get('nota'), 1, 10);
  const comFonte = url.searchParams.get('disponibilidade') === 'com-fonte';
  const ordem = url.searchParams.get('ordem') === 'ano' ? 'ano' : 'avaliacao';

  const [itens, fontes] = await Promise.all([
    listarCatalogoCompleto(genero ?? undefined),
    comFonte
      ? banco.fonteMidia.findMany({
          where: { ativa: true },
          select: { episodio: { select: { temporada: { select: { tituloId: true } } } } }
        })
      : Promise.resolve([])
  ]);
  const titulosDisponiveis = new Set(fontes.map((fonte) => fonte.episodio.temporada.tituloId));
  const filtrados = itens.filter(
    (item) =>
      (ano === null || item.ano === ano) &&
      (nota === null || (item.nota !== null && item.nota >= nota)) &&
      (!comFonte || titulosDisponiveis.has(item.id))
  );
  filtrados.sort((a, b) => (ordem === 'ano' ? b.ano - a.ano : (b.nota ?? 0) - (a.nota ?? 0)));
  return {
    generos,
    itens: filtrados,
    filtros: {
      genero,
      ano: ano ?? '',
      nota: nota ?? '',
      disponibilidade: comFonte ? 'com-fonte' : 'todos',
      ordem
    }
  };
};
