<script lang="ts">
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';
  export let data: PageData;
  onMount(() => {
    const intervalo = setInterval(() => {
      if (!document.hidden) void invalidateAll();
    }, 10000);
    return () => clearInterval(intervalo);
  });
</script>

<svelte:head><title>Acompanhamento | Yokira Astra</title></svelte:head>
<section class="entrega">
  <h1>Acompanhamento do Yokira Astra</h1>
  <p>O checklist é atualizado a cada 10 segundos. <a href="/companheiros">Abrir companheiros</a></p>
  <ul>
    {#each data.itens as item (item.area)}
      <li>
        <h2>{item.area}</h2>
        <strong>{item.situacao}</strong>
        <p>{item.detalhe}</p>
      </li>
    {/each}
  </ul>
</section>

<style>
  .entrega {
    max-width: 70rem;
    margin: auto;
    padding: clamp(1rem, 4vw, 3rem);
  }
  ul {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  }
  li {
    border: 1px solid var(--cor-borda, #493755);
    border-radius: 1rem;
    padding: 1.2rem;
  }
  h2 {
    margin: 0 0 0.4rem;
  }
  strong {
    color: var(--cor-marca, #b692fb);
  }
  p {
    line-height: 1.55;
  }
  a {
    text-decoration: underline;
  }
</style>
