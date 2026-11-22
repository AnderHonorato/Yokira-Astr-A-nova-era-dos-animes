/**
 * Importa metadados e artes da versão Yokira hospedada anteriormente.
 * Não copia contas, vídeos protegidos nem cria fontes de reprodução fictícias.
 * Por padrão preserva títulos e alterações preexistentes.
 */
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/lib/servidor/banco/gerado/client.js';
import { catalogo, type Anime } from '../src/lib/catalogo-original.js';
import { TITULOS } from '../prisma/dados-ficticios.js';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function paraSlugOriginal(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function prepararTituloOriginal(anime: Anime, indice: number) {
  return {
    slug: anime.slug,
    nome: anime.nome,
    sinopse: anime.sinopse,
    ano: anime.ano,
    classificacao: 'NR',
    tipo: anime.tipo === 'Filme' ? ('FILME' as const) : ('SERIE' as const),
    posterUrl: anime.poster,
    arteHeroUrl: anime.capa,
    situacao: 'PUBLICADO' as const,
    destaque: ['one-piece', 'frieren', 'bleach'].includes(anime.slug),
    novidade: anime.ano >= 2025,
    emAlta: indice < 10,
    popularidade: Math.max(1, 3000 - indice * 55)
  };
}

export async function importarCatalogoOriginal({
  urlBanco = process.env.DATABASE_URL ?? 'file:./dev.db',
  ocultarDemonstracao = false,
  atualizarExistentes = false
} = {}) {
  const cliente = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: urlBanco }) });
  let importados = 0,
    atualizados = 0,
    ocultados = 0,
    episodios = 0;
  try {
    for (const [indice, anime] of catalogo.entries()) {
      const dados = prepararTituloOriginal(anime, indice);
      const existente = await cliente.titulo.findUnique({ where: { slug: anime.slug } });
      const titulo = existente
        ? await cliente.titulo.update({
            where: { id: existente.id },
            data: atualizarExistentes
              ? dados
              : {
                  posterUrl: existente.posterUrl ?? dados.posterUrl,
                  arteHeroUrl: existente.arteHeroUrl ?? dados.arteHeroUrl
                }
          })
        : await cliente.titulo.create({ data: dados });
      if (existente) atualizados++;
      else importados++;

      for (const nome of anime.generos) {
        const genero = await cliente.genero.upsert({
          where: { slug: paraSlugOriginal(nome) },
          create: { nome, slug: paraSlugOriginal(nome) },
          update: {}
        });
        await cliente.tituloGenero.upsert({
          where: { tituloId_generoId: { tituloId: titulo.id, generoId: genero.id } },
          create: { tituloId: titulo.id, generoId: genero.id },
          update: {}
        });
      }
      // Episódios são apenas referências editoriais: nenhuma mídia é adicionada.
      // "episodios: 0" significa contagem não verificada, não há episódios a criar.
      if (anime.episodios > 0) {
        const temporada = await cliente.temporada.upsert({
          where: { tituloId_numero: { tituloId: titulo.id, numero: 1 } },
          create: { tituloId: titulo.id, numero: 1, nome: 'Temporada 1' },
          update: {}
        });
        for (let numero = 1; numero <= anime.episodios; numero++) {
          const existe = await cliente.episodio.findUnique({
            where: { temporadaId_numero: { temporadaId: temporada.id, numero } }
          });
          if (!existe) {
            await cliente.episodio.create({
              data: {
                temporadaId: temporada.id,
                numero,
                nome: anime.tipo === 'Filme' ? 'Filme completo' : `Episódio ${numero}`,
                duracaoSegundos: anime.duracao * 60
              }
            });
            episodios++;
          }
        }
      }
    }
    if (ocultarDemonstracao) {
      const fakeSlugs = TITULOS.map((t) => t.slug).filter(
        (slug) => !catalogo.some((anime) => anime.slug === slug)
      );
      const result = await cliente.titulo.updateMany({
        where: { slug: { in: fakeSlugs }, situacao: 'PUBLICADO' },
        data: { situacao: 'DESPUBLICADO' }
      });
      ocultados = result.count;
    }
    return { importados, atualizados, ocultados, episodios };
  } finally {
    await cliente.$disconnect();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const resultado = await importarCatalogoOriginal({
    ocultarDemonstracao: process.argv.includes('--ocultar-demo'),
    atualizarExistentes: process.argv.includes('--atualizar-existentes')
  });
  console.log('Catálogo atual importado:', JSON.stringify(resultado));
}
