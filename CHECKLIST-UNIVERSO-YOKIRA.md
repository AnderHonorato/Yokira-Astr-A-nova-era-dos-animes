# Yokira Astra — checklist de evolução e implantação

> **Projeto de destino:** [Yokira — A nova era dos animes](https://github.com/AnderHonorato/Yokira-Astr-A-nova-era-dos-animes).  
> **Base importada:** [AnderHonorato/Yokira-Astra](https://github.com/AnderHonorato/Yokira-Astra), incluindo o mascote e correções da branch `feat/mascote-yokira-astra-20261122`.  
> **Atualizado em:** 22/11/2026. Este documento declara somente o que foi implementado ou testado; nenhuma tarefa é considerada concluída sem evidência.  
> **Legenda:** ✅ concluído · 🟡 implementado, revisão/testes pendentes · ⏳ não implementado · ⚠️ bloqueado ou defeito.

## 0. Cópia, integração e infraestrutura

- [x] ✅ Repositório novo criado pelo proprietário e base real SvelteKit/TypeScript importada (440 arquivos).
- [x] ✅ Cadastro de animes, player, perfis, contas, progresso, lista, ranking, histórico e área administrativa originais preservados.
- [x] ✅ Mascote original Astra em WebP copiado localmente da referência aprovada.
- [x] ✅ Novo esquema Prisma e migration aditiva para coleção, espécies, eventos de XP e preferências.
- [x] ✅ Testes de unidade de progressão e integração de banco SQLite.
- [x] ✅ Workflow original de verificações restaurado no GitHub Actions; CI da primeira entrega aprovado em 390px e 1440px.
- [ ] ⚠️ Publicar hospedagem permanente com SQLite persistente: a conta Railway retornou _trial expired_ em tentativa anterior.
- [ ] 🟡 Regra restrita de Wi-Fi criada com autorização de administrador (TCP 4117, 192.168.1.0/24). Servidor responde HTTP 200 no PC; teste no celular ainda pendente.

## 1. Mascotes, desbloqueio e coleção

- [x] ✅ Usuário inicia sem mascote equipado ou desbloqueado.
- [x] ✅ Missão introdutória gratuita: desbloquear Astra (uma única instância por usuário).
- [x] ✅ Coleção pessoal e mascote equipado, isolados por usuário.
- [x] ✅ Equipar um mascote existente com transação e verificação de propriedade.
- [x] ✅ Nível e XP de cada mascote persistidos individualmente.
- [x] ✅ Cinco formas e limiares (1/10/25/50/80), incluindo escolha de forma anterior conquistada.
- [x] ✅ Formas distintas com efeitos 2D progressivos (aura, anel astral, constelações e brilho), sem fingir que existe malha 3D.
- [x] ✅ Árvore de evolução, barra de XP, prévia textual e estados de bloqueio.
- [x] ✅ Personalização persistente de aura e formas, com restrições no servidor.
- [x] ✅ Reações de salto, respiração e descanso ao toque/click.
- [x] ✅ Preferências persistentes de visibilidade, acompanhamento e posição.
- [x] ✅ Histórico dos eventos de XP, persistido e limitado à conta.
- [ ] ⏳ Animações articuladas de corrida, caminhada, piscar, mover orelhas/cauda e sequência cinematográfica de evolução.
- [ ] ⏳ Espécies adicionais, variantes gráficas exclusivas, inventário de mascotes e sistemas de desbloqueio além do Astra.
- [ ] ⏳ Acompanhamento do mascote em todas as telas respeitando preferências sem cobrir player.
- [ ] ⏳ Assistente de IA opcional conectado exclusivamente a títulos do catálogo.

## 2. Jornada Yokira e segurança das recompensas

- [x] ✅ Missão _Explorar três gêneros_ usa títulos publicados e a Minha Lista real.
- [x] ✅ Recompensa de 420 XP apenas uma vez por companheiro, protegida por índice único e transação.
- [x] ✅ Formas, cores e recompensas não podem ser forjadas por parâmetros do formulário.
- [x] ✅ Isolamento entre contas, duplicidade, missão incompleta e cores bloqueadas cobertos por testes.
- [ ] ⏳ XP por assistir episódios **ainda não habilitado**: implementar verificação server-side do tempo válido de reprodução com anticlique/antibot e idempotência por episódio.
- [ ] ⏳ Missões por temporada, eventos sazonais, comunidade, coleções e medalhas.
- [ ] ⏳ Inventário universal de itens e sistema de recompensas sazonais.

## 3. Portal Astral

- [x] ✅ Nova rota `/portal-astral` com cenário 2D por gênero conectado ao catálogo publicado.
- [x] ✅ Filtros reais de ano, nota, gênero, ordenação e fonte ativa.
- [x] ✅ Cards com dados reais, navegação por toque/mouse/teclado e link para o título.
- [x] ✅ Acesso alternativo ao catálogo convencional, sem impedir assistir normalmente.
- [x] ✅ Playwright: visita ao Portal Astral em celular 390px e desktop 1440px, incluindo cards reais e prevenção de overflow.
- [ ] ⏳ Ampliar testes dos filtros combinados e fontes ativas.
- [ ] ⏳ Navegação por gestos avançados, missões vinculadas à exploração e fundo 3D opcional.

## 4. Biblioteca Mágica

- [x] ✅ Nova rota `/biblioteca-magica` lendo `ItemLista` e `Progresso` existentes.
- [x] ✅ Livros com capa do catálogo, situação (quero ver/em andamento/concluído) e episódios concluídos.
- [x] ✅ Pesquisa, filtros por situação e livro expansível com link para o anime.
- [x] ✅ Alternativa à Minha Lista convencional (sem novo histórico paralelo).
- [x] ✅ Playwright: adicionar títulos à lista e confirmar sincronismo real com a Biblioteca Mágica.
- [ ] ⏳ Cobrir também alteração do progresso ao assistir no player.
- [ ] ⏳ Personalização de estantes, decoração e interação do mascote com livros.

## 5. Quarto Otaku

- [ ] ⏳ Implementar modelo Prisma de inventário/decorações e layout por usuário.
- [ ] ⏳ Criar ambiente pessoal 2D editável com arrastar/rotacionar e salvar em transações.
- [ ] ⏳ Coleções de móveis, posters reais e objetos desbloqueáveis.
- [ ] ⏳ Visitas a quartos públicos com consentimento e permissões.
- [ ] ⏳ Suporte 3D opcional, rigging e malhas otimizadas **apenas quando o modelo Tripo AI estiver disponível e validado**.

## 6. Qualidade, acessibilidade e entrega

- [x] ✅ Usabilidade de interface em 2D leve com animações CSS e `prefers-reduced-motion`.
- [x] ✅ Sistema de conta, permissões e SQLite reais, não dados apenas em memória de navegador.
- [x] ✅ CI de primeira entrega passou (tipos, lint, unidade, integração e Playwright 390px/1440px).
- [x] ✅ Mais 6 cenários Playwright locais de mascote, XP, lista e portal aprovados.
- [ ] ⏳ Monitorar performance real (LCP, INP e CLS) no Android e corrigir regressões.
- [ ] ⏳ Publicar hospedagem pública duradoura com backup e manutenção das migrações.
- [ ] ⚠️ Validar URL pelo **Wi-Fi no próprio celular**; resposta HTTP 200 no PC, sozinha, não comprova acesso ao celular.

## Erros e limitações conhecidos

| Tema           | Situação                                                                 | Próxima providência                               |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------------- |
| Git do Windows | Sem credenciais para `git push` direto                                   | Publicar pelas permissões do conector GitHub      |
| GitHub Actions | Resolvido: workflow restaurado pelo conector, CI aprovado                | Monitorar próximos commits                        |
| Railway        | Hospedagem recusada por trial expirado                                   | Selecionar servidor com disco persistente         |
| Firewall Wi-Fi | Resolvido no PC: regra Private para YokiraNode.exe/4117 e 192.168.1.0/24 | Confirmar no celular conectado ao mesmo roteador  |
| Vídeos e XP    | Progresso recebido do player não é prova suficiente de visualização real | Não liberar XP automático sem validação antiabuso |
| Animações 3D   | Arquivo GLB com rigging ainda não fornecido/validado                     | Usar mascote 2D original até obter malha adequada |

## Para acompanhar

- Código: [repositório novo](https://github.com/AnderHonorato/Yokira-Astr-A-nova-era-dos-animes)
- Esta lista: `CHECKLIST-UNIVERSO-YOKIRA.md` na raiz
- Rotas a verificar: `/companheiros`, `/portal-astral`, `/biblioteca-magica`

## 7. Tentativa anterior de recriação visual (superada pela cópia fiel da seção 8)

- [x] ✅ Identificada a causa do visual vazio: o banco anterior usava 14 títulos fictícios e imagens geradas, enquanto o [Yokira publicado](https://yokira-2-ander.honoratoann.chatgpt.site/) expõe 20 animes conhecidos.
- [x] ✅ Recuperadas as 20 capas e as imagens largas de referência a partir dos arquivos do próprio projeto anterior (`Yokira-2.0/main-ChatGPT`).
- [x] ✅ Recuperados o cenário de cerejeiras/lua e o banner original de One Piece, incluindo o personagem, diretamente do site atual.
- [x] ✅ Página inicial redesenhada com a composição do site publicado: cenário japonês + ranking lateral, banner One Piece, atalhos, grades com capas e editoriais.
- [x] ✅ Importador idempotente de metadados, gêneros e episódios referenciais, respeitando o banco Prisma e sem criar URLs de streaming fictícias.
- [x] ✅ Seed padrão importa títulos originais, preserva contas e esconde apenas títulos de demonstração do catálogo público (não apaga os registros).
- [x] ✅ Notas editoriais do catálogo de referência distinguíveis das avaliações reais da comunidade.
- [x] ✅ A leitura integral dos editoriais abre em `/editorial/[id]`.
- [x] ✅ Comparada a home do site atual e do novo em desktop 1440px e celular 390px, com capturas reais no PC e melhorias aplicadas.
- [x] ✅ Mobile: cabeçalho extra removido, cinco botões inferiores (Início, Acervo, Buscar, Meu perfil, Mais), menu de rotas reais, cenário compacto e ranking em duas colunas.
- [x] ✅ Testes de UI da home: 5 cenários Playwright aprovados (1 ignorado por ser exclusivo de celular), imagens reais carregadas e sem rolagem horizontal.
- [ ] ⏳ Igualar os demais componentes além da home: chat global, agenda, comunidade, amizades, salas, jogos e player do site publicado ainda exigem migração.
- [ ] ⏳ Paridade total de comunidade, amizades, salas, jogos e agenda: existem no site publicado anterior, mas não foram portados integralmente para o backend SvelteKit atual.
- [ ] ⏳ Fontes de episódios licenciados: importar somente com autorização; capas e metadados não equivalem a vídeos disponíveis.

## 8. Correção da fonte e integração LAN — execução atual (22/11/2026)

- [x] ✅ Identificada a **fonte exata do site publicado**: `Yokira-2.0`, branch `sol/identidade-login-temas-20261105`, commit `25afce82`. A branch `main-ChatGPT` era visualmente diferente.
- [x] ✅ **448/448 arquivos** de `versao-sites/` copiados e validados por SHA no repositório novo; não foi recriada outra home.
- [x] ✅ Layout, catálogo, player demo, salas, amizades, jogos, comunidade, chat e assets originais preservados no frontend React/Vinext.
- [x] ✅ Backend D1 de **desenvolvimento** criado com 20 migrações originais e 39 tabelas, após backup e validação. Não foi restaurado banco de produção.
- [x] ✅ Servidor Wi-Fi integrado usando a home original e encaminhamento das rotas de Companheiros, Portal Astral e Biblioteca Mágica ao SvelteKit.
- [x] ✅ Links dos três recursos acrescentados ao menu Mais mobile, com retorno HTTP 200 para Companheiros.
- [x] ✅ Validação de navegador 390px e 1440px: cenário, capas, banner One Piece e 0 erros JS observados.
- [x] ✅ 157 testes do frontend original, TypeScript, mais 4 testes do gateway aprovados.
- [ ] 🟡 **Conta única**: D1 e SQLite são bancos independentes. Login, lista, histórico, comunidade e XP não estão unificados.
- [ ] 🟡 **Conexão real do player à evolução** com validação no servidor e proteção antiabuso.
- [ ] ⏳ Quarto Otaku persistente, personalização avançada, formas animadas, IA opcional e missões integradas ainda faltam.
- [ ] ⏳ Deploy público com autenticação e dados duráveis. A versão do Wi-Fi é **local**, não um novo site público.
- [ ] ⏳ Teste presencial no celular real, inclusive login e persistência, ainda pendente.
- [ ] ⚠️ **Formatação legada:** `npm run formatar:checar` aponta aproximadamente 370 arquivos antigos da base SvelteKit fora do padrão Prettier. TypeScript e lint passam; corrigir a dívida de formatação em etapa separada, com revisão de diffs.
