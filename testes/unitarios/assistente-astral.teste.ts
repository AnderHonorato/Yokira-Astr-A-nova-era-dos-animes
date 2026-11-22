import { describe, it, expect } from 'vitest';
import { buscarPorAfinidade, guias } from '../../src/lib/servidor/recomendacoes/assistente';

describe('recuperação local do assistente', () => {
  const candidatos = [{ texto: 'aventura piratas oceano' }, { texto: 'fantasia magia aventura' }];
  it('classifica o item real compatível em primeiro', () => {
    expect(buscarPorAfinidade('Quero um anime sobre piratas', candidatos)).toEqual([candidatos[0]]);
  });
  it('não inventa títulos para consultas desconhecidas ou vazias', () => {
    expect(buscarPorAfinidade('submarinos', candidatos)).toEqual([]);
    expect(buscarPorAfinidade('', candidatos)).toEqual([]);
  });
  it('resolve acentos e identifica ajuda sobre evolução', () => {
    const docs = guias.map((g) => ({ ...g, texto: g.palavras }));
    expect(buscarPorAfinidade('como funciona a evolucao?', docs)[0]?.nome).toBe(
      'Evoluir seu companheiro'
    );
  });
});
