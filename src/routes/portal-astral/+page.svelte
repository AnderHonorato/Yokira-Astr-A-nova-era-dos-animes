<script lang="ts">
  import './portal-astral.css';
  export let data;
  $: ambiente = (data.filtros.genero ?? 'universo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
</script>

<svelte:head>
  <title>Portal Astral — explorar gêneros | Yōkira</title>
  <meta
    name="description"
    content="Explore os universos de ação, fantasia, romance e aventura conectados ao catálogo real de animes do Yōkira."
  />
</svelte:head>
<div class="portal-astral">
  <section
    class="portal-entrada"
    class:portal-romance={ambiente.includes('romance')}
    class:portal-terror={ambiente.includes('terror')}
    class:portal-fantasia={ambiente.includes('fantasia')}
    class:portal-aventura={ambiente.includes('aventura')}
    class:portal-acao={ambiente.includes('acao')}
  >
    <div class="portal-particulas" aria-hidden="true"></div>
    <div class="portal-entrada-texto">
      <span class="portal-rotulo">✧ &nbsp; PORTAL ASTRAL / EXPLORAÇÃO</span>
      <h1>Todo gênero é um <span>novo universo.</span></h1>
      <p>
        Entre em mundos conectados aos animes reais do catálogo. Filtre, descubra e escolha sua
        próxima história.
      </p>
      <a href="/companheiros" class="portal-mascote-link"
        >✦ Astra pode explorar com você <span aria-hidden="true">↗</span></a
      >
    </div>
    <div class="portal-arte">
      <span class="portal-arco" aria-hidden="true"></span>
      <img
        src="/mascotes/astra.webp"
        width="230"
        height="230"
        alt="Astra, guardião cósmico do Portal Astral"
        loading="lazy"
      />
      <span class="portal-legenda">GUARDIÃO / ASTRA</span>
    </div>
  </section>
  <nav aria-label="Ambientes do Portal Astral" class="portal-generos">
    <a href="/portal-astral" class:ativo={!data.filtros.genero}>Todos os mundos</a>
    {#each data.generos as genero (genero.id)}
      <a
        href={'/portal-astral?genero=' + encodeURIComponent(genero.slug)}
        class:ativo={data.filtros.genero === genero.slug}>{genero.nome}</a
      >
    {/each}
  </nav>
  <section class="portal-corpo">
    <div class="portal-filtro-cabecalho">
      <div>
        <span class="portal-rotulo">CATÁLOGO EM TEMPO REAL</span>
        <h2>{data.itens.length} títulos encontrados</h2>
      </div>
      <a href="/catalogo">Catálogo convencional ↗</a>
    </div>
    <form class="portal-filtros" method="GET" action="/portal-astral">
      {#if data.filtros.genero}<input
          type="hidden"
          name="genero"
          value={data.filtros.genero}
        />{/if}
      <label
        >Ano
        <input
          name="ano"
          type="number"
          min="1950"
          max="2100"
          placeholder="Todos"
          value={data.filtros.ano}
        />
      </label>
      <label
        >Nota mínima
        <select name="nota"
          ><option value="">Todas</option>{#each [6, 7, 8, 9, 10] as nota (nota)}<option
              value={nota}
              selected={data.filtros.nota === nota}>{nota}+</option
            >{/each}</select
        >
      </label>
      <label
        >Disponibilidade
        <select name="disponibilidade">
          <option value="todos">Todos publicados</option>
          <option value="com-fonte" selected={data.filtros.disponibilidade === 'com-fonte'}
            >Com fonte ativa</option
          >
        </select>
      </label>
      <label
        >Ordenar
        <select name="ordem">
          <option value="avaliacao">Melhor avaliação</option>
          <option value="ano" selected={data.filtros.ordem === 'ano'}>Mais recentes</option>
        </select>
      </label>
      <button type="submit">Aplicar filtros</button>
    </form>
    {#if data.itens.length === 0}
      <div class="portal-vazio">
        <strong>Nenhum anime neste universo com os filtros escolhidos.</strong><a
          href="/portal-astral">Limpar filtros ↗</a
        >
      </div>
    {:else}
      <div class="portal-grid">
        {#each data.itens as item (item.id)}
          <a class="portal-item" href={'/titulo/' + item.slug} aria-label={'Conhecer ' + item.nome}>
            <div class="portal-poster">
              <img
                src={item.poster}
                alt={'Capa de ' + item.nome}
                loading="lazy"
                decoding="async"
              /><span aria-hidden="true">✧</span>
            </div>
            <div class="portal-item-dados">
              <strong>{item.nome}</strong><span
                >{item.ano} · {item.nota === null ? 'Sem avaliações' : item.nota + ' ★'}</span
              >
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </section>
</div>
