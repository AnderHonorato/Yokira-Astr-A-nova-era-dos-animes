import { banco } from '$servidor/banco/cliente';
import { listarMinhaLista } from '$servidor/banco/lista';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'private, no-store' });
  if (!locals.usuario) return { precisaEntrar: true, livros: [] };
  const usuarioId = locals.usuario.id;
  const [cartoes, preferencias] = await Promise.all([
    listarMinhaLista(usuarioId),
    banco.preferenciasMascote.findUnique({ where: { usuarioId }, select: { temaEstante: true } })
  ]);
  const temaEstante = preferencias?.temaEstante ?? 'ametista';
  const ids = cartoes.map((item) => item.id);
  if (!ids.length) return { precisaEntrar: false, temaEstante, livros: [] };
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
  return { precisaEntrar: false, temaEstante, livros };
};

export const actions = {
  estante: async ({ locals, request }) => {
    if (!locals.usuario) return fail(401, { recado: 'Entre para salvar sua estante.' });
    const temaEstante = (await request.formData()).get('tema');
    if (typeof temaEstante !== 'string' || !['ametista', 'cedro', 'lunar'].includes(temaEstante)) {
      return fail(400, { recado: 'Escolha um dos temas disponíveis.' });
    }
    const usuarioId = locals.usuario.id;
    await banco.preferenciasMascote.upsert({
      where: { usuarioId },
      create: { usuarioId, temaEstante },
      update: { temaEstante }
    });
    return { recado: 'Tema da estante salvo.' };
  }
} satisfies Actions;
