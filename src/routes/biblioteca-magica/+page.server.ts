import { banco } from '$servidor/banco/cliente';
import { listarMinhaLista } from '$servidor/banco/lista';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'private, no-store' });
  if (!locals.usuario) return { precisaEntrar: true, livros: [] };
  const usuarioId = locals.usuario.id;
  const cartoes = await listarMinhaLista(usuarioId);
  const ids = cartoes.map((item) => item.id);
  if (!ids.length) return { precisaEntrar: false, livros: [] };
  const titulos = await banco.titulo.findMany({
    where: { id: { in: ids } },
    select: { id: true, temporadas: { select: { episodios: { select: { id: true } } } } }
  });
  const idsEpisodios = titulos.flatMap((item) =>
    item.temporadas.flatMap((t) => t.episodios.map((e) => e.id))
  );
  const progressos = await banco.progresso.findMany({
    where: { usuarioId, episodioId: { in: idsEpisodios } },
    select: { episodioId: true, segundos: true, concluido: true }
  });
  const andamento = new Map(progressos.map((x) => [x.episodioId, x]));
  const totalPorTitulo = new Map(
    titulos.map((t) => {
      const eps = t.temporadas.flatMap((s) => s.episodios);
      const assistidos = eps.filter((e) => andamento.get(e.id)?.concluido).length;
      const vistos = eps.filter((e) => andamento.has(e.id)).length;
      return [t.id, { total: eps.length, assistidos, vistos }] as const;
    })
  );
  const livros = cartoes.map((item) => {
    const contagem = totalPorTitulo.get(item.id) ?? { total: 0, assistidos: 0, vistos: 0 };
    const status =
      contagem.total > 0 && contagem.assistidos >= contagem.total
        ? 'concluido'
        : contagem.vistos > 0
          ? 'assistindo'
          : 'quero-ver';
    return {
      ...item,
      status,
      episodiosConcluidos: contagem.assistidos,
      episodiosTotal: contagem.total
    };
  });
  return { precisaEntrar: false, livros };
};
