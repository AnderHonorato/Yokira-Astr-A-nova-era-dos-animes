import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });
  const documento = await readFile(resolve('CHECKLIST-UNIVERSO-YOKIRA.md'), 'utf8');
  const linhas = documento
    .split(/\r?\n/)
    .filter((l) => l.startsWith('|'))
    .slice(2);
  return {
    itens: linhas.map((l) => {
      const [area, situacao, detalhe] = l
        .split('|')
        .slice(1, 4)
        .map((c) => c.trim().replaceAll('`', ''));
      return { area, situacao, detalhe };
    })
  };
};
