<!-- Vitrine visual fiel ao Yokira atual, preservando a lógica SvelteKit do novo projeto. -->
<script lang="ts">
  import './vitrine-atual.css';
  import { catalogo as acervo, editoriais } from '$lib/catalogo-original';
  import type { CatalogoPublico } from '$servidor/banco/tipos-catalogo';

  export let catalogo: CatalogoPublico;

  const ranking = [...acervo].sort((a, b) => b.nota - a.nota).slice(0, 4);
  const destaques = ['one-piece', 'frieren', 'bleach']
    .map((slug) => acervo.find((item) => item.slug === slug)!)
    .filter(Boolean);
  const experiencias = [
    {
      titulo: 'Explorar gêneros',
      descricao: 'Entre em novos mundos.',
      icone: '✧',
      href: '/portal-astral'
    },
    {
      titulo: 'Descoberta diária',
      descricao: 'Um anime para hoje.',
      icone: '✦',
      href: '/titulo/frieren'
    },
    {
      titulo: 'Coleção mágica',
      descricao: 'Sua estante de histórias.',
      icone: '▤',
      href: '/biblioteca-magica'
    },
    { titulo: 'Seu companheiro', descricao: 'Evolua o Astra.', icone: '✺', href: '/companheiros' },
    { titulo: 'Buscar animes', descricao: 'Descubra pelo nome.', icone: '⌕', href: '/buscar' },
    {
      titulo: 'Minha lista',
      descricao: 'Continue de onde parou.',
      icone: '♧',
      href: '/minha-lista'
    }
  ];
  let destaqueSelecionado = 0;
  $: destaqueAtual = destaques[destaqueSelecionado] ?? destaques[0];
  $: cards = Array.from(
    new Map(catalogo.trilhas.flatMap((t) => t.itens).map((item) => [item.slug, item])).values()
  );
  $: ativos = cards.filter((item) => acervo.some((orig) => orig.slug === item.slug));
  $: numeroDeTitulos = catalogo.totalTitulos ?? Math.max(ativos.length, acervo.length);
</script>

