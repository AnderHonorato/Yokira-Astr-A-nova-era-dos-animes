<script lang="ts">
  import { enhance } from '$app/forms';
  import Cenario from '$lib/quarto/cenario.svelte';
  import { decoracoes, luzes, nomeDaPeca, temas } from '$lib/quarto/ambiente';
  import type { PageData, ActionData } from './$types';
  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head><title>Quarto Otaku | Yokira Astra</title></svelte:head>
<section class="quarto">
  <h1>Quarto Otaku</h1>
  {#if data.quarto}
    {@const quarto = data.quarto}
    <Cenario
      tema={quarto.tema}
      iluminacao={quarto.iluminacao}
      objetos={quarto.objetos}
      companheiros={quarto.usuario.companheiros}
    />
    {#if form?.mensagem}<p role="status">{form.mensagem}</p>{/if}
    <div class="paineis">
      <section class="painel">
        <h2>Ambiente</h2>
        <form method="POST" action="?/ambiente" use:enhance>
          <label
            >Tema<select name="tema"
              >{#each Object.entries(temas) as [id, nome] (id)}<option
                  value={id}
                  selected={id === quarto.tema}>{nome}</option
                >{/each}</select
            ></label
          >
          <label
            >Iluminação<select name="iluminacao"
              >{#each Object.entries(luzes) as [id, nome] (id)}<option
                  value={id}
                  selected={id === quarto.iluminacao}>{nome}</option
                >{/each}</select
            ></label
          >
          <label class="linha"
            ><input type="checkbox" name="publico" checked={quarto.publico} /> Permitir visitas pelo link</label
          >
          <button>Salvar ambiente</button>
        </form>
        {#if quarto.publico}<a href={'/quarto-otaku/visitar/' + quarto.id}>Abrir link de visita</a
          >{/if}
        <h2>Companheiros</h2>
        {#each quarto.usuario.companheiros as pet (pet.especie.nome)}<p class="linha">
            <img src={pet.especie.imagemUrl} alt="" width="48" height="48" />{pet.especie.nome}
          </p>
        {:else}<p>Desperte seu primeiro mascote para descansar aqui.</p>{/each}
        <a href="/companheiros">Abrir coleção</a>
      </section>
      <section class="painel inventario">
        <h2>Inventário</h2>
        <p>
          Adicione títulos à Minha Lista para colecionar pôsteres. Ao levar um companheiro ao nível
          10, você ganha o Cristal do guardião.
        </p>
        {#each quarto.objetos as p (p.id)}
          <details>
            <summary>{nomeDaPeca(p)} <small>{p.colocado ? 'No quarto' : 'Guardado'}</small></summary
            >
            <form method="POST" action="?/mover" use:enhance>
              <input type="hidden" name="objeto" value={p.id} />
              <p>{p.titulo ? 'Pôster de anime' : decoracoes[p.chave]?.detalhe}</p>
              <label
                >Horizontal (%)<input type="range" name="x" min="10" max="90" value={p.x} /></label
              >
              <label
                >Vertical (%)<input type="range" name="y" min="10" max="90" value={p.y} /></label
              >
              <label
                >Rotação (graus)<input
                  type="number"
                  name="rotacao"
                  min="-180"
                  max="180"
                  required
                  value={p.rotacao}
                /></label
              >
              <label class="linha"
                ><input type="checkbox" name="colocado" checked={p.colocado} /> Exibir no quarto</label
              >
              <button>Salvar posição</button>
            </form>
          </details>{/each}
      </section>
    </div>
  {:else}<p>Entre na sua conta para decorar seu quarto e receber visitas.</p>
    <a href="/entrar">Entrar</a>{/if}
</section>

<style>
  .quarto {
    max-width: 64rem;
    margin: auto;
    padding: clamp(1rem, 4vw, 3rem);
    color: var(--texto, #eee8ff);
  }
  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin: 0 0 1rem;
    letter-spacing: -0.045em;
  }
  h2 {
    font-size: 1.4rem;
    margin: 0 0 0.75rem;
  }
  form + h2,
  a + h2,
  form ~ h2 {
    margin-top: 1.8rem;
  }
  .paineis {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 1rem;
    margin-top: 1rem;
  }
  .painel {
    border: 1px solid #50415e;
    border-radius: 1rem;
    padding: clamp(1rem, 3vw, 1.65rem);
    background: #201927;
    color: #f3eaf9;
    min-width: 0;
  }
  p {
    line-height: 1.5;
  }
  form,
  label {
    display: grid;
    gap: 0.4rem;
  }
  form {
    gap: 0.85rem;
  }
  button,
  select,
  input[type='number'] {
    font: inherit;
    padding: 0.65rem;
    border: 1px solid #76658c;
    border-radius: 0.5rem;
    color: #fff;
    background: #33273e;
  }
  button {
    cursor: pointer;
    background: #7045a1;
    font-weight: 650;
  }
  a {
    display: inline-block;
    margin-top: 0.75rem;
    text-decoration: underline;
    color: #c6a8f7;
  }
  .linha,
  .inventario summary {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }
  .linha input {
    accent-color: #aa7dd4;
  }
  details {
    border-top: 1px solid #4c3d56;
    padding: 0.7rem 0;
  }
  details form {
    padding: 0.8rem 0.2rem;
  }
  .inventario summary {
    justify-content: space-between;
    cursor: pointer;
    min-height: 2.5rem;
    list-style: revert;
  }
  small {
    color: #c1accf;
    font-size: 0.78rem;
  }
  input[type='range'] {
    width: 100%;
    accent-color: #c397f5;
  }
  @media (max-width: 650px) {
    .paineis {
      grid-template-columns: 1fr;
    }
  }
</style>
