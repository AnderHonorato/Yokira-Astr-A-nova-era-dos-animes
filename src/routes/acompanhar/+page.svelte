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
<main>
  <h1>Acompanhamento do Yokira Astra</h1>
  <p>O checklist é atualizado a cada 10 segundos.</p>
  <pre>{data.documento}</pre>
</main>

<style>
  main {
    max-width: 68rem;
    margin: auto;
    padding: clamp(1rem, 4vw, 3rem);
  }
  pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font: inherit;
    line-height: 1.7;
  }
</style>
