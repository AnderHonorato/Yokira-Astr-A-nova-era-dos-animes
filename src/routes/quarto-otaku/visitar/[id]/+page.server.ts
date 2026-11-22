import { error } from '@sveltejs/kit';
import { quartoParaVisita } from '$servidor/quarto/ambiente';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  setHeaders({ 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' });
  const quarto = await quartoParaVisita(params.id);
  if (!quarto) error(404, 'Quarto indisponível para visitas.');
  return { quarto };
};
