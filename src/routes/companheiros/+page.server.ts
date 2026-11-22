import { fail } from '@sveltejs/kit';
import {
  listarColecao,
  desbloquearAstra,
  equiparMascote,
  concederMissaoGeneros,
  personalizarMascote,
  atualizarPreferenciasMascote,
  MISSAO_GENEROS
} from '$servidor/mascotes/colecao';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'private, no-store' });
  if (!locals.usuario) return { precisaEntrar: true, colecao: null, missao: MISSAO_GENEROS };
  return {
    precisaEntrar: false,
    colecao: await listarColecao(locals.usuario.id),
    missao: MISSAO_GENEROS
  };
};

function obrigarSessao(locals: App.Locals) {
  if (!locals.usuario) throw new Error('Entre na conta para continuar.');
  return locals.usuario.id;
}

function textoErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Não foi possível realizar a operação.';
}

export const actions: Actions = {
  despertar: async ({ locals }) => {
    try {
      const id = obrigarSessao(locals);
      await desbloquearAstra(id);
      return { recado: 'Astra despertou! Seu primeiro companheiro já está na coleção.' };
    } catch (erro) {
      return fail(400, { recado: textoErro(erro) });
    }
  },
  equipar: async ({ locals, request }) => {
    try {
      const id = obrigarSessao(locals);
      const dados = await request.formData();
      const companheiroId = String(dados.get('companheiroId') ?? '');
      if (!companheiroId || companheiroId.length > 100)
        return fail(400, { recado: 'Mascote inválido.' });
      await equiparMascote(id, companheiroId);
      return { recado: 'Companheiro equipado.' };
    } catch (erro) {
      return fail(400, { recado: textoErro(erro) });
    }
  },
  missao: async ({ locals, request }) => {
    try {
      const id = obrigarSessao(locals);
      const dados = await request.formData();
      const companheiroId = String(dados.get('companheiroId') ?? '');
      if (!companheiroId || companheiroId.length > 100)
        return fail(400, { recado: 'Mascote inválido.' });
      const r = await concederMissaoGeneros(id, companheiroId);
      return {
        recado: r.ganhou
          ? 'Missão concluída! +420 XP concedidos uma única vez.'
          : 'Essa recompensa já foi recebida.'
      };
    } catch (erro) {
      return fail(400, { recado: textoErro(erro) });
    }
  },
  aparencia: async ({ locals, request }) => {
    try {
      const id = obrigarSessao(locals);
      const dados = await request.formData();
      await personalizarMascote(
        id,
        String(dados.get('companheiroId') ?? ''),
        String(dados.get('forma') ?? ''),
        String(dados.get('cor') ?? '')
      );
      return { recado: 'Aparência salva na sua conta.' };
    } catch (erro) {
      return fail(400, { recado: textoErro(erro) });
    }
  },
  preferencias: async ({ locals, request }) => {
    try {
      const id = obrigarSessao(locals);
      const dados = await request.formData();
      await atualizarPreferenciasMascote(id, {
        visivel: dados.has('visivel'),
        acompanhar: dados.has('acompanhar'),
        posicao: String(dados.get('posicao') ?? 'direita')
      });
      return { recado: 'Preferências sincronizadas com sua conta.' };
    } catch (erro) {
      return fail(400, { recado: textoErro(erro) });
    }
  }
};
