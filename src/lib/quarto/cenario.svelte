<script lang="ts">
  import { nomeDaPeca, type Peca } from './ambiente';
  export let tema: string;
  export let iluminacao: string;
  export let objetos: Peca[];
  export let companheiros: { especie: { nome: string; imagemUrl: string } }[];
</script>

<div class="cenario {tema} {iluminacao}" aria-label="Decoração do quarto">
  <div class="janela" aria-hidden="true"><i></i></div>
  <div class="piso" aria-hidden="true"></div>
  {#each objetos.filter((p) => p.colocado) as p (p.id)}
    <div
      class="peca"
      class:baixo={p.chave === 'tapete'}
      style:left={p.x + '%'}
      style:top={p.y + '%'}
      style:--angulo={p.rotacao + 'deg'}
      role="img"
      aria-label={nomeDaPeca(p)}
      title={nomeDaPeca(p)}
    >
      {#if p.titulo}<div class="poster">
          {#if p.titulo.posterUrl}<img src={p.titulo.posterUrl} alt="" />{:else}<span
              >{p.titulo.nome}</span
            >{/if}
        </div>
      {:else if p.chave === 'estante'}<div class="estante"><i></i><i></i></div>
      {:else if p.chave === 'descanso'}<div class="almofada"></div>
      {:else if p.chave === 'tapete'}<div class="tapete">✧</div>
      {:else if p.chave === 'cristal'}<div class="cristal"></div>{/if}
    </div>
  {/each}
  {#each objetos.filter((p) => p.colocado && p.chave === 'descanso') as cama (cama.id)}
    {#if companheiros.length}<div
        class="repouso"
        style:left={cama.x + '%'}
        style:top={cama.y + '%'}
      >
        <img
          src={companheiros[0].especie.imagemUrl}
          alt={companheiros[0].especie.nome + ' em descanso'}
        />
      </div>{/if}
  {/each}
</div>

<style>
  .cenario {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    aspect-ratio: 16/8;
    min-height: 220px;
    container-type: inline-size;
    border-radius: 1rem;
    border: 1px solid #837099;
    --ceu: #48477c;
    --parede: #38294b;
    --luz: #ccc8ff;
    background:
      radial-gradient(
        ellipse at 70% 32%,
        color-mix(in srgb, var(--luz) 45%, var(--parede)),
        transparent 40%
      ),
      linear-gradient(100deg, #171322, var(--parede) 48%, #171324);
  }
  .sakura {
    --parede: #693651;
    --ceu: #a56a89;
  }
  .oceano {
    --parede: #16414d;
    --ceu: #367281;
  }
  .aurora {
    --luz: #8aefce;
  }
  .poente {
    --luz: #ffba80;
  }
  .janela {
    position: absolute;
    top: 9%;
    left: 51%;
    width: 29%;
    height: 44%;
    border: 0.65cqw solid #211b30;
    border-radius: 48% 48% 4% 4%;
    overflow: hidden;
    background:
      radial-gradient(circle at 68% 28%, #fff7df 0%, var(--luz) 8%, transparent 8.5%),
      radial-gradient(circle at 20% 34%, white 0.55%, transparent 1%),
      radial-gradient(circle at 50% 17%, white 0.55%, transparent 1%),
      linear-gradient(160deg, #181e4d, var(--ceu));
    box-shadow: 0 0 4cqw #f2ddff33;
  }
  .janela i {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, transparent 48%, #282337 49% 51%, transparent 52%),
      linear-gradient(0deg, transparent 42%, #282337 43% 45%, transparent 46%);
  }
  .piso {
    position: absolute;
    inset: 64% 0 0;
    background:
      repeating-linear-gradient(172deg, transparent 0 1.8cqw, #352736 2cqw 2.12cqw),
      linear-gradient(#554052, #24192a);
    border-top: 0.8cqw solid #201923;
  }
  .peca,
  .repouso {
    position: absolute;
    transform: translate(-50%, -50%) rotate(var(--angulo, 0deg));
    z-index: 2;
  }
  .baixo {
    z-index: 1;
  }
  .estante {
    width: 19cqw;
    height: 16cqw;
    padding: 1.1cqw 0.9cqw 0;
    box-sizing: border-box;
    background: #583943;
    border: 0.6cqw solid #a77567;
    box-shadow: 0.9cqw 0.5cqw 0.6cqw #180e1d99;
  }
  .estante i {
    display: block;
    height: 43%;
    border-bottom: 0.8cqw solid #bc8c74;
    background: repeating-linear-gradient(
      86deg,
      #b98277 0 1.3cqw,
      #c6b989 1.4cqw 2cqw,
      #59717c 2.1cqw 3cqw,
      #7c597a 3.2cqw 4.6cqw
    );
  }
  .almofada,
  .tapete {
    border-radius: 50%;
    width: 16cqw;
    height: 5.8cqw;
    background: radial-gradient(ellipse, #b596cb, #8964a6 63%, #573963 65%);
    box-shadow: 0 0.55cqw 0.4cqw #201222aa;
  }
  .tapete {
    width: 31cqw;
    height: 8cqw;
    color: #e4ccbf;
    display: grid;
    place-items: center;
    font-size: 4cqw;
    background: repeating-radial-gradient(ellipse, #865769 0 35%, #c4a393 36% 39%, #633951 40% 44%);
  }
  .repouso {
    z-index: 3;
    transform: translate(-50%, -90%);
    width: 12cqw;
    pointer-events: none;
  }
  .repouso img,
  .poster img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .poster {
    width: 9cqw;
    height: 13cqw;
    border: 0.6cqw solid #d8bb96;
    background: #301f39;
    display: grid;
    place-items: center;
    color: white;
    font-size: 1.5cqw;
  }
  .poster img {
    object-fit: cover;
  }
  .cristal {
    width: 5cqw;
    height: 8cqw;
    clip-path: polygon(50% 0, 100% 35%, 50% 100%, 0 35%);
    background: conic-gradient(#e4d1fa, #9769cf, #83d8ff, #ede1ff);
  }
</style>
