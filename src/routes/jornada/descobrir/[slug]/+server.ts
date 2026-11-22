import { error, redirect } from '@sveltejs/kit';
import { banco } from '$servidor/banco/cliente';
import { recomendarCatalogo } from '$servidor/recomendacoes/catalogo-assistente';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request, params, url }) => {
  if (!locals.usuario) redirect(303, '/entrar');
  if (request.headers.get('origin') !== url.origin) error(403, 'Origem inválida.');
  const dados = await request.formData();
  const q = String(dados.get('q') ?? '')
    .trim()
    .slice(0, 220);
  const sugestoes = await recomendarCatalogo(q, dados.get('disponiveis') === '1');
  if (!sugestoes.some((t) => t.slug === params.slug))
    error(400, 'Escolha um título recomendado por Astra.');
  const usuarioId = locals.usuario.id,
    chave = 'descoberta/' + params.slug;
  await banco.conquistaJornada.upsert({
    where: { usuarioId_chave: { usuarioId, chave } },
    create: { usuarioId, chave },
    update: {}
  });
  redirect(303, '/titulo/' + encodeURIComponent(params.slug));
};
