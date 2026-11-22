const palavrasComuns = new Set(
  'para por como que com dos das uma quero onde posso tenho gostaria recomenda recomende anime animes sobre mais algum quais meu minha mostre assistir'.split(
    ' '
  )
);

function termos(texto: string) {
  return (
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .match(/[a-z0-9]+/g)
      ?.filter((t) => t.length > 2 && !palavrasComuns.has(t)) ?? []
  );
}

/** Classificação vetorial local, treinada sobre os títulos e guias disponíveis nesta consulta. */
export function buscarPorAfinidade<T extends { texto: string }>(consulta: string, itens: T[]) {
  const pergunta = termos(consulta);
  const documentos = itens.map((item) => termos(item.texto));
  const frequencias = new Map<string, number>();
  for (const documento of documentos) {
    for (const termo of new Set(documento))
      frequencias.set(termo, (frequencias.get(termo) ?? 0) + 1);
  }
  function vetor(documento: string[]) {
    const resultado = new Map<string, number>();
    for (const termo of documento) {
      const peso = 1 + Math.log((1 + itens.length) / (1 + (frequencias.get(termo) ?? 0)));
      resultado.set(termo, (resultado.get(termo) ?? 0) + peso);
    }
    return resultado;
  }
  const q = vetor(pergunta);
  const norma = (v: Map<string, number>) => Math.hypot(...v.values());
  const normaQ = norma(q);
  if (!normaQ) return [];
  return itens
    .map((item, i) => {
      const v = vetor(documentos[i]);
      let soma = 0;
      for (const [termo, peso] of q) soma += (v.get(termo) ?? 0) * peso;
      return { item, pontos: soma / (normaQ * norma(v) || 1) };
    })
    .filter((c) => c.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 4)
    .map((c) => c.item);
}

export const guias = [
  {
    nome: 'Desbloquear e equipar seu companheiro',
    destino: '/companheiros',
    resumo:
      'Entre na sua conta e conclua a missão introdutória em Companheiros. Abra sua coleção para equipar o Astra.',
    palavras:
      'mascote mascotes desbloquear conquistar adotar equipar companheiro companheiros primeiro gratuito'
  },
  {
    nome: 'Evoluir seu companheiro',
    destino: '/companheiros',
    resumo:
      'Acompanhe o nível e a experiência em Companheiros. Abra a árvore para ver requisitos e selecionar uma forma já conquistada.',
    palavras: 'evoluir evolução experiência nível xp formas árvore cor aparência'
  },
  {
    nome: 'Explorar por gênero',
    destino: '/portal-astral',
    resumo:
      'Selecione um ambiente no Portal Astral e refine por ano, avaliação ou presença de fonte ativa.',
    palavras: 'portal explorar gêneros filtros filtrar avaliação ano'
  },
  {
    nome: 'Organizar sua biblioteca',
    destino: '/biblioteca-magica',
    resumo:
      'Salve um título na sua lista e abra a Biblioteca Mágica para encontrá-lo na estante correspondente.',
    palavras: 'biblioteca estante livros lista salvar favoritos progresso'
  },
  {
    nome: 'Decorar o Quarto Otaku',
    destino: '/quarto-otaku',
    resumo:
      'Abra seu quarto para posicionar os itens do inventário e escolher iluminação, tema e permissão de visita.',
    palavras: 'quarto otaku decorar decoração mover girar móveis itens inventário visita'
  }
];
