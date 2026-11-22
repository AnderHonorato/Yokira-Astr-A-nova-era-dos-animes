// Regras puras compartilhadas entre API, telas e testes. Não confie em nível enviado pelo cliente.
export const FORMAS_ASTRA = [
  {
    id: 'despertar',
    nome: 'Despertar',
    nivelMinimo: 1,
    detalhe: 'Primeiros passos e expressão curiosa'
  },
  {
    id: 'guardiao',
    nome: 'Guardião',
    nivelMinimo: 10,
    detalhe: 'Marcas luminosas e novas expressões'
  },
  {
    id: 'astral',
    nome: 'Guardião Astral',
    nivelMinimo: 25,
    detalhe: 'Cauda iluminada e aura orbital'
  },
  {
    id: 'celestial',
    nome: 'Guardião Celestial',
    nivelMinimo: 50,
    detalhe: 'Halo celestial e movimentos exclusivos'
  },
  {
    id: 'lendaria',
    nome: 'Forma Lendária',
    nivelMinimo: 80,
    detalhe: 'Constelações e luz astral rara'
  }
] as const;
export type FormaAstraId = (typeof FORMAS_ASTRA)[number]['id'];

export const COR_AURA_PERMITIDA = ['violeta', 'azul', 'rosa'] as const;
export type CorAura = (typeof COR_AURA_PERMITIDA)[number];

export function validarCorAura(valor: unknown): CorAura {
  if (typeof valor !== 'string' || !COR_AURA_PERMITIDA.includes(valor as CorAura)) {
    throw new Error('Cor de aura inválida.');
  }
  return valor as CorAura;
}

const XP_BASE = 40;
export const XP_EPISODIO_VALIDADO = 40;
export const XP_MAXIMO = 2_000_000_000;

export function experienciaParaNivel(nivel: number): number {
  if (!Number.isInteger(nivel) || nivel < 1 || nivel > 9_000) throw new Error('Nível inválido.');
  return (XP_BASE * nivel * (nivel - 1)) / 2;
}

export function nivelPorExperiencia(experiencia: number): number {
  if (!Number.isSafeInteger(experiencia) || experiencia < 0 || experiencia > XP_MAXIMO) {
    throw new Error('Experiência inválida.');
  }
  // Cada nível precisa de 40XP a mais que o anterior; cálculo monotônico, não manipulável pelo cliente.
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + (8 * experiencia) / XP_BASE)) / 2));
}

export function formaDesbloqueada(nivel: number) {
  if (!Number.isInteger(nivel) || nivel < 1) throw new Error('Nível inválido.');
  return [...FORMAS_ASTRA].reverse().find((item) => nivel >= item.nivelMinimo)!;
}

export function calcularProgressao(experiencia: number) {
  const nivel = nivelPorExperiencia(experiencia);
  const base = experienciaParaNivel(nivel);
  const proximaMeta = experienciaParaNivel(nivel + 1);
  return {
    nivel,
    experiencia,
    experienciaNoNivel: experiencia - base,
    metaNoNivel: proximaMeta - base,
    proximoNivel: nivel + 1,
    restante: proximaMeta - experiencia,
    porcentagem: Math.min(
      100,
      Math.max(0, Math.round(((experiencia - base) / (proximaMeta - base)) * 100))
    ),
    formaLiberada: formaDesbloqueada(nivel)
  };
}
