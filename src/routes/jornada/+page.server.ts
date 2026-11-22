import { fail } from '@sveltejs/kit';
import { lerJornada, resgatarDesafio } from '$servidor/mascotes/jornada';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'private, no-store' });
  return { jornada: locals.usuario ? await lerJornada(locals.usuario.id) : null };
};

export const actions: Actions = {
  resgatar: async ({ locals, request }) => {
    if (!locals.usuario) return fail(401, { mensagem: 'Entre para resgatar recompensas.' });
    try {
      const dados = await request.formData();
      const ganhou = await resgatarDesafio(locals.usuario.id, String(dados.get('missao')));
      return {
        mensagem: ganhou ? 'Recompensa adicionada à sua conta.' : 'Você já recebeu esta recompensa.'
      };
    } catch (erro) {
      return fail(400, { mensagem: erro instanceof Error ? erro.message : 'Falha ao resgatar.' });
    }
  }
};