<div class="yka-home">
  <div class="yka-abertura">
    <section class="yka-cenario" aria-label="Apresentação do acervo de animes Yokira">
      <div class="yka-cenario-brilho" aria-hidden="true"></div>
      <div class="yka-cenario-copy">
        <img
          src="/marca/emblema-yokira.png"
          alt="Emblema de Yokira, serpente e espada em roxo"
          width="142"
          height="142"
        />
        <div class="yka-cenario-nome">
          <span>YOKIRA</span>
          <h1>Acervo de animes</h1>
        </div>
      </div>
      <div class="yka-cenario-acoes">
        <p><strong>{numeroDeTitulos}</strong> títulos disponíveis para explorar</p>
        <div>
          <a class="yka-botao-principal" href="/catalogo"
            >Explorar acervo <span aria-hidden="true">→</span></a
          >
          <a class="yka-link-sutil" href="/portal-astral"
            >Portal Astral <span aria-hidden="true">✧</span></a
          >
        </div>
      </div>
    </section>

    <aside class="yka-melhores" aria-label="Seleção editorial de animes mais bem avaliados">
      <div class="yka-melhores-cabecalho">
        <h2>Melhores notas</h2>
        <span aria-hidden="true">♨</span>
      </div>
      <ol>
        {#each ranking as item, indice (item.slug)}
          <li>
            <a href={'/titulo/' + item.slug} class:principal={indice === 0}>
              <span class="yka-posicao">{String(indice + 1).padStart(2, '0')}</span>
              <img src={item.poster} alt="" width="49" height="69" loading="lazy" />
              <span class="yka-melhores-texto">
                <strong>{item.nome}</strong>
                <small>{item.generos.slice(0, 2).join(' · ')}</small>
                <em>☆ {item.nota.toFixed(1)} <span>{item.ano}</span></em>
              </span>
            </a>
          </li>
        {/each}
      </ol>
      <p class="yka-nota">Notas editoriais do catálogo de referência</p>
      <a class="yka-ranking-rodape" href="/catalogo"
        >Ver acervo completo <span aria-hidden="true">→</span></a
      >
    </aside>
  </div>

  {#if destaqueAtual}
    <section class="yka-banner" aria-label="Título em destaque">
      <img
        class="yka-banner-cenario"
        src={destaqueSelecionado === 0
          ? '/arte/banners/one-piece-cenario.webp'
          : destaqueAtual.capa}
        alt=""
        width="1360"
        height="550"
        loading="eager"
      />
      <div class="yka-banner-fade" aria-hidden="true"></div>
      {#if destaqueSelecionado === 0}
        <img
          class="yka-banner-personagem"
          src="/arte/banners/one-piece-personagem.webp"
          alt=""
          loading="eager"
          width="520"
          height="600"
        />
      {/if}
      <div class="yka-banner-copy">
        <span>EM DESTAQUE</span>
        <h2>{destaqueAtual.nome}</h2>
        <p class="yka-banner-meta">
          {destaqueAtual.ano} <b>·</b>
          {destaqueAtual.generos.slice(0, 3).join('  ·  ')}
        </p>
        <p class="yka-banner-sinopse">{destaqueAtual.sinopse}</p>
        <div class="yka-banner-links">
          <a class="yka-botao-principal" href={'/titulo/' + destaqueAtual.slug}
            >Conhecer título <span aria-hidden="true">→</span></a
          >
          <a class="yka-link-sutil" href="/minha-lista">Minha lista</a>
        </div>
      </div>
      <div class="yka-banner-paginacao" aria-label="Escolher destaque">
        <span
          >{String(destaqueSelecionado + 1).padStart(2, '0')} / {String(destaques.length).padStart(
            2,
            '0'
          )}</span
        >
        {#each destaques as item, indice (item.slug)}
          <button
            type="button"
            class:ativo={indice === destaqueSelecionado}
            on:click={() => (destaqueSelecionado = indice)}
            aria-label={'Ver ' + item.nome}
            aria-pressed={indice === destaqueSelecionado}
          ></button>
        {/each}
      </div>
    </section>
  {/if}

  <section class="yka-experiencias" aria-labelledby="yka-experiencias-titulo">
    <div class="yka-section-topo">
      <div>
        <span>DESCUBRA SEU PRÓXIMO UNIVERSO</span>
        <h2 id="yka-experiencias-titulo">Experiências no Yokira</h2>
      </div>
      <a href="/portal-astral">Explorar o Portal Astral <span aria-hidden="true">→</span></a>
    </div>
    <div class="yka-experiencias-grid">
      {#each experiencias as item (item.href)}
        <a href={item.href} class="yka-experiencia">
          <span class="yka-experiencia-icone" aria-hidden="true">{item.icone}</span>
          <strong>{item.titulo}</strong><small>{item.descricao}</small>
        </a>
      {/each}
    </div>
  </section>

  <section class="yka-acervo" aria-labelledby="yka-acervo-titulo">
    <div class="yka-section-topo">
      <div>
        <span>CATÁLOGO</span>
        <h2 id="yka-acervo-titulo">Acervo de animes</h2>
      </div>
      <a href="/catalogo">Ver todo o acervo <span aria-hidden="true">→</span></a>
    </div>
    <div class="yka-acervo-grid">
      {#each ativos.slice(0, 12) as item (item.id)}
        <a class="yka-titulo" href={'/titulo/' + item.slug}>
          <span class="yka-titulo-imagem">
            <img src={item.poster} alt={'Capa de ' + item.nome} loading="lazy" decoding="async" />
            {#if item.novidade}<span class="yka-card-selo">NOVO</span>{/if}
          </span>
          <span class="yka-titulo-info"
            ><strong>{item.nome}</strong><small
              >{item.ano} · {item.ehFilme ? 'Filme' : 'Série'} · {item.rotuloSecundario}</small
            ></span
          >
        </a>
      {/each}
    </div>
  </section>

  <section class="yka-editorial" aria-labelledby="yka-editorial-titulo">
    <div class="yka-section-topo">
      <div>
        <span>YOKIRA EDITORIAL</span>
        <h2 id="yka-editorial-titulo">Novos olhares sobre os animes</h2>
      </div>
    </div>
    <div class="yka-editorial-grid">
      {#each editoriais.slice(0, 3) as editorial (editorial.id)}
        <a class="yka-editorial-card" href={'/editorial/' + editorial.id}>
          <div class="yka-editorial-imagem">
            <img src={editorial.imagem} alt="" loading="lazy" /><span>{editorial.categoria}</span>
          </div>
          <div class="yka-editorial-conteudo">
            <small>YOKIRA EDITORIAL · LEITURA</small>
            <h3>{editorial.titulo}</h3>
            <p>{editorial.resumo}</p>
            <strong>Continuar lendo →</strong>
          </div>
        </a>
      {/each}
    </div>
  </section>
</div>
