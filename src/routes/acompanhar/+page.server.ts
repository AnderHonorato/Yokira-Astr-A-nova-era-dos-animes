import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });
  const documento = await readFile(resolve('CHECKLIST-UNIVERSO-YOKIRA.md'), 'utf8');
  return { documento };
};
