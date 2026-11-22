import { expect, test } from '@playwright/test';

test('visitante vê convite e portal baseado no catálogo real', async ({ page }) => {
  await page.goto('/companheiros');
  await expect(page.getByRole('heading', { name: /Seu universo/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Entrar no Yōkira/ })).toBeVisible();
  await page.goto('/portal-astral');
  await expect(page.getByRole('heading', { name: /Todo gênero é um/ })).toBeVisible();
  await expect(page.locator('.portal-item').first()).toBeVisible();
  await page.goto('/biblioteca-magica');
  await expect(page.getByText(/Entre para sincronizar os animes/)).toBeVisible();
});

test('Astra desbloqueia por usuário, XP não duplica e biblioteca sincroniza lista', async ({
  page
}) => {
  test.setTimeout(120_000);
  const email = 'astra-e2e-' + Date.now() + '-' + Math.floor(Math.random() * 1e6) + '@yokira.local';
  await page.goto('/cadastrar');
  await page.getByLabel('Nome').fill('Guardiã Astra E2E');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha').fill('YokiraDemo2024');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/companheiros');
  await expect(page.getByRole('button', { name: /Desbloquear companheiro/ })).toBeVisible();
  await page.getByRole('button', { name: /Desbloquear companheiro/ }).click();
  await expect(page.locator('.universo-painel')).toBeVisible();
  await page.reload();
  await expect(page.locator('.universo-painel')).toBeVisible();
  await page.getByRole('button', { name: /Interagir com Astra/ }).click();
  await expect(page.getByText('Astra está feliz em te ver!')).toBeVisible();

  await page.getByRole('button', { name: 'Ver modelo 3D' }).click();
  const modelo = page.locator('canvas[aria-label*="tridimensional"]');
  await expect(modelo).toBeVisible();
  await expect
    .poll(() => modelo.evaluate((el) => (el as HTMLCanvasElement).width))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Fechar modelo 3D' }).click();

  await page.goto('/assistente?q=piratas');
  await page.getByRole('button', { name: 'Explorar com o mascote' }).first().click();
  await expect(page).toHaveURL(/\/titulo\//);
  await page.goto('/jornada');
  await expect(page.locator('article').filter({ hasText: 'Radar astral' })).toContainText('1 / 2');
  const catalogo = await (await page.request.get('/api/catalogo/completo')).json();
  const salvos: string[] = [];
  for (const genero of catalogo.generos) {
    const busca = await (
      await page.request.get('/api/catalogo/completo?genero=' + encodeURIComponent(genero.slug))
    ).json();
    const item = busca.itens.find((t: { id: string }) => !salvos.includes(t.id));
    if (!item) continue;
    const resposta = await page.evaluate(async (tituloId) => {
      const result = await fetch('/api/minha-lista', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tituloId })
      });
      return { status: result.status, body: await result.json().catch(() => null) };
    }, item.id);
    expect(resposta.status).toBe(200);
    salvos.push(item.id);
    if (salvos.length === 3) break;
  }
  expect(salvos).toHaveLength(3);
  await page.goto('/biblioteca-magica');
  await expect(page.locator('.biblioteca-livro')).toHaveCount(3);
  await page.goto('/companheiros');
  await page.getByRole('button', { name: /Conferir missão e receber XP/ }).click();
  await expect(page.getByText(/\+420 XP concedidos/)).toBeVisible();
  await page.reload();
  await expect(page.locator('.universo-progresso-cabecalho')).toContainText('Nível');
  await expect(page.locator('.universo-historico')).toContainText('+420 XP');
  await expect(page.getByRole('button', { name: /Missão concluída/ })).toBeDisabled();
});

test('nova interface mantém controles acessíveis no celular', async ({ page }) => {
  await page.goto('/companheiros');
  await expect(page.getByRole('heading', { name: /Seu universo/ })).toBeVisible();
  await page.goto('/portal-astral');
  await expect(page.getByRole('button', { name: 'Aplicar filtros' })).toBeVisible();
  await page.goto('/biblioteca-magica');
  const semOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth + 2
  );
  expect(semOverflow).toBe(true);
});
