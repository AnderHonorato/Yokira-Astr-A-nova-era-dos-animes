import { recomendarCatalogo } from '$servidor/recomendacoes/catalogo-assistente';
import { buscarPorAfinidade, guias } from '$servidor/recomendacoes/assistente';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const pergunta = (url.searchParams.get('q') ?? '').trim().slice(0, 220);
  const soDisponiveis = url.searchParams.get('disponiveis') === '1';
  const ajuda = buscarPorAfinidade(
    pergunta,
    guias.map((g) => ({ ...g, texto: g.palavras }))
  ).slice(0, 1);
  if (!pergunta) return { pergunta, soDisponiveis, ajuda, titulos: [] };
  const titulos = await recomendarCatalogo(pergunta, soDisponiveis);
  return { pergunta, soDisponiveis, ajuda, titulos };
};
