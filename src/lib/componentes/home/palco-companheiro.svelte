<script lang="ts">
  import { onMount } from 'svelte';
  import { FORMAS_ASTRA } from '$lib/mascotes/regras';
  import Palco3d from './palco-3d.svelte';
  let mostrar3d = false;
  import Guardiao from './guardiao-articulado.svelte';
  export let id: string;
  export let nome: string;
  export let especie: string;
  export let forma: string;
  export let cor: string;
  export let nivel: number;
  let movimento = 'observar';
  let celebracao = '';
  let toque = false;
  const acoes = [
    ['observar', 'Observar'],
    ['andar', 'Andar'],
    ['correr', 'Correr'],
    ['saltar', 'Saltar'],
    ['sentar', 'Sentar'],
    ['dormir', 'Dormir']
  ];
  $: movimentos = nivel >= 10 ? [...acoes, ['dancar', 'Dança astral']] : acoes;
  function agir(acao: string) {
    toque = false;
    movimento = acao;
  }
  onMount(() => {
    const ultimaForma = [...FORMAS_ASTRA].reverse().find((item) => item.nivelMinimo <= nivel)!;
    // Somente o aviso de evolução é local. O nível e a forma vêm da conta.
    try {
      const chave = 'yokira-evolucao-vista-' + id;
      const anterior = Number(localStorage.getItem(chave) ?? 1);
      if (ultimaForma.nivelMinimo > anterior) {
        celebracao = nome + ' conquistou a forma ' + ultimaForma.nome + '!';
        movimento = 'celebrar';
      }
      localStorage.setItem(chave, String(ultimaForma.nivelMinimo));
    } catch {
      /* Armazenamento do navegador pode estar indisponível. */
    }
  });
</script>

<button
  type="button"
  class="universo-personagem"
  aria-label={'Interagir com ' + nome}
  on:click={() => {
    agir(movimento === 'saltar' ? 'sentar' : 'saltar');
    toque = movimento === 'saltar';
  }}
>
  <span class="universo-brilho" aria-hidden="true"></span>
  <Guardiao {id} {forma} {cor} {especie} {movimento} />
</button>
<div class="universo-legenda-palco">
  <span aria-live="polite"
    >{toque
      ? nome + ' está feliz em te ver!'
      : celebracao || 'Toque em ' + nome + ' para interagir.'}</span
  >
  <strong>{FORMAS_ASTRA.find((item) => item.id === forma)?.nome}</strong>
</div>
<button type="button" aria-pressed={mostrar3d} on:click={() => (mostrar3d = !mostrar3d)}
  >{mostrar3d ? 'Fechar modelo 3D' : 'Ver modelo 3D'}</button
>
{#if mostrar3d}{#key forma + cor + especie}<Palco3d
      {forma}
      {cor}
      {especie}
      {movimento}
    />{/key}{/if}
<div class="acoes" aria-label={'Movimentos de ' + nome}>
  {#each movimentos as [acao, rotulo] (acao)}
    <button type="button" aria-pressed={movimento === acao} on:click={() => agir(acao)}
      >{rotulo}</button
    >
  {/each}
</div>

<style>
  .acoes {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin: 0.75rem 0;
  }
  .acoes button {
    font: inherit;
    font-size: 0.74rem;
    background: #21192c;
    color: #e1d5ed;
    border: 1px solid #58436c;
    border-radius: 20px;
    padding: 0.45rem 0.75rem;
    cursor: pointer;
  }
  .acoes button[aria-pressed='true'] {
    background: #513665;
    border-color: #c796e8;
  }
</style>
