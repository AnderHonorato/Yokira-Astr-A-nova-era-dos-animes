<script lang="ts">
  import { FORMAS_ASTRA } from '$lib/mascotes/regras';
  export let id: string;
  export let forma = 'despertar';
  export let cor = 'violeta';
  export let especie = 'astra';
  export let movimento = 'observar';
  $: etapa = FORMAS_ASTRA.findIndex((f) => f.id === forma);
  $: luz = cor === 'azul' ? '#73d9ff' : cor === 'rosa' ? '#ff91c5' : '#cb8cff';
  $: pelo = especie === 'astra' ? '#49376e' : '#304e70';
  const tom = (nome: string) => 'url(#' + id + '-' + nome + ')';
</script>

<svg class={'guardiao ' + movimento} viewBox="0 0 320 290" aria-hidden="true" style:--luz={luz}>
  <defs>
    <linearGradient id={id + '-pelo'} x2=".7" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#a883c1" /><stop offset=".21" stop-color={pelo} /><stop
        offset=".65"
        stop-color="#21182f"
      /><stop offset="1" stop-color="#48305f" />
    </linearGradient>
    <linearGradient id={id + '-cauda'} x1="0" y1="1" x2=".8" y2="0">
      <stop stop-color="#302340" /><stop offset=".48" stop-color={pelo} /><stop
        offset=".77"
        stop-color="#b18bd0"
      /><stop offset="1" stop-color="#e1c5ee" />
    </linearGradient>
    <linearGradient id={id + '-peito'} x2=".6" y2="1">
      <stop stop-color="#735782" /><stop offset=".35" stop-color="#e7d4f2" /><stop
        offset="1"
        stop-color="#956eaa"
      />
    </linearGradient>
  </defs>
  <ellipse cx="158" cy="253" rx="97" ry="8" fill="#af7cd4" opacity=".17" />
  <g class="animal" stroke-linejoin="round" stroke-linecap="round">
    {#if etapa >= 3}
      <g class="halo" fill="none" stroke={luz}
        ><ellipse cx="128" cy="50" rx="55" ry="9" transform="rotate(-13 128 50)" /><circle
          cx="177"
          cy="38"
          r="3"
          fill={luz}
        /></g
      >
    {/if}
    <g class="quadril">
      <g class="cauda">
        <path
          d="M183 184 Q208 188 215 162 Q222 143 214 119 Q202 92 215 64 Q225 43 250 38 Q235 49 234 64 Q245 60 252 48 Q250 67 265 76 Q284 91 281 115 L288 101 Q299 143 275 169 Q282 164 284 160 Q272 201 226 207 Q200 211 181 198Z"
          fill={tom('cauda')}
          stroke="#7a5b90"
          stroke-width="2"
        />
        <path
          d="M219 86 Q214 104 234 121 Q249 136 244 152 Q265 135 260 110 Q280 138 257 163 Q243 176 219 180 Q249 162 235 143 Q214 118 219 86Z"
          fill="#503062"
        />
        <path
          d="M218 120 Q250 132 245 153 Q259 134 250 119"
          fill="none"
          stroke={luz}
          stroke-width={etapa >= 2 ? 5 : 2}
        />
        {#if etapa >= 2}<path
            d="M224 184 Q279 179 285 124 Q294 184 245 200 Q267 192 269 180 Q251 195 224 195Z"
            fill={luz}
          />{/if}
      </g>
      <g class="patinha oposta" fill="#302339"
        ><path
          d="M183 167 Q207 177 207 201 L232 235 Q242 236 243 245 L220 246 L196 220 L176 199Z"
        /></g
      >
      <path
        class="patinha"
        d="M171 163 Q202 160 207 186 Q210 207 190 219 L181 239 Q186 242 183 249 L157 249 Q156 240 166 235 L172 206 Q161 195 158 183Z"
        fill={tom('pelo')}
        stroke="#5b4469"
      />
    </g>
    <g class="patinha oposta"
      ><path
        d="M113 165 L131 166 L134 212 L127 239 Q132 242 129 247 L108 247 Q107 240 115 236 L115 210Z"
        fill="#392941"
      /></g
    >
    <path
      d="M108 134 Q135 124 156 145 Q173 155 189 157 Q212 161 208 185 Q207 203 190 204 Q164 201 148 195 Q126 202 105 184 Q87 167 108 134Z"
      fill={tom('pelo')}
      stroke="#674c77"
      stroke-width="2"
    />
    <path
      class="patinha"
      d="M134 169 Q148 169 154 186 L146 214 L141 242 Q149 247 145 252 L119 252 Q117 245 128 238 L128 212 L125 188Z"
      fill={tom('pelo')}
      stroke="#745783"
      stroke-width="2"
    />
    <path
      d="M94 129 L151 118 Q151 134 161 135 L154 142 L164 143 Q155 154 144 159 L149 156 Q146 169 135 174 L130 186 L124 176 L117 188 L110 173 L105 179 Q94 171 96 161 L88 166 Q84 154 93 146 L85 149Z"
      fill={tom('peito')}
    />
    <g class="cabeca">
      <g class="orelha"
        ><path
          d="M90 102 Q63 84 67 42 Q88 52 105 80Z"
          fill={tom('pelo')}
          stroke="#9873ad"
          stroke-width="2"
        /><path d="M85 88 Q73 77 72 54 Q87 68 93 82Z" fill="#ae77be" /></g
      >
      <g class="orelha outra"
        ><path
          d="M127 82 Q151 64 165 36 Q173 68 149 101Z"
          fill={tom('pelo')}
          stroke="#9a74af"
          stroke-width="2"
        /><path d="M139 86 Q154 69 162 51 Q162 75 149 88Z" fill="#b38ac3" /></g
      >
      <path
        d="M85 87 Q93 74 111 72 L104 66 Q124 62 136 70 L144 64 L140 77 Q158 81 155 104 L163 102 L154 112 L161 113 L151 123 L155 125 Q144 137 131 137 Q122 149 108 148 Q96 146 89 135 Q79 135 72 127 L79 126 L70 118 L78 117 L72 108 L82 106Z"
        fill={tom('pelo')}
        stroke="#745484"
        stroke-width="1.5"
      />
      <path
        d="M76 121 L96 125 Q103 133 111 132 Q122 130 132 123 L148 119 Q143 131 128 136 Q119 148 109 144 Q99 143 93 134Z"
        fill={tom('peito')}
      />
      <g class="olhos">
        <path
          d="M83 108 Q93 108 100 115 Q91 122 84 115Z M119 114 Q130 104 143 103 Q139 116 123 118Z"
          fill={luz}
        />
        <path
          d="M91 110 L94 112 L93 117 L90 115Z M131 108 L134 107 L132 114 L129 115Z"
          fill="#2a1835"
        />
        <circle cx="95" cy="112" r="1.6" fill="white" /><circle
          cx="136"
          cy="107"
          r="1.9"
          fill="white"
        />
      </g>
      <path d="M103 128 Q109 125 115 127 L110 132Z" fill="#24192b" />
      <path
        d="M109 84 L112 91 L119 94 L112 98 L109 105 L106 98 L100 95 L106 91Z"
        fill={luz}
        stroke="#fcf1ff"
      />
      {#if etapa >= 1}<path
          d="M84 122 L93 124 M133 123 L144 117 M100 89 L95 86 M118 87 L127 81"
          fill="none"
          stroke={luz}
          stroke-width="2"
        />{/if}
    </g>
    {#if etapa >= 4}
      <g class="constelacao" stroke={luz} fill="#f7ddff"
        ><path
          d="M152 148 L167 164 L181 161 L195 178"
          fill="none"
        />{#each [[152, 148], [167, 164], [181, 161], [195, 178]] as ponto (ponto[0])}<circle
            cx={ponto[0]}
            cy={ponto[1]}
            r="2.8"
          />{/each}</g
      >
      <path
        d="M146 151 Q162 126 180 125 L171 140 L187 133 L172 151 L180 149 L159 164Z"
        fill={tom('peito')}
        stroke={luz}
      />
    {/if}
  </g>
</svg>

<style>
  .guardiao {
    display: block;
    width: 100%;
    height: auto;
    max-height: 100%;
    overflow: visible;
    position: relative;
    pointer-events: none;
  }
  .animal {
    transform-origin: 155px 250px;
    animation: respirar 4s ease-in-out infinite;
  }
  .cauda {
    transform-origin: 187px 185px;
    animation: abanar 3.4s ease-in-out infinite alternate;
  }
  .orelha {
    transform-origin: 97px 92px;
    animation: escutar 5.5s ease-in-out infinite;
  }
  .outra {
    transform-origin: 139px 92px;
    animation-delay: 0.6s;
  }
  .cabeca {
    transform-origin: 120px 139px;
    animation: espiar 7s ease-in-out infinite;
  }
  .olhos {
    transform-origin: 110px 113px;
    animation: piscar 4.9s linear infinite;
  }
  .patinha {
    transform-origin: 145px 180px;
  }
  .observar .cabeca {
    animation-duration: 3.8s;
  }
  .andar .patinha,
  .correr .patinha {
    animation: passo 0.78s ease-in-out infinite alternate;
  }
  .andar .oposta,
  .correr .oposta {
    animation-direction: alternate-reverse;
  }
  .correr .patinha {
    animation-duration: 0.23s;
  }
  .correr .animal {
    animation: trotar 0.46s ease-in-out infinite;
  }
  .saltar .animal,
  .celebrar .animal {
    animation: salto 0.85s ease-out 2;
  }
  .sentar .quadril,
  .dormir .quadril {
    transform-origin: 148px 163px;
    transform: rotate(13deg) translateY(5px);
  }
  .sentar .animal {
    transform: scaleY(0.86);
    animation: none;
  }
  .dormir .animal {
    transform: scaleY(0.65);
    animation: none;
  }
  .dormir .cabeca {
    transform: rotate(14deg);
    animation: none;
  }
  .dormir .olhos {
    transform: scaleY(0.1);
    animation: none;
  }
  .dormir .cauda {
    animation-duration: 8s;
  }
  .halo,
  .constelacao {
    filter: drop-shadow(0 0 3px var(--luz));
  }
  .dancar .animal {
    transform-origin: center bottom;
    animation: danca 1.2s ease-in-out infinite alternate;
  }
  @keyframes danca {
    0% {
      transform: rotate(-8deg) translateY(-4px);
    }
    50% {
      transform: translateY(-15px);
    }
    100% {
      transform: rotate(8deg) translateY(-4px);
    }
  }
  @keyframes respirar {
    50% {
      transform: scale(1.008, 1.018);
    }
  }
  @keyframes abanar {
    to {
      transform: rotate(8deg);
    }
  }
  @keyframes escutar {
    0%,
    80%,
    100% {
      transform: rotate(0);
    }
    85% {
      transform: rotate(-9deg);
    }
    90% {
      transform: rotate(4deg);
    }
  }
  @keyframes espiar {
    0%,
    68%,
    100% {
      transform: rotate(0);
    }
    38%,
    50% {
      transform: rotate(-5deg);
    }
  }
  @keyframes piscar {
    0%,
    93%,
    98%,
    100% {
      transform: scaleY(1);
    }
    95%,
    96% {
      transform: scaleY(0.12);
    }
  }
  @keyframes passo {
    from {
      transform: rotate(-12deg);
    }
    to {
      transform: rotate(13deg);
    }
  }
  @keyframes trotar {
    50% {
      transform: translateY(-6px) rotate(-2deg);
    }
  }
  @keyframes salto {
    45% {
      transform: translateY(-26px) rotate(-4deg);
    }
    80% {
      transform: scale(1.03, 0.96);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .guardiao * {
      animation: none !important;
    }
  }
</style>
