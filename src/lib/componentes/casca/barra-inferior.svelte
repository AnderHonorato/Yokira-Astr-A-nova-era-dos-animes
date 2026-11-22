<!-- Barra móvel recuperada do Yokira publicado, com menu real para os novos espaços. -->
<script lang="ts">
  import './barra-inferior.css';
  import { page } from '$app/stores';
  import { ITENS_DA_BARRA_INFERIOR, estaAtivo } from './itens-de-navegacao';
  import Casa from '$visual/icones/casa.svelte';
  import GradeCatalogo from '$visual/icones/grade-catalogo.svelte';
  import Lupa from '$visual/icones/lupa.svelte';
  import Perfil from '$visual/icones/perfil.svelte';
  import type { UsuarioDaSessao } from '$servidor/autenticacao/sessao';

  export let usuario: UsuarioDaSessao | null = null;
  export let podeAcessarPainel = false;

  let maisAberto = false;
  const ICONES = {
    casa: Casa,
    'grade-catalogo': GradeCatalogo,
    lupa: Lupa,
    perfil: Perfil
  } as const;
  const maisRotas = [
    '/portal-astral',
    '/biblioteca-magica',
    '/companheiros',
    '/novidades',
    '/minha-lista',
    '/generos'
  ];
  $: maisAtivo = maisRotas.some((rota) => estaAtivo($page.url.pathname, rota));
  $: caminho = $page.url.pathname;
  $: if (caminho) maisAberto = false;

  function fecharAoEscapar(evento: KeyboardEvent) {
    if (evento.key === 'Escape') maisAberto = false;
  }
</script>

<svelte:window on:keydown={fecharAoEscapar} />

<nav class="barra-inferior" aria-label="Navegação principal">
  {#each ITENS_DA_BARRA_INFERIOR as item (item.href)}
    {@const destino = item.href === '/configuracoes' && !usuario ? '/entrar' : item.href}
    {@const ativo =
      estaAtivo($page.url.pathname, item.href) ||
      (item.href === '/configuracoes' && $page.url.pathname === '/entrar')}
    <a
      class="barra-inferior-item"
      class:barra-inferior-ativo={ativo}
      href={destino}
      aria-current={ativo ? 'page' : undefined}
      on:click={() => (maisAberto = false)}
    >
      <svelte:component this={ICONES[item.icone]} tamanho={22} />
      <span class="barra-inferior-rotulo">{item.rotulo}</span>
    </a>
  {/each}

  <button
    type="button"
    class="barra-inferior-item barra-inferior-mais"
    class:barra-inferior-ativo={maisAtivo || maisAberto}
    aria-label="Mais"
    aria-expanded={maisAberto}
    aria-controls="menu-mais-yokira"
    on:click={() => (maisAberto = !maisAberto)}
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <span class="barra-inferior-rotulo">Mais</span>
  </button>

  <div
    id="menu-mais-yokira"
    class="barra-inferior-menu"
    hidden={!maisAberto}
    aria-label="Outras seções do Yokira"
  >
    <span class="barra-inferior-menu-titulo">EXPLORAR YOKIRA</span>
    <a href="/portal-astral" on:click={() => (maisAberto = false)}>Portal Astral</a>
    <a href="/biblioteca-magica" on:click={() => (maisAberto = false)}>Biblioteca Mágica</a>
    <a href="/companheiros" on:click={() => (maisAberto = false)}>Companheiros</a>
    <a href="/novidades" on:click={() => (maisAberto = false)}>Novidades</a>
    <a href="/minha-lista" on:click={() => (maisAberto = false)}>Minha Lista</a>
    <a href="/generos" on:click={() => (maisAberto = false)}>Gêneros</a>
    {#if podeAcessarPainel}<a href="/admin" on:click={() => (maisAberto = false)}
        >Painel administrativo</a
      >{/if}
  </div>
</nav>
