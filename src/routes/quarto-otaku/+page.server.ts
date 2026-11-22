import { fail } from '@sveltejs/kit';
import {
  meuQuarto,
  configurarQuarto,
  moverObjeto,
  EdicaoInvalida
} from '$servidor/quarto/ambiente';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'private, no-store' });
  return { quarto: locals.usuario ? await meuQuarto(locals.usuario.id) : null };
};

function numero(dados: FormData, chave: string) {
  const valor = dados.get(chave);
  return typeof valor === 'string' && valor.trim() ? Number(valor) : NaN;
}
function rejeitar(erro: unknown) {
  if (erro instanceof EdicaoInvalida) return fail(400, { mensagem: erro.message });
  throw erro;
}
export const actions: Actions = {
  ambiente: async ({ locals, request }) => {
    if (!locals.usuario) return fail(401, { mensagem: 'Entre para editar seu quarto.' });
    const dados = await request.formData();
    try {
      await configurarQuarto(
        locals.usuario.id,
        String(dados.get('tema')),
        String(dados.get('iluminacao')),
        dados.has('publico')
      );
      return { mensagem: 'Ambiente e permissão de visita salvos.' };
    } catch (erro) {
      return rejeitar(erro);
    }
  },
  mover: async ({ locals, request }) => {
    if (!locals.usuario) return fail(401, { mensagem: 'Entre para editar seu quarto.' });
    const dados = await request.formData();
    try {
      await moverObjeto(locals.usuario.id, String(dados.get('objeto')), {
        x: numero(dados, 'x'),
        y: numero(dados, 'y'),
        rotacao: numero(dados, 'rotacao'),
        colocado: dados.has('colocado')
      });
      return { mensagem: 'Posição do objeto salva.' };
    } catch (erro) {
      return rejeitar(erro);
    }
  }
};
