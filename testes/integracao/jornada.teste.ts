import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { criarBancoDeTeste, type BancoDeTeste } from './preparar-banco';
import {
  aferirReproducao,
  coberturaSeguinte,
  lerJornada,
  resgatarDesafio
} from '../../src/lib/servidor/mascotes/jornada';
import { desbloquearAstra, equiparMascote } from '../../src/lib/servidor/mascotes/colecao';

describe('Jornada com evidência de reprodução', () => {
  let ambiente: BancoDeTeste;
  let usuarioId: string, episodioId: string;
  beforeAll(async () => {
    ambiente = criarBancoDeTeste();
    const db = ambiente.banco;
    const usuario = await db.usuario.create({
      data: { nome: 'Exploradora', email: 'jornada@example.test', senhaHash: 'x' }
    });
    usuarioId = usuario.id;
    const pet = await desbloquearAstra(usuarioId, db);
    await db.companheiroMascote.update({ where: { id: pet.id }, data: { experiencia: 1780 } });
    for (let i = 0; i < 5; i++) {
      const titulo = await db.titulo.create({
        data: { nome: 'Obra ' + i, slug: 'obra-' + i, sinopse: 'teste', ano: 2026 }
      });
      await db.itemLista.create({ data: { usuarioId, tituloId: titulo.id } });
      if (i === 0) {
        const temporada = await db.temporada.create({
          data: { tituloId: titulo.id, numero: 1, nome: 'I' }
        });
        const episodio = await db.episodio.create({
          data: { temporadaId: temporada.id, numero: 1, nome: 'Piloto', duracaoSegundos: 60 }
        });
        episodioId = episodio.id;
        await db.fonteMidia.create({
          data: {
            episodioId,
            tipo: 'DIRETO',
            ativa: true,
            estado: 'PRONTO',
            chaveIdempotencia: 'fonte',
            assinaturaPedido: 'teste'
          }
        });
      }
    }
  }, 120000);
  afterAll(async () => {
    await ambiente?.encerrar();
  });
  it('ignora saltos, repetições e intervalos excessivos', () => {
    expect(coberturaSeguinte(0, 0, 60, 1000)).toBe(0);
    expect(coberturaSeguinte(10, 55, 60, 5000)).toBe(10);
    expect(coberturaSeguinte(15, 0, 15, 15000)).toBe(15);
    expect(coberturaSeguinte(0, 0, 60, 90000)).toBe(0);
  });
  it('registra conclusão e evolução uma vez e mantém recompensas vinculadas à conta', async () => {
    const db = ambiente.banco;
    const inicio = Date.now() + 1000;
    await expect(resgatarDesafio(usuarioId, 'anime', db)).rejects.toThrow('andamento');
    for (const segundo of [0, 15, 30, 45, 60, 60])
      await aferirReproducao(usuarioId, episodioId, segundo, db, new Date(inicio + segundo * 1000));
    const evolucao = await db.eventoMascote.findMany({ where: { tipo: 'EVOLUCAO' } });
    expect(evolucao.map((e) => e.descricao)).toEqual(['Guardião']);
    expect(await db.eventoMascote.count({ where: { tipo: 'EPISODIO' } })).toBe(1);
    expect((await lerJornada(usuarioId, db)).missoes.find((m) => m.chave === 'anime')?.atual).toBe(
      1
    );
    expect(await resgatarDesafio(usuarioId, 'colecionador', db)).toBe(true);
    const luna = await db.companheiroMascote.findUniqueOrThrow({
      where: { usuarioId_especieId: { usuarioId, especieId: 'luna' } }
    });
    expect(luna.experiencia).toBe(0);
    await equiparMascote(usuarioId, luna.id, db);
    expect(await resgatarDesafio(usuarioId, 'colecionador', db)).toBe(false);
    expect(await resgatarDesafio(usuarioId, 'anime', db)).toBe(true);
    expect(
      (await db.companheiroMascote.findUniqueOrThrow({ where: { id: luna.id } })).experiencia
    ).toBe(900);
  });
});
