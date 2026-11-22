import { banco } from '../banco/cliente';
import { buscarPorAfinidade } from './assistente';

export async function recomendarCatalogo(pergunta: string, soDisponiveis: boolean) {
  if (!pergunta.trim() || pergunta.length > 220) return [];
  const [catalogo, fontes] = await Promise.all([
    banco.titulo.findMany({
      where: { situacao: 'PUBLICADO' },
      select: {
        id: true,
        nome: true,
        ano: true,
        sinopse: true,
        slug: true,
        generos: { select: { genero: { select: { nome: true } } } }
      },
      orderBy: { nome: 'asc' }
    }),
    banco.fonteMidia.findMany({
      where: { ativa: true, estado: 'PRONTO', episodio: { publicadoEm: { lte: new Date() } } },
      select: { episodio: { select: { temporada: { select: { tituloId: true } } } } }
    })
  ]);
  const idsComFonte = new Set(fontes.map((f) => f.episodio.temporada.tituloId));
  const itens = catalogo
    .filter((t) => !soDisponiveis || idsComFonte.has(t.id))
    .map((t) => {
      const generos = t.generos.map((g) => g.genero.nome).join(' · ');
      return {
        nome: t.nome,
        ano: t.ano,
        slug: t.slug,
        generos,
        comFonte: idsComFonte.has(t.id),
        texto: [t.nome, t.nome, generos, generos, t.sinopse, t.ano].join(' ')
      };
    });
  const titulos = buscarPorAfinidade(pergunta, itens).map((t) => ({
    nome: t.nome,
    ano: t.ano,
    slug: t.slug,
    generos: t.generos,
    comFonte: t.comFonte
  }));
  return titulos;
}
