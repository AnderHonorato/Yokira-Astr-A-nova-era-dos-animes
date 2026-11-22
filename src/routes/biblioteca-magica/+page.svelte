<script lang="ts">
  import './biblioteca-magica.css';
  import Guardiao from '$componentes/home/guardiao-articulado.svelte';
  export let data;
  export let form;
  const estantes = [
    ['quero-ver', 'Quero ver'],
    ['assistindo', 'Em andamento'],
    ['concluido', 'Concluídos']
  ] as const;
  let busca = '';
  let filtro = 'todos';
  let aberto: string | null = null;
  $: filtrados = data.livros.filter(
    (livro) =>
      livro.nome.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR').trim()) &&
      (filtro === 'todos' || livro.status === filtro)
  );
</script>

<svelte:head><title>Biblioteca Mágica — Minha Lista | Yōkira Astra</title></svelte:head>
<div class="biblioteca" data-tema={data.temaEstante}>
  <header class="biblioteca-cabecalho">
    <span class="biblioteca-selo">✧ &nbsp; COLEÇÃO PESSOAL / BIBLIOTECA MÁGICA</span>
    <h1>Cada história é um <span>novo mundo.</span></h1>
    <p>
      Sua Minha Lista em forma de biblioteca. Os livros e episódios são os mesmos do catálogo
      original — sem duplicar progresso.
    </p>
    <a href="/minha-lista" class="biblioteca-convencional">Ver lista convencional ↗</a>
  </header>
  {#if data.precisaEntrar}
    <section class="biblioteca-vazia">
      <h2>Suas estantes ainda não foram abertas.</h2>
      <p>Entre para sincronizar os animes e seu histórico.</p>
      <a href="/entrar">Entrar na conta</a>
    </section>
  {:else}
    <div class="biblioteca-controles">
      <label
        >Pesquisar meus livros <input
          type="search"
          placeholder="Título do anime..."
          bind:value={busca}
        /></label
      >
      <label
        >Estante <select bind:value={filtro}>
          <option value="todos">Todos os livros</option>
          <option value="quero-ver">Quero ver</option>
          <option value="assistindo">Em andamento</option>
          <option value="concluido">Concluídos</option>
        </select></label
      >
      <span>{filtrados.length} livro(s)</span>
    </div>
    <form method="POST" action="?/estante" class="biblioteca-tema">
      <label
        >Tema da estante <select name="tema" value={data.temaEstante}>
          <option value="ametista">Ametista</option><option value="cedro">Cedro</option><option
            value="lunar">Luar</option
          >
        </select></label
      ><button>Salvar tema</button>
      {#if form?.recado}<span role="status">{form.recado}</span>{/if}
    </form>
    {#if data.livros.length === 0}
      <section class="biblioteca-vazia">
        <h2>A primeira estante está pronta.</h2>
        <p>Adicione animes à Minha Lista para que apareçam aqui automaticamente.</p>
        <a href="/portal-astral">Descobrir títulos no Portal Astral</a>
      </section>
    {:else if filtrados.length === 0}
      <section class="biblioteca-vazia">
        <h2>Nenhum livro encontrado.</h2>
        <p>Experimente outro título ou estante.</p>
      </section>
    {:else}
      {#each estantes as [status, nome] (status)}
        {@const livros = filtrados.filter((livro) => livro.status === status)}
        {#if livros.length}
          <section aria-label={nome}>
            <h2 class="nome-estante">{nome} <small>{livros.length}</small></h2>
            <div class="biblioteca-estante">
              {#each livros as livro (livro.id)}
                <article class="biblioteca-livro" class:biblioteca-aberto={aberto === livro.id}>
                  <button
                    type="button"
                    class="biblioteca-capa"
                    aria-expanded={aberto === livro.id}
                    aria-label={'Abrir livro ' + livro.nome}
                    on:click={() => (aberto = aberto === livro.id ? null : livro.id)}
                  >
                    <span class="biblioteca-lombada" aria-hidden="true"></span>
                    <img
                      src={livro.poster}
                      alt={'Capa de ' + livro.nome}
                      loading="lazy"
                      decoding="async"
                    />
                    <span class="biblioteca-selo-status"
                      >{livro.status === 'concluido'
                        ? 'Concluído'
                        : livro.status === 'assistindo'
                          ? 'Lendo'
                          : 'Na estante'}</span
                    >
                  </button>
                  <div class="biblioteca-livro-dados">
                    <strong>{livro.nome}</strong>
                    <small
                      >{livro.episodiosConcluidos} / {livro.episodiosTotal} episódios concluídos</small
                    >
                    {#if aberto === livro.id}
                      <div class="biblioteca-folhas">
                        {#if data.acompanhante}<div
                            class="leitor"
                            class:esquerda={data.acompanhante.posicao === 'esquerda'}
                          >
                            <Guardiao
                              id={'leitor-' + livro.id}
                              especie={data.acompanhante.especieId}
                              forma={data.acompanhante.formaSelecionada}
                              cor={data.acompanhante.corAura}
                              movimento="sentar"
                            />
                          </div>{/if}
                        <p>{livro.sinopseCurta}</p>
                        <a href={'/titulo/' + livro.slug}>Abrir anime ↗</a>
                      </div>
                    {/if}
                  </div>
                </article>
              {/each}
            </div>
          </section>
        {/if}
      {/each}
    {/if}
  {/if}
  <footer class="biblioteca-rodape">
    <a href="/companheiros">Minha coleção de companheiros ↗</a>
  </footer>
</div>
