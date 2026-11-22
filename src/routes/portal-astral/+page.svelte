<script lang="ts">
  import './portal-astral.css';
  import Guardiao from '$componentes/home/guardiao-articulado.svelte';
  import { SvelteURLSearchParams } from 'svelte/reactivity';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  export let data;

  $: mundos = [null, ...data.generos.map((genero) => genero.slug)];
  $: atual = mundos.indexOf(data.filtros.genero);
  const endereco = (genero: string | null, origem: URL) => {
    const busca = new SvelteURLSearchParams(origem.search);
    if (genero) busca.set('genero', genero);
    else busca.delete('genero');
    const parametros = busca.toString();
    return '/portal-astral' + (parametros ? '?' + parametros : '');
  };
  let inicio: { x: number; y: number } | null = null;
  function terminarGesto(evento: PointerEvent) {
    if (!inicio) return;
    const dx = evento.clientX - inicio.x;
    const dy = evento.clientY - inicio.y;
    inicio = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      void goto(
        endereco(mundos[(atual + (dx < 0 ? 1 : -1) + mundos.length) % mundos.length], $page.url),
        { noScroll: true, keepFocus: true }
      );
    }
  }
  function gestos(no: HTMLElement) {
    const iniciar = (e: PointerEvent) => {
      if ((e.target as Element).closest('a')) return;
      inicio = { x: e.clientX, y: e.clientY };
      no.setPointerCapture(e.pointerId);
    };
    const cancelar = () => {
      inicio = null;
    };
    no.addEventListener('pointerdown', iniciar);
    no.addEventListener('pointerup', terminarGesto);
    no.addEventListener('pointercancel', cancelar);
    return {
      destroy() {
        no.removeEventListener('pointerdown', iniciar);
        no.removeEventListener('pointerup', terminarGesto);
        no.removeEventListener('pointercancel', cancelar);
      }
    };
  }
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
    <div class="portal-arte" class:esquerda={data.acompanhante?.posicao === 'esquerda'} use:gestos>
      {#if data.itens[0]}<img
          class="portal-paisagem"
          src={data.itens[0].poster}
          alt=""
          loading="lazy"
          draggable="false"
        />{/if}
      <span class="portal-arco" aria-hidden="true"></span>
      {#if data.acompanhante}
        <a
          href="/companheiros"
          class="portal-companheiro"
          aria-label={'Ver ' + data.acompanhante.especie.nome}
        >
          <Guardiao
            id="portal-equipado"
            forma={data.acompanhante.formaSelecionada}
            especie={data.acompanhante.especieId}
            cor={data.acompanhante.corAura}
            movimento="andar"
          />
        </a>
      {/if}
      <div class="portal-travessia">
        <a
          aria-label="Ambiente anterior"
          href={endereco(mundos[(atual - 1 + mundos.length) % mundos.length], $page.url)}>‹</a
        >
        <span
          >{data.generos.find((g) => g.slug === data.filtros.genero)?.nome ||
            'Todos os mundos'}</span
        >
        <a
          aria-label="Próximo ambiente"
          href={endereco(mundos[(atual + 1) % mundos.length], $page.url)}>›</a
        >
      </div>
    </div>
  </section>
  <nav aria-label="Ambientes do Portal Astral" class="portal-generos">
    <a href={endereco(null, $page.url)} class:ativo={!data.filtros.genero}>Todos os mundos</a>
    {#each data.generos as genero (genero.id)}
      <a href={endereco(genero.slug, $page.url)} class:ativo={data.filtros.genero === genero.slug}
        >{genero.nome}</a
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
