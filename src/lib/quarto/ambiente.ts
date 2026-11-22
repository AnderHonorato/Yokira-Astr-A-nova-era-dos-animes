export const temas = {
  observatorio: 'Observatório',
  sakura: 'Jardim Sakura',
  oceano: 'Mar de estrelas'
};
export const luzes = { luar: 'Luar', aurora: 'Aurora', poente: 'Pôr do sol' };
export const decoracoes: Record<string, { nome: string; detalhe: string }> = {
  tapete: { nome: 'Tapete lunar', detalhe: 'Tecelagem' },
  estante: { nome: 'Estante de mangás', detalhe: 'Mobília' },
  descanso: { nome: 'Almofada do guardião', detalhe: 'Descanso do mascote' },
  cristal: { nome: 'Cristal do guardião', detalhe: 'Recompensa do nível 10' }
};

export interface Peca {
  id: string;
  chave: string;
  titulo: { nome: string; posterUrl: string | null } | null;
  x: number;
  y: number;
  rotacao: number;
  colocado: boolean;
}

export function nomeDaPeca(peca: Peca) {
  return peca.titulo?.nome ?? decoracoes[peca.chave]?.nome ?? 'Decoração';
}
