<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head><title>Converse com Astra | Yokira</title></svelte:head>
<main class="assistente">
  <img width="100" height="100" src="/mascotes/astra.webp" alt="Astra" />
  <h1>Converse com Astra</h1>
  <p>
    Descubra um anime pelo gênero ou pela história, ou pergunte como usar os recursos do Yokira.
  </p>
  <form method="GET">
    <label for="pergunta">O que você procura?</label>
    <input
      id="pergunta"
      type="search"
      name="q"
      value={data.pergunta}
      maxlength="220"
      required
      placeholder="Quero uma aventura sobre piratas"
    />
    <label
      ><input type="checkbox" name="disponiveis" value="1" checked={data.soDisponiveis} /> Somente títulos
      com fonte ativa</label
    >
    <button>Consultar Astra</button>
  </form>
  {#each data.ajuda as guia (guia.destino)}
    <section>
      <h2>{guia.nome}</h2>
      <p>{guia.resumo}</p>
      <a href={guia.destino}>Abrir recurso →</a>
    </section>
  {/each}
  {#if data.titulos.length}
    <h2>Do catálogo Yokira</h2>
    <ul>
      {#each data.titulos as titulo (titulo.slug)}
        <li>
          <a href={'/titulo/' + titulo.slug}>{titulo.nome}</a><small
            >{titulo.ano} · {titulo.generos}</small
          >
          <small
            >{titulo.comFonte
              ? 'Há episódio com fonte ativa'
              : 'Ficha de catálogo · sem fonte ativa'}</small
          >
          <form method="POST" action={'/jornada/descobrir/' + titulo.slug} class="explorar">
            <input type="hidden" name="q" value={data.pergunta} /><input
              type="hidden"
              name="disponiveis"
              value={data.soDisponiveis ? '1' : '0'}
            /><button>Explorar com o mascote</button>
          </form>
        </li>
      {/each}
    </ul>
  {:else if data.pergunta && !data.ajuda.length}
    <p>
      Nenhum resultado para essa consulta. Experimente o nome de um anime, um gênero ou um recurso
      do Yokira.
    </p>
  {/if}
</main>

<style>
  .assistente {
    max-width: 48rem;
    margin: auto;
    padding: clamp(1rem, 4vw, 3rem);
    color: #f0eafb;
  }
  img {
    object-fit: contain;
  }
  h1 {
    font-size: clamp(2rem, 5vw, 3.4rem);
    margin: 0.3rem 0;
  }
  form,
  section,
  li {
    display: grid;
    gap: 0.75rem;
    padding: 1.25rem;
    border: 1px solid #534366;
    border-radius: 1rem;
    background: #21182b;
  }
  form {
    margin: 2rem 0;
  }
  .explorar {
    margin: 0;
    padding: 0;
    border: 0;
  }
  input[type='search'] {
    min-width: 0;
    padding: 0.8rem;
    background: #17121f;
    color: inherit;
    border: 1px solid #887896;
    border-radius: 0.5rem;
  }
  button {
    justify-self: start;
    border: 0;
    border-radius: 0.45rem;
    background: #d5b2ff;
    color: #241631;
    font-weight: 700;
    padding: 0.75rem 1.25rem;
  }
  a {
    color: #d8b9ff;
  }
  small {
    color: #cbc1d4;
  }
  ul {
    display: grid;
    gap: 0.75rem;
    padding: 0;
    list-style: none;
  }
</style>
