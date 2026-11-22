import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { catalogo, editoriais } from '../../src/lib/catalogo-original';
import { paraCartao, type TituloBruto } from '../../src/lib/servidor/banco/mapear-titulo';
import {
  prepararTituloOriginal,
  paraSlugOriginal
} from '../../scripts/sincronizar-catalogo-original';

describe('catálogo original trazido do site Yokira anterior', () => {
  it('tem vinte animes reais e editorial, sem títulos inventados', () => {
    expect(catalogo).toHaveLength(20);
    expect(editoriais.length).toBeGreaterThanOrEqual(4);
    expect(catalogo.some((item) => item.slug === 'one-piece')).toBe(true);
    expect(catalogo.some((item) => item.slug === 'frieren')).toBe(true);
    expect(new Set(catalogo.map((item) => item.slug)).size).toBe(20);
  });
  it('todas as capas e artes do catálogo estão disponíveis localmente', () => {
    for (const anime of catalogo) {
      expect(anime.poster.startsWith('/arte/')).toBe(true);
      expect(anime.capa.startsWith('/arte/')).toBe(true);
      for (const caminho of [anime.poster, anime.capa])
        expect(existsSync(join(process.cwd(), 'static', caminho.replace(/^\//, ''))), caminho).toBe(
          true
        );
    }
  });
  it('preserva nomes, slugs, ano e imagens e NÃO inventa vídeo do anime', () => {
    const dados = prepararTituloOriginal(
      catalogo.find((a) => a.slug === 'one-piece')!,
      1
    );
    expect(dados.slug).toBe('one-piece');
    expect(dados.posterUrl).toBe('/arte/one-piece.webp');
    expect(dados.arteHeroUrl).toBe('/arte/one-piece-capa.webp');
    expect(dados.tipo).toBe('SERIE');
    expect(dados).not.toHaveProperty('urlVideo');
  });
  it('recupera nota editorial da versão atual apenas quando ainda não há votos reais', () => {
    const bruto: TituloBruto = {
      id: 'original-one-piece',
      slug: 'one-piece',
      nome: 'One Piece',
      sinopse: 'Uma aventura.',
      ano: 1999,
      classificacao: 'NR',
      novidade: false,
      posterUrl: '/arte/one-piece.webp',
      arteHeroUrl: '/arte/one-piece-capa.webp',
      tipo: 'SERIE',
      totalVisualizacoes: 0,
      totalCurtidas: 0,
      temporadas: [{ numero: 1 }],
      generos: [],
      avaliacoes: []
    };
    expect(paraCartao(bruto).nota).toBe(8.7);
    expect(paraCartao(bruto).notaOrigem).toBe('editorial');
    expect(paraCartao({ ...bruto, avaliacoes: [{ nota: 10 }] }).nota).toBe(10);
    expect(paraCartao({ ...bruto, avaliacoes: [{ nota: 10 }] }).notaOrigem).toBe('comunidade');
  });
  it('normaliza gêneros com acentuação', () => {
    expect(paraSlugOriginal('Ação')).toBe('acao');
    expect(paraSlugOriginal('Ficção Científica')).toBe('ficcao-cientifica');
  });
});
