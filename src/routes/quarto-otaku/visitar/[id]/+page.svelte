<script lang="ts">
  import type { PageData } from './$types';
  import Cenario from '$lib/quarto/cenario.svelte';
  export let data: PageData;
</script>

<svelte:head><title>Visitar quarto | Yokira Astra</title></svelte:head>
<section>
  <h1>Visita ao Quarto Otaku</h1>
  <Cenario
    tema={data.quarto.tema}
    iluminacao={data.quarto.iluminacao}
    objetos={data.quarto.objetos}
    companheiros={data.quarto.usuario.companheiros}
  />
  <a href="/quarto-otaku">Abrir meu quarto</a>
</section>

<style>
  section {
    max-width: 60rem;
    margin: auto;
    padding: clamp(1rem, 4vw, 3rem);
  }
  a {
    display: inline-block;
    margin-top: 1rem;
    text-decoration: underline;
  }
</style>
