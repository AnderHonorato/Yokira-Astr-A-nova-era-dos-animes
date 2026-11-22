import { describe, expect, it } from 'vitest';
import {
  FORMAS_ASTRA,
  COR_AURA_PERMITIDA,
  nivelPorExperiencia,
  experienciaParaNivel,
  calcularProgressao,
  formaDesbloqueada,
  validarCorAura
} from '../../src/lib/mascotes/regras';

describe('progressão de mascotes', () => {
  it('começa no nível 1 sem experiência nem forma extra', () => {
    expect(nivelPorExperiencia(0)).toBe(1);
    expect(calcularProgressao(0).proximoNivel).toBe(2);
    expect(formaDesbloqueada(1).id).toBe('despertar');
  });

  it('permite 5 formas em níveis configurados', () => {
    expect(FORMAS_ASTRA.map((x) => x.nivelMinimo)).toEqual([1, 10, 25, 50, 80]);
    for (const [nivel, id] of [
      [9, 'despertar'],
      [10, 'guardiao'],
      [24, 'guardiao'],
      [25, 'astral'],
      [49, 'astral'],
      [50, 'celestial'],
      [79, 'celestial'],
      [80, 'lendaria']
    ] as const) {
      expect(formaDesbloqueada(nivel).id).toBe(id);
    }
  });

  it('não concede nível artificial sem experiência', () => {
    for (const n of [2, 9, 10, 25, 50, 80]) {
      expect(nivelPorExperiencia(experienciaParaNivel(n) - 1)).toBe(n - 1);
      expect(nivelPorExperiencia(experienciaParaNivel(n))).toBe(n);
    }
  });

  it('calcula barra de XP e restante sem porcentagens inválidas', () => {
    const xp = experienciaParaNivel(10) + 10;
    const result = calcularProgressao(xp);
    expect(result.nivel).toBe(10);
    expect(result.porcentagem).toBeGreaterThanOrEqual(0);
    expect(result.porcentagem).toBeLessThanOrEqual(100);
    expect(result.restante).toBeGreaterThan(0);
  });

  it('recusa experiência negativa ou não inteira', () => {
    expect(() => nivelPorExperiencia(-1)).toThrow();
    expect(() => nivelPorExperiencia(Number.NaN)).toThrow();
    expect(() => nivelPorExperiencia(1.5)).toThrow();
  });

  it('somente aceita cores cosméticas controladas', () => {
    expect(COR_AURA_PERMITIDA).toContain('violeta');
    expect(validarCorAura('violeta')).toBe('violeta');
    expect(() => validarCorAura('url(javascript:alert(1))')).toThrow();
  });
});
