<script lang="ts">
  import { onMount } from 'svelte';
  export let forma: string, cor: string, especie: string, movimento: string;
  let canvas: HTMLCanvasElement,
    falhou = false;
  onMount(() => {
    let ativo = true;
    let limpar: (() => void) | undefined;
    import('./guardiao-3d')
      .then(({ montarGuardiao }) => {
        if (ativo) limpar = montarGuardiao(canvas, forma, cor, especie, () => movimento);
      })
      .catch(() => {
        if (ativo) falhou = true;
      });
    return () => {
      ativo = false;
      limpar?.();
    };
  });
</script>

{#if falhou}<p role="status">
    O navegador não conseguiu iniciar o modo 3D. O companheiro 2D continua disponível.
  </p>{:else}<canvas bind:this={canvas} aria-label="Modelo tridimensional articulado do companheiro"
  ></canvas>{/if}

<style>
  canvas {
    width: 100%;
    height: clamp(13rem, 32vh, 22rem);
    display: block;
  }
</style>
