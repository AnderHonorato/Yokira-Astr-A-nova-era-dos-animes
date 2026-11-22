import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('o dono decora o quarto e controla o acesso de visitantes', async ({ page, request }) => {
  await page.goto('/cadastrar');
  await page.getByLabel('Nome').fill('Visitante Lunar');
  await page.getByLabel('E-mail').fill('quarto-' + randomUUID() + '@yokira.local');
  await page.getByLabel('Senha').fill('YokiraQuarto2026');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/quarto-otaku');
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('sakura');
  await page.getByLabel('Permitir visitas pelo link').check();
  await page.getByRole('button', { name: 'Salvar ambiente' }).click();
  const visitar = page.getByRole('link', { name: 'Abrir link de visita' });
  await expect(visitar).toBeVisible();
  const caminho = (await visitar.getAttribute('href'))!;
  await page.locator('summary').filter({ hasText: 'Estante de mangás' }).click();
  const detalhe = page.locator('details[open]');
  await detalhe.getByLabel('Rotação (graus)').fill('45');
  await detalhe.getByRole('button', { name: 'Salvar posição' }).click();
  await expect(page.locator('.quarto').getByRole('status')).toContainText(
    'Posição do objeto salva'
  );
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Tema', exact: true })).toHaveValue('sakura');
  await page.locator('summary').filter({ hasText: 'Estante de mangás' }).click();
  await expect(page.locator('details[open]').getByLabel('Rotação (graus)')).toHaveValue('45');
  const publico = await request.get(caminho);
  expect(publico.status()).toBe(200);
  expect(await publico.text()).toContain('Visita ao Quarto Otaku');
  await page.getByLabel('Permitir visitas pelo link').uncheck();
  await page.getByRole('button', { name: 'Salvar ambiente' }).click();
  await expect(visitar).toHaveCount(0);
  expect((await request.get(caminho)).status()).toBe(404);
});
