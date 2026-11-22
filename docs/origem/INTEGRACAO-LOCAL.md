# Integração local do Yokira original com o Universo Astra

## Fonte comprovada

- Site de referência: https://yokira-2-ander.honoratoann.chatgpt.site/
- Repositório: https://github.com/AnderHonorato/Yokira-2.0
- Branch: `sol/identidade-login-temas-20261105`
- Commit: `25afce82e1983f6add6397ea7a946a39ba673f0b`
- O diretório `versao-sites/` foi copiado com 448 arquivos idênticos à fonte, antes da adição de links novos. A branch `main-ChatGPT` tem uma home diferente e não corresponde à versão atualmente publicada.

## Execução LAN

O gateway `scripts/gateway-yokira.mjs` recebe no endereço `http://IP-DO-PC:4117` e encaminha:

- Portal original React/Vinext (home, catálogo, agenda, salas, amizades, comunidade, jogos, player e API `/api/yokira`): `127.0.0.1:5125`.
- Backend SvelteKit/Prisma (Companheiros, Portal Astral, Biblioteca Mágica e respectivas APIs): `127.0.0.1:4118`.

A porta 4117 é limitada no firewall à rede privada do PC. Este gateway NÃO possui TLS, não é recomendado para exposição à internet nem configura login compartilhado.

## Dados e testes

- D1 local: 20 migrações originais aplicadas, 39 tabelas, banco vazio com catálogos editoriais originais e banners de One Piece, Naruto e BLEACH. Backup anterior à aplicação mantido na pasta local `.runtime/backups` (não versionada).
- A aplicação SvelteKit utiliza outro banco SQLite. As contas originais D1 não foram exportadas, copiadas ou sincronizadas.
- Site original: 157 testes automatizados e TypeScript aprovados.
- Gateway: 4 testes aprovados (`node --test scripts/roteamento-yokira.test.mjs`).
- Browser em 390px/1440px: páginas HTTP 200, imagem dos cenários e banner One Piece carregados, e caminho da home original até /companheiros testado; nenhum erro de JavaScript observado.

## Pendências reais

- Autenticação única e sincronização de listas e episódios entre D1 e Prisma.
- Concessão de XP a partir de progresso validado no servidor, evitando ganhos duplicados.
- Quarto Otaku, inventário, missões, evoluções visuais avançadas e assistente de IA.
- Deploy público com bancos persistentes, backups e testes de segurança.
- Verificação em aparelho móvel real e autenticação por sessão.
