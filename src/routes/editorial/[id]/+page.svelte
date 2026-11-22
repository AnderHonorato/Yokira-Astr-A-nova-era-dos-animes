<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>{data.item.titulo} — Yokira Editorial</title>
  <meta name="description" content={data.item.resumo} />
</svelte:head>
<article class="leitura-editorial">
  <a class="voltar" href="/">← Voltar à home</a>
  <img class="capa" src={data.item.imagem} alt="" width="1200" height="490" />
  <span class="categoria">{data.item.categoria} · YOKIRA EDITORIAL</span>
  <h1>{data.item.titulo}</h1>
  <p class="resumo">{data.item.resumo}</p>
  <div class="texto">
    {#each data.item.corpo.split(/\n\s*\n/) as paragrafo, indice (indice)}<p>{paragrafo}</p>{/each}
  </div>
  <a class="explorar" href="/portal-astral">Explorar outros universos →</a>
</article>

<style>
  .leitura-editorial {
    max-width: 850px;
    margin: 30px auto 80px;
    color: var(--cor-texto);
    padding: 0 10px;
  }
  .voltar,
  .explorar {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: #93c0ff;
    font-size: 13px;
    margin-bottom: 20px;
  }
  .capa {
    width: 100%;
    height: clamp(210px, 27vw, 430px);
    object-fit: cover;
    border-radius: 12px;
    filter: brightness(0.85);
  }
  .categoria {
    display: block;
    margin: 30px 0 14px;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #a6bde2;
    font-weight: 750;
  }
  h1 {
    font:
      500 clamp(32px, 5vw, 56px)/1.1 Georgia,
      'Times New Roman',
      serif;
    letter-spacing: -0.04em;
    margin-bottom: 20px;
  }
  .resumo {
    font-size: 17px;
    line-height: 1.6;
    color: #bed0e4;
    margin-bottom: 32px;
  }
  .texto p {
    font-size: 15px;
    line-height: 1.95;
    margin: 0 0 25px;
    color: var(--cor-texto-secundario);
  }
  .explorar {
    border: 1px solid var(--cor-borda);
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 16px;
  }
</style>
