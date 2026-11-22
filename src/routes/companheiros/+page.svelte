<script lang="ts">
  import './companheiros.css';
  import { calcularProgressao, FORMAS_ASTRA, nivelPorExperiencia } from '$lib/mascotes/regras';

  export let data;
  export let form;
  let reacao: 'calmo' | 'animado' | 'descansando' = 'calmo';
</script>

<svelte:head>
  <title>Meus companheiros — Yōkira Astra</title>
  <meta
    name="description"
    content="Desbloqueie Astra, evolua suas formas e personalize seu companheiro no Yōkira."
  />
</svelte:head>

<div class="universo-companheiros">
  <div class="universo-introducao">
    <div>
      <span class="universo-selo">✦ &nbsp; UNIVERSO ASTRA / COLEÇÃO</span>
      <h1>Seu universo. <span>Seu guardião.</span></h1>
      <p>
        Desbloqueie o primeiro companheiro gratuitamente e conquiste novas formas pelas suas
        descobertas no Yōkira.
      </p>
    </div>
    <a href="/catalogo" class="universo-link">Explorar animes <span aria-hidden="true">↗</span></a>
  </div>

  {#if data.precisaEntrar}
    <section class="universo-aviso" aria-label="Entrar para salvar progresso">
      <span aria-hidden="true">✧</span>
      <h2>Sua jornada começa com uma conta.</h2>
      <p>Entre para guardar mascotes, XP, formas e personalizações.</p>
      <a href="/entrar">Entrar no Yōkira</a>
    </section>
  {:else if data.colecao}
    {#if form?.recado}
      <p class="universo-recado" role="status">{form.recado}</p>
    {/if}

    {#if data.colecao.mascotes.length === 0}
      <section class="universo-despertar">
        <div class="universo-img-despertar">
          <img
            src="/mascotes/astra.webp"
            alt="Astra, guardião roxo e lilás de quatro patas"
            width="360"
            height="360"
          />
          <span class="universo-orbita" aria-hidden="true"></span>
        </div>
        <div>
          <span class="universo-selo">MISSÃO INTRODUTÓRIA · GRATUITA</span>
          <h2>Desperte o Astra.</h2>
          <p>
            Um companheiro cósmico está pronto para conhecer seu universo. Basta tocar no botão; não
            exige compra nem assistir a nenhum anime.
          </p>
          <form method="POST" action="?/despertar">
            <button type="submit" class="universo-botao-principal"
              >Desbloquear companheiro <span aria-hidden="true">✦</span></button
            >
          </form>
        </div>
      </section>
    {:else}
      {#each data.colecao.mascotes as companheiro (companheiro.id)}
        {@const progresso = calcularProgressao(companheiro.experiencia)}
        {@const nivel = nivelPorExperiencia(companheiro.experiencia)}
        <div class="universo-painel">
          <section class="universo-palco" aria-label="Companheiro equipado e interativo">
            <div class="universo-palco-topo">
              <span class="universo-selo"
                >{companheiro.equipado ? '✦ EQUIPADO' : 'COLEÇÃO'} / {companheiro.especie
                  .nome}</span
              >
              <span class="universo-indicador">NÍVEL {nivel}</span>
            </div>
            <button
              type="button"
              class="universo-personagem"
              class:universo-saltando={reacao === 'animado'}
              class:universo-descansando={reacao === 'descansando'}
              class:universo-guardiao={nivel >= 10 && companheiro.formaSelecionada !== 'despertar'}
              class:universo-astral={nivel >= 25 &&
                !['despertar', 'guardiao'].includes(companheiro.formaSelecionada)}
              class:universo-celestial={nivel >= 50 &&
                ['celestial', 'lendaria'].includes(companheiro.formaSelecionada)}
              class:universo-lendaria={nivel >= 80 && companheiro.formaSelecionada === 'lendaria'}
              class:universo-azul={companheiro.corAura === 'azul'}
              class:universo-rosa={companheiro.corAura === 'rosa'}
              on:click={() => (reacao = reacao === 'animado' ? 'descansando' : 'animado')}
              aria-label="Interagir com Astra: tocar para fazê-lo saltar ou descansar"
            >
              <span class="universo-brilho" aria-hidden="true"></span>
              <span class="universo-anel" aria-hidden="true"></span>
              <span class="universo-constelacoes" aria-hidden="true">✦ ✧ ✦</span>
              <img
                src={companheiro.especie.imagemUrl}
                alt="Astra, mascote original com marcas astrais e cauda volumosa"
                width="380"
                height="380"
                draggable="false"
              />
            </button>
            <div class="universo-legenda-palco">
              <span
                >{reacao === 'animado'
                  ? 'Astra está feliz em te ver!'
                  : reacao === 'descansando'
                    ? 'Astra está descansando.'
                    : 'Toque em Astra para interagir.'}</span
              ><strong
                >{FORMAS_ASTRA.find((item) => item.id === companheiro.formaSelecionada)
                  ?.nome}</strong
              >
            </div>
            {#if !companheiro.equipado}
              <form method="POST" action="?/equipar">
                <input type="hidden" name="companheiroId" value={companheiro.id} /><button
                  type="submit">Equipar este companheiro</button
                >
              </form>
            {/if}
          </section>
          <section class="universo-detalhes">
            <span class="universo-selo">SEU COMPANHEIRO</span>
            <h2>{companheiro.especie.nome} <span>✧</span></h2>
            <p>{companheiro.especie.descricao}</p>
            <div class="universo-progresso-cabecalho">
              <strong>Nível {progresso.nivel}</strong><span
                >{progresso.experienciaNoNivel} / {progresso.metaNoNivel} XP</span
              >
            </div>
            <div
              class="universo-barra"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax={progresso.metaNoNivel}
              aria-valuenow={progresso.experienciaNoNivel}
              aria-label="Experiência até o próximo nível"
            >
              <span style:width={progresso.porcentagem + '%'}></span>
            </div>
            <p class="universo-xp">
              {progresso.restante} XP até o nível {progresso.proximoNivel}. Total: {progresso.experiencia}
              XP.
            </p>
            <div class="universo-subtitulo">
              <h3>Árvore de evolução</h3>
              <span>5 FORMAS</span>
            </div>
            <ol class="universo-evolucao">
              {#each FORMAS_ASTRA as forma (forma.id)}
                <li
                  class:liberada={forma.nivelMinimo <= nivel}
                  class:selecionada={forma.id === companheiro.formaSelecionada}
                >
                  <span class="universo-no">{forma.nivelMinimo <= nivel ? '✦' : '◇'}</span>
                  <div><strong>{forma.nome}</strong><small>{forma.detalhe}</small></div>
                  <span class="universo-meta">NV. {forma.nivelMinimo}</span>
                </li>
              {/each}
            </ol>
            <div class="universo-subtitulo">
              <h3>Personalização</h3>
              <span>SALVA NA CONTA</span>
            </div>
            <form method="POST" action="?/aparencia" class="universo-formulario">
              <input type="hidden" name="companheiroId" value={companheiro.id} />
              <label
                >Forma desbloqueada
                <select name="forma">
                  {#each FORMAS_ASTRA as forma (forma.id)}
                    <option
                      value={forma.id}
                      selected={companheiro.formaSelecionada === forma.id}
                      disabled={forma.nivelMinimo > nivel}
                      >{forma.nome} {forma.nivelMinimo > nivel ? '· bloqueada' : ''}</option
                    >
                  {/each}
                </select>
              </label>
              <label
                >Aura
                <select name="cor">
                  <option value="violeta" selected={companheiro.corAura === 'violeta'}
                    >Violeta astral</option
                  >
                  <option
                    value="azul"
                    selected={companheiro.corAura === 'azul'}
                    disabled={!companheiro.eventos.some((e) => e.chave === 'generos-3')}
                    >Azul · missão</option
                  >
                  <option
                    value="rosa"
                    selected={companheiro.corAura === 'rosa'}
                    disabled={nivel < 25}>Rosa · nível 25</option
                  >
                </select>
              </label>
              <button type="submit">Salvar aparência</button>
            </form>
          </section>
        </div>
      {/each}
      <div class="universo-grid-secundaria">
        <section class="universo-cartao">
          <span class="universo-selo">JORNADA YŌKIRA</span>
          <h2>Missão de descoberta</h2>
          <p>
            {data.missao.descricao} Uma recompensa de <strong>420 XP</strong> será concedida somente uma
            vez, com validação no servidor.
          </p>
          {#if data.colecao.equipado}
            <form method="POST" action="?/missao">
              <input type="hidden" name="companheiroId" value={data.colecao.equipado.id} />
              <button
                disabled={data.colecao.equipado.eventos.some((e) => e.chave === data.missao.chave)}
                >{data.colecao.equipado.eventos.some((e) => e.chave === data.missao.chave)
                  ? 'Missão concluída ✓'
                  : 'Conferir missão e receber XP'}</button
              >
            </form>
          {/if}
          <a href="/minha-lista">Ver Minha Lista ↗</a>
        </section>
        <section class="universo-cartao">
          <span class="universo-selo">PREFERÊNCIAS</span>
          <h2>Seu companheiro, suas regras</h2>
          <form method="POST" action="?/preferencias" class="universo-preferencias">
            <label
              ><input type="checkbox" name="visivel" checked={data.colecao.preferencias.visivel} /> Mostrar
              mascote</label
            >
            <label
              ><input
                type="checkbox"
                name="acompanhar"
                checked={data.colecao.preferencias.acompanhar}
              /> Acompanhar exploração</label
            >
            <label
              >Posição no ambiente
              <select name="posicao">
                <option value="direita" selected={data.colecao.preferencias.posicao === 'direita'}
                  >Direita</option
                >
                <option value="esquerda" selected={data.colecao.preferencias.posicao === 'esquerda'}
                  >Esquerda</option
                >
              </select>
            </label>
            <button type="submit">Salvar preferências</button>
          </form>
        </section>
      </div>
      {#if data.colecao.equipado}
        <section class="universo-cartao universo-historico">
          <div class="universo-subtitulo">
            <h2>Histórico do guardião</h2>
            <span>EVENTOS VALIDOS</span>
          </div>
          {#if data.colecao.equipado.eventos.length === 0}<p>
              Seu histórico começa após a primeira missão concluída.
            </p>
          {:else}
            <ul>
              {#each data.colecao.equipado.eventos as evento (evento.id)}<li>
                  <span>{evento.descricao}</span><strong>+{evento.pontos} XP</strong>
                </li>{/each}
            </ul>
          {/if}
        </section>
      {/if}
    {/if}
  {/if}
</div>
