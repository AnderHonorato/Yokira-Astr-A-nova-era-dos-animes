import { test, expect } from '@playwright/test';

test('home recupera identidade, ranking e conteúdo original com capas reais', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Acervo de animes', level: 1 })).toBeVisible();
  await expect(page.getByText('20 títulos disponíveis para explorar')).toBeVisible();
  await expect(page.locator('.yka-melhores li')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'One Piece' })).toBeVisible();
  const imgs = page.locator(
    '.yka-cenario-copy img, .yka-melhores img, .yka-banner-cenario, .yka-banner-personagem'
  );
  const estado = await imgs.evaluateAll((items) =>
    items.map((img) => ({
      url: img.getAttribute('src'),
      loaded: (img as HTMLImageElement).naturalWidth > 0
    }))
  );
  expect(estado.length).toBeGreaterThanOrEqual(6);
  expect(estado.every((x) => x.loaded)).toBe(true);
  await expect(page.locator('.yka-titulo').first()).toBeVisible();
  await expect(page.locator('.yka-editorial-card').first()).toBeVisible();
  await page.locator('.yka-editorial-card').first().click();
  await expect(
    page.getByRole('heading', { name: 'Por onde começar no mundo dos animes?' })
  ).toBeVisible();
});

test('home mantém aparência funcional em 390px sem overflow horizontal', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.yka-cenario')).toBeVisible();
  await expect(page.getByRole('link', { name: /Explorar acervo/ }).first()).toBeVisible();
  const medida = await page.evaluate(() => ({
    tela: innerWidth,
    documento: document.documentElement.scrollWidth
  }));
  expect(medida.documento).toBeLessThanOrEqual(medida.tela + 2);
  await page
    .getByRole('link', { name: /Portal Astral/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: /Todo gênero é um/ })).toBeVisible();
});
