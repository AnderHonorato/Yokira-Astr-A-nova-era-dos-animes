import * as T from 'three';
import { FORMAS_ASTRA } from '$lib/mascotes/regras';

// Malhas rígidas ligadas a articulações compartilhadas. A mesma hierarquia atende todas as formas.
export function montarGuardiao(
  canvas: HTMLCanvasElement,
  forma: string,
  cor: string,
  especie: string,
  acao: () => string
) {
  const renderer = new T.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power'
  });
  const cena = new T.Scene(),
    camera = new T.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(3, 1.7, 4);
  camera.lookAt(0, 0.8, 0);
  const grupo = new T.Group();
  cena.add(grupo);
  const etapa = Math.max(
    0,
    FORMAS_ASTRA.findIndex((f) => f.id === forma)
  );
  const pelo = especie === 'luna' ? 0x394577 : 0x392449;
  const luz = cor === 'azul' ? 0x85dfff : cor === 'rosa' ? 0xff99cf : 0xce91ff;
  const geo = new T.SphereGeometry(1, 16, 12),
    ponta = new T.ConeGeometry(1, 1, 4);
  const materiais = new Map<number, T.MeshStandardMaterial>();
  function parte(
    pai: T.Object3D,
    x: number,
    y: number,
    z: number,
    a: number,
    b: number,
    c: number,
    tinta: number,
    geometria: T.BufferGeometry = geo
  ) {
    let mat = materiais.get(tinta);
    if (!mat) {
      mat = new T.MeshStandardMaterial({
        color: tinta,
        roughness: 0.72,
        emissive: tinta === luz ? luz : 0,
        emissiveIntensity: 0.45
      });
      materiais.set(tinta, mat);
    }
    const m = new T.Mesh(geometria, mat);
    pai.add(m);
    m.position.set(x, y, z);
    m.scale.set(a, b, c);
    return m;
  }
  function junta(pai: T.Object3D, x: number, y: number, z: number) {
    const j = new T.Group();
    pai.add(j);
    j.position.set(x, y, z);
    return j;
  }
  parte(grupo, 0, 0.65, 0, 0.39, 0.37, 0.64, pelo);
  const cabeca = junta(grupo, 0, 0.97, 0.43);
  parte(cabeca, 0, 0, 0.04, 0.39, 0.36, 0.34, pelo);
  parte(cabeca, 0, -0.13, 0.28, 0.21, 0.13, 0.16, 0x9b79ae);
  parte(cabeca, 0, -0.08, 0.42, 0.07, 0.045, 0.044, 0x211c32);
  const orelhas = [-1, 1].map((s) => {
    const o = junta(cabeca, s * 0.24, 0.22, 0);
    o.rotation.z = -s * 0.22;
    parte(o, 0, 0.14, 0, 0.18, 0.49, 0.14, pelo, ponta);
    parte(o, 0, 0.13, 0.07, 0.11, 0.34, 0.075, 0xa877b9, ponta);
    return o;
  });
  const olhos = [-1, 1].map((s) => {
    const o = junta(cabeca, s * 0.19, 0.03, 0.31);
    parte(o, 0, 0, 0, 0.082, 0.092, 0.036, luz);
    parte(o, 0, 0, 0.026, 0.032, 0.061, 0.018, 0x20192c);
    parte(o, 0.015, 0.032, 0.04, 0.015, 0.015, 0.008, 0xffffff);
    return o;
  });
  const marca = parte(cabeca, 0, 0.15, 0.34, 0.044, 0.068, 0.022, luz, ponta);
  marca.rotation.z = Math.PI;
  const patas = [-1, 1].flatMap((s) =>
    [-1, 1].map((f) => {
      const p = junta(grupo, s * 0.24, 0.54, f * 0.35);
      parte(p, 0, -0.19, 0, 0.12, 0.24, 0.13, pelo);
      parte(p, 0, -0.37, 0.045, 0.123, 0.085, 0.16, 0x9778ab);
      return p;
    })
  );
  const cauda = junta(grupo, 0, 0.65, -0.44);
  cauda.rotation.x = -0.8;
  parte(cauda, 0, 0.32, -0.16, 0.22, 0.46, 0.24, pelo);
  parte(cauda, 0, 0.67, -0.28, 0.18, 0.29, 0.19, etapa >= 2 ? luz : 0x9c76b5);
  for (let i = 0; i < etapa; i++)
    for (const s of [-1, 1]) {
      const tufo = parte(
        grupo,
        s * (0.26 + i * 0.045),
        0.82,
        0.2 - i * 0.16,
        0.12,
        0.35 + i * 0.05,
        0.12,
        luz,
        ponta
      );
      tufo.rotation.z = -s * 0.63;
    }
  cena.add(new T.HemisphereLight(0xfff1ff, 0x604882, 2));
  const sol = new T.DirectionalLight(0xffe3ff, 2);
  sol.position.set(3, 5, 4);
  cena.add(sol);
  const resize = () => {
    const w = canvas.clientWidth || 240,
      h = canvas.clientHeight || 220;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const obs = new ResizeObserver(resize);
  obs.observe(canvas);
  resize();
  let inicio = 0,
    quadro = 0;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
  function animar(ms: number) {
    quadro = requestAnimationFrame(animar);
    if (ms - inicio < 32 || document.hidden) return;
    inicio = ms;
    const t = reduzido.matches ? 0 : ms / 1000,
      m = acao(),
      passo = m === 'correr' ? 10 : m === 'andar' ? 6 : 0;
    grupo.position.y =
      m === 'saltar' || m === 'celebrar'
        ? Math.abs(Math.sin(t * 3)) * 0.3
        : m === 'dormir'
          ? -0.23
          : 0;
    grupo.rotation.z = m === 'dancar' ? Math.sin(t * 5) * .18 : 0;
    grupo.rotation.x = m === 'sentar' ? -0.25 : 0;
    cabeca.rotation.z = m === 'dormir' ? -0.35 : Math.sin(t * 1.3) * 0.05;
    patas.forEach(
      (p, i) =>
        (p.rotation.x = passo
          ? Math.sin(t * passo + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.55
          : m === 'dormir'
            ? 0.9
            : 0)
    );
    olhos.forEach((o) => (o.scale.y = m === 'dormir' || t % 4.5 > 4.32 ? 0.1 : 1));
    orelhas.forEach((o, i) => (o.rotation.x = Math.sin(t * 2 + i) * 0.08));
    cauda.rotation.z = Math.sin(t * 2) * 0.24;
    renderer.render(cena, camera);
  }
  quadro = requestAnimationFrame(animar);
  return () => {
    cancelAnimationFrame(quadro);
    obs.disconnect();
    geo.dispose();
    ponta.dispose();
    materiais.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
