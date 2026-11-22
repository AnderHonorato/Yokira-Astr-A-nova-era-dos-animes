<script lang="ts">
  import type { PageData, ActionData } from './$types';
  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head><title>Jornada Yokira | Yokira Astra</title></svelte:head>
<main class="jornada">
  <h1>Jornada Yokira</h1>
  {#if data.jornada}
    <p>
      {data.jornada.companheiro
        ? 'Companheiro equipado: ' + data.jornada.companheiro
        : 'Desperte seu primeiro companheiro para receber experiência.'}
      <a href="/companheiros">Abrir coleção</a>
    </p>
    {#if form?.mensagem}<p role="status">{form.mensagem}</p>{/if}
    <div class="missoes">
      {#each data.jornada.missoes as m (m.chave)}
        <article>
          <h2>{m.nome}</h2>
          <p>{m.objetivo}</p>
          <progress max={m.meta} value={m.atual} aria-label={m.nome}></progress><span>
            {m.atual} / {m.meta}</span
          >
          <p>{m.xp} XP · {m.premio}</p>
          <form method="POST" action="?/resgatar">
            <input type="hidden" name="missao" value={m.chave} /><button
              disabled={m.recebida || m.atual < m.meta || !data.jornada.companheiro}
              >{m.recebida ? 'Conquistado' : 'Resgatar recompensa'}</button
            >
          </form>
        </article>
      {/each}
    </div>
    <p><a href="/quarto-otaku">Visitar meu Quarto Otaku</a></p>
  {:else}<p>Entre para ver as missões e recompensas da sua conta.</p>
    <a href="/entrar">Entrar na conta</a>{/if}
</main>

<style>
  .jornada {
    max-width: 66rem;
    margin: 3rem auto;
    padding: 0 1.2rem;
    color: #f6f0ff;
  }
  .jornada h1 {
    font-size: clamp(2rem, 5vw, 3.8rem);
  }
  .missoes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 23rem), 1fr));
    gap: 1rem;
  }
  .missoes article {
    border: 1px solid #5f496e;
    border-radius: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #271730, #181522);
  }
  progress {
    accent-color: #c48cfa;
    width: 65%;
  }
  button {
    padding: 0.55rem 1rem;
    background: #c5a6ff;
    border: 0;
    color: #20102e;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  button:disabled {
    background: #44374c;
    color: #ddd;
    cursor: default;
  }
  a {
    color: #d6b7ff;
  }
  h2 {
    margin-top: 0;
  }
</style>
