import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { selecionarAplicacao } from './roteamento-yokira.mjs';
test('a home, busca e a API existentes pertencem ao site verdadeiro', () => {
  for (const x of [
    '/',
    '/?p=agenda',
    '/?p=comunidade',
    '/?p=salas',
    '/arte/cenarios/01-sakura-luar.webp',
    '/api/yokira?acao=banners',
    '/_next/static/runtime.js'
  ])
    assert.equal(selecionarAplicacao(x), 'site', x);
});
test('rotas do universo utilizam SvelteKit/Prisma sem conflitar com o site', () => {
  for (const x of [
    '/companheiros',
    '/companheiros?aba=colecao',
    '/portal-astral',
    '/biblioteca-magica',
    '/entrar',
    '/api/catalogo',
    '/api/mascotes',
    '/_app/immutable/assets/foo.css',
    '/marca/emblema-yokira.png',
    '/service-worker.js'
  ])
    assert.equal(selecionarAplicacao(x), 'universo', x);
});
test('não encaminha rotas semelhantes por prefixo acidental', () => {
  for (const x of ['/companheiros-falso', '/api/yokira-v2', '/portal-astral-falso'])
    assert.notEqual(selecionarAplicacao(x), x === '/api/yokira-v2' ? 'site' : 'universo', x);
});

test('o frontend original exibe acessos reais ao universo sem trocar a aplicação original', async () => {
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const local = fileURLToPath(new URL('../versao-sites/app/portal.tsx', import.meta.url));
  const code = readFileSync(local, 'utf8');
  for (const path of ['/companheiros', '/portal-astral', '/biblioteca-magica'])
    assert.ok(code.includes('href="' + path + '"'), path);
  assert.ok(code.includes("pagina==='inicio'"), 'home original permanece na origem');
});
