import { beforeAll, afterAll, expect, it } from 'vitest';
import { criarBancoDeTeste, type BancoDeTeste } from './preparar-banco';
import {
  configurarQuarto,
  meuQuarto,
  moverObjeto,
  quartoParaVisita
} from '../../src/lib/servidor/quarto/ambiente';
import { desbloquearAstra } from '../../src/lib/servidor/mascotes/colecao';
import { experienciaParaNivel } from '../../src/lib/mascotes/regras';

let ambiente: BancoDeTeste;
let id: string;
beforeAll(async () => {
  ambiente = criarBancoDeTeste();
  const usuario = await ambiente.banco.usuario.create({
    data: { email: 'quarto@yokira.local', nome: 'Lua', senhaHash: 'x' }
  });
  id = usuario.id;
}, 120_000);
afterAll(async () => {
  await ambiente?.encerrar();
});

it('persiste inventário, posição e privacidade, aplica níveis e respeita títulos despublicados', async () => {
  const banco = ambiente.banco;
  const quarto = await meuQuarto(id, banco);
  expect(quarto.objetos).toHaveLength(3);
  expect(await quartoParaVisita(quarto.id, banco)).toBeNull();
  const posicao = { x: 22, y: 66, rotacao: 30, colocado: true };
  const peca = quarto.objetos[0];
  await expect(moverObjeto('outra-conta', peca.id, posicao, banco)).rejects.toThrow();
  await expect(moverObjeto(id, peca.id, { ...posicao, x: 98 }, banco)).rejects.toThrow();
  await moverObjeto(id, peca.id, posicao, banco);
  await configurarQuarto(id, 'sakura', 'aurora', true, banco);
  const visita = await quartoParaVisita(quarto.id, banco);
  expect(visita?.tema).toBe('sakura');
  expect(visita?.objetos.find((p) => p.id === peca.id)).toMatchObject(posicao);
  const pet = await desbloquearAstra(id, banco);
  await banco.companheiroMascote.update({
    where: { id: pet.id },
    data: { experiencia: experienciaParaNivel(10) }
  });
  const titulo = await banco.titulo.create({
    data: { slug: 'quarto-anime', nome: 'Poster real', sinopse: 'x', ano: 2026 }
  });
  await banco.itemLista.create({ data: { usuarioId: id, tituloId: titulo.id } });
  const ampliado = await meuQuarto(id, banco);
  expect(ampliado.objetos).toHaveLength(5);
  expect(ampliado.objetos.some((p) => p.chave === 'cristal')).toBe(true);
  const poster = ampliado.objetos.find((p) => p.titulo?.nome === titulo.nome)!;
  await moverObjeto(id, poster.id, posicao, banco);
  expect((await quartoParaVisita(quarto.id, banco))?.objetos.some((p) => p.id === poster.id)).toBe(
    true
  );
  await banco.titulo.update({ where: { id: titulo.id }, data: { situacao: 'DESPUBLICADO' } });
  expect((await quartoParaVisita(quarto.id, banco))?.objetos.some((p) => p.id === poster.id)).toBe(
    false
  );
  await configurarQuarto(id, 'sakura', 'aurora', false, banco);
  expect(await quartoParaVisita(quarto.id, banco)).toBeNull();
});
