import { error } from '@sveltejs/kit';
import { editoriais } from '$lib/catalogo-original';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
  const item = editoriais.find((e) => e.id === params.id);
  if (!item) error(404, 'Editorial não encontrado.');
  return { item };
};
