import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { criarBancoDeTeste, type BancoDeTeste } from './preparar-banco';
import {
  listarColecao,
  desbloquearAstra,
  equiparMascote,
  concederMissaoGeneros,
  personalizarMascote,
  atualizarPreferenciasMascote
} from '../../src/lib/servidor/mascotes/colecao';

let ambiente: BancoDeTeste;
let usuarioId = '';
let outroUsuarioId = '';
beforeAll(async () => {
  ambiente = criarBancoDeTeste();
  const u = await ambiente.banco.usuario.create({
    data: { email: 'mascote-teste@yokira.local', nome: 'Astra', senhaHash: 'x' }
  });
  usuarioId = u.id;
  const v = await ambiente.banco.usuario.create({
    data: { email: 'mascote-outro@yokira.local', nome: 'Outra', senhaHash: 'x' }
  });
  outroUsuarioId = v.id;
}, 120_000);
afterAll(async () => {
  await ambiente?.encerrar();
});

describe('coleção de mascotes persistida no SQLite real', () => {
  it('novo usuário começa sem mascote e desbloqueia apenas uma vez', async () => {
    const inicial = await listarColecao(usuarioId, ambiente.banco);
    expect(inicial.mascotes).toHaveLength(0);
    const primeiro = await desbloquearAstra(usuarioId, ambiente.banco);
    const repetido = await desbloquearAstra(usuarioId, ambiente.banco);
    expect(primeiro.id).toBe(repetido.id);
    expect(await ambiente.banco.companheiroMascote.count({ where: { usuarioId } })).toBe(1);
    expect((await listarColecao(usuarioId, ambiente.banco)).equipado?.id).toBe(primeiro.id);
    expect((await listarColecao(outroUsuarioId, ambiente.banco)).mascotes).toHaveLength(0);
  });

  it('não deixa equipar o mascote de outra conta', async () => {
    const meu = (await listarColecao(usuarioId, ambiente.banco)).mascotes[0];
    await expect(equiparMascote(outroUsuarioId, meu.id, ambiente.banco)).rejects.toThrow();
    expect((await listarColecao(outroUsuarioId, ambiente.banco)).equipado).toBeNull();
  });

  it('concede XP de missão validada no banco somente uma vez, com transação', async () => {
    const pet = (await listarColecao(usuarioId, ambiente.banco)).mascotes[0];
    await expect(concederMissaoGeneros(usuarioId, pet.id, ambiente.banco)).rejects.toThrow();
    for (let i = 0; i < 3; i++) {
      const genero = await ambiente.banco.genero.create({
        data: { slug: 'mascote-genero-' + i, nome: 'Gênero de teste ' + i }
      });
      const titulo = await ambiente.banco.titulo.create({
        data: { slug: 'mascote-titulo-' + i, nome: 'Título ' + i, sinopse: 'Teste', ano: 2025 }
      });
      await ambiente.banco.tituloGenero.create({
        data: { tituloId: titulo.id, generoId: genero.id }
      });
      await ambiente.banco.itemLista.create({ data: { tituloId: titulo.id, usuarioId } });
    }
    const ganho = await concederMissaoGeneros(usuarioId, pet.id, ambiente.banco);
    expect(ganho.ganhou).toBe(true);
    expect(ganho.experiencia).toBe(420);
    const repetido = await concederMissaoGeneros(usuarioId, pet.id, ambiente.banco);
    expect(repetido.ganhou).toBe(false);
    expect(repetido.experiencia).toBe(420);
    expect(
      await ambiente.banco.eventoMascote.count({
        where: { companheiroId: pet.id, chave: 'generos-3' }
      })
    ).toBe(1);
  });

  it('impede forma futura e cores não conquistadas; salva forma anterior válida', async () => {
    const pet = (await listarColecao(usuarioId, ambiente.banco)).mascotes[0];
    await expect(
      personalizarMascote(usuarioId, pet.id, 'lendaria', 'violeta', ambiente.banco)
    ).rejects.toThrow();
    await expect(
      personalizarMascote(usuarioId, pet.id, 'despertar', 'rosa', ambiente.banco)
    ).rejects.toThrow();
    await personalizarMascote(usuarioId, pet.id, 'despertar', 'azul', ambiente.banco);
    expect((await listarColecao(usuarioId, ambiente.banco)).mascotes[0].corAura).toBe('azul');
  });

  it('salva preferências sem destruir coleção nem XP', async () => {
    await atualizarPreferenciasMascote(
      usuarioId,
      { visivel: false, acompanhar: false, posicao: 'esquerda' },
      ambiente.banco
    );
    const colecao = await listarColecao(usuarioId, ambiente.banco);
    expect(colecao.preferencias.visivel).toBe(false);
    expect(colecao.preferencias.posicao).toBe('esquerda');
    expect(colecao.mascotes).toHaveLength(1);
    expect(colecao.mascotes[0].experiencia).toBe(420);
  });
});
