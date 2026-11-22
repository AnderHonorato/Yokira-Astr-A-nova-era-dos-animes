const universo = [
  '/companheiros',
  '/jornada',
  '/quarto-otaku',
  '/assistente',
  '/acompanhar',
  '/portal-astral',
  '/biblioteca-magica',
  '/entrar',
  '/cadastrar',
  '/sair',
  '/configuracoes',
  '/minha-lista',
  '/titulo',
  '/generos',
  '/novidades',
  '/buscar',
  '/assistir',
  '/admin',
  '/recuperar-senha',
  '/redefinir-senha',
  '/verificar-email',
  '/_app',
  '/marca',
  '/mascotes'
];
function corresponde(caminho, prefixo) {
  return caminho === prefixo || caminho.startsWith(prefixo + '/');
}
export function selecionarAplicacao(endereco) {
  const caminho = new URL(endereco, 'http://localhost/').pathname;
  if (caminho === '/api/yokira' || caminho.startsWith('/api/yokira/')) return 'site';
  if (caminho.startsWith('/api/')) return 'universo';
  if (caminho === '/service-worker.js') return 'universo';
  return universo.some((prefixo) => corresponde(caminho, prefixo)) ? 'universo' : 'site';
}
