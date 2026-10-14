"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makePetalGeometry } from "./petal";
import { bus } from "./bus";

const clamp = (x: number) => Math.min(1, Math.max(0, x));
// smootherstep: zero velocity and acceleration at both ends, so every move starts and stops softly
const seg = (t: number, a: number, b: number) => {
  const x = clamp((t - a) / (b - a));
  return x * x * x * (x * (6 * x - 15) + 10);
};
const lerp = THREE.MathUtils.lerp;

const GROUND = -2.5;
const FALL_SPAN = 0.11; // petals fall between t=.72 and .88 (the FAQ section)
const POD_START = 0.78;
const SERVICES = 5;
// ripple slots: 0-20 petals, 21-22 pod, 23-26 ambient, 27 stem, 28 bud, 29-36 pointer
const N_RIP = 40; // 37-39: extra rings around the new flower
const N_PTR = 8;
const LAYERS = [
  { n: 8, len: 1.7, w: 0.55, open: 1.3, off: 0 },
  { n: 7, len: 1.5, w: 0.5, open: 0.85, off: 0.4 },
  { n: 6, len: 1.25, w: 0.42, open: 0.42, off: 0.2 },
];
const BUD = [
  { n: 9, len: 1.75, w: 0.58, open: 1.25, off: 0 },
  { n: 8, len: 1.55, w: 0.52, open: 0.9, off: 0.35 },
  { n: 7, len: 1.3, w: 0.46, open: 0.58, off: 0.15 },
  { n: 5, len: 1.0, w: 0.38, open: 0.3, off: 0.4 },
];
const AMBIENT = [[-3.2, -1.2], [3.4, 0.4], [0.4, -3.4], [-1.4, 1.8]];

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pond: faint tinted surface, slow glints, light caustics near the light, thin bronze rings from every ripple source.
const waterVert = `varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const waterFrag = `varying vec3 vW;
uniform float uTime; uniform vec2 uLight; uniform float uGlow;
uniform vec4 uRip[${N_RIP}]; // x, z, progress 0..1, size (0 = off)
void main(){
  vec2 p = vW.xz;
  float ring = 0.0;
  for (int i = 0; i < ${N_RIP}; i++) {
    vec4 r = uRip[i];
    if (r.w > 0.0) {
      float d = length(p - r.xy);
      float w = 0.02 + 0.05 * r.z;
      ring += smoothstep(w, 0.0, abs(d - r.z * r.w)) * (1.0 - r.z) * (1.0 - r.z);
    }
  }
  float glint = smoothstep(0.93, 1.0, sin(p.x * 1.7 + uTime * 0.35) * sin(p.y * 1.3 - uTime * 0.28)) * 0.06;
  float cau = pow(max(0.0, sin(p.x * 2.3 + uTime * 0.5 + sin(p.y * 1.7 - uTime * 0.4) * 1.3) * sin(p.y * 2.1 - uTime * 0.35 + sin(p.x * 1.4 + uTime * 0.3) * 1.2)), 5.0);
  float lg = exp(-length(p - uLight) * 0.45) * uGlow;
  float fade = smoothstep(-24.0, -3.0, p.y);
  vec3 col = mix(vec3(0.86, 0.86, 0.88), vec3(0.69, 0.49, 0.34), clamp(ring, 0.0, 1.0));
  col = mix(col, vec3(1.0), clamp(cau * lg, 0.0, 1.0));
  gl_FragColor = vec4(col, clamp((0.34 + glint + ring * 0.55 + cau * lg * 0.2) * fade, 0.0, 1.0));
}`;

// Soft shaft of light that follows the flower, then the pond, then the new bud.
const beamVert = `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){ vUv = uv; vN = normalMatrix * normal; vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const beamFrag = `varying vec2 vUv; varying vec3 vN; varying vec3 vV; uniform float uOp;
void main(){
  float g = pow(vUv.y, 1.3);
  float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.2);
  gl_FragColor = vec4(0.95, 0.76, 0.54, g * e * uOp);
}`;

// Soft radial glow that sits behind a blooming flower.
const haloVert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const haloFrag = `varying vec2 vUv; uniform float uOp;
void main(){ float d = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(1.0, 0.83, 0.62, pow(clamp(1.0 - d, 0.0, 1.0), 2.2) * uOp); }`;

// Tiny dew-like specks of light that fall from the top of the screen, like confetti made of light.
const orbVert = `attribute float aSize; attribute float aHue; uniform float uPR; varying float vHue;
void main(){ vHue = aHue; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uPR * (10.0 / -mv.z); gl_Position = projectionMatrix * mv; }`;
const orbFrag = `uniform float uOp; varying float vHue;
void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard;
  float halo = pow(1.0 - d, 2.0) * 0.5;
  float core = smoothstep(0.28, 0.0, d);
  vec3 tint = mix(vec3(0.95, 0.76, 0.46), vec3(0.69, 0.49, 0.34), vHue);
  vec3 col = mix(tint, vec3(1.0, 0.98, 0.93), core);
  gl_FragColor = vec4(col, (halo + core * 0.5) * uOp); }`;
function makeOrbGeo(n: number) {
  const g = new THREE.BufferGeometry();
  const hue = new Float32Array(n);
  for (let i = 0; i < n; i++) hue[i] = (i * 0.381) % 1;
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(n), 1));
  g.setAttribute("aHue", new THREE.BufferAttribute(hue, 1));
  return g;
}
function rainDew(g: THREE.BufferGeometry, cx: number, time: number, width: number, scale: number) {
  const pos = g.attributes.position.array as Float32Array;
  const sz = g.attributes.aSize.array as Float32Array;
  const n = sz.length;
  for (let i = 0; i < n; i++) {
    const speed = 0.06 + (((i * 13) % 7) / 7) * 0.08;
    const life = (time * speed + ((i * 0.618) % 1)) % 1;
    const rx = ((i * 0.754877) % 1) - 0.5;
    pos[i * 3] = cx + rx * width + Math.sin(time * 0.7 + i) * 0.16 + Math.sin(time * 0.25) * 0.3 * life; // a soft gust
    pos[i * 3 + 1] = 5.0 - life * 7.4;
    pos[i * 3 + 2] = ((i * 37) % 10) / 10 * 3 - 0.8;
    const big = i % 9 === 0 ? 12 : 3.5 + (i % 4) * 2.2; // a few large, soft ones among many fine ones
    const env = Math.min(1, life * 6) * Math.min(1, (1 - life) * 3); // visible for almost the whole fall
    sz[i] = big * scale * env * (0.75 + 0.25 * Math.sin(time * 3 + i * 1.7)); // twinkle
  }
  g.attributes.position.needsUpdate = true;
  g.attributes.aSize.needsUpdate = true;
}

function Flower({ progress }: { progress: RefObject<{ v: number }> }) {
  const petalRefs = useRef<(THREE.Mesh | null)[]>([]);
  const budRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pod = useRef<THREE.Group>(null);
  const stem = useRef<THREE.Group>(null);
  const bud = useRef<THREE.Group>(null);
  const beams = useRef<(THREE.Mesh | null)[]>([]);
  const haloA = useRef<THREE.Mesh>(null);
  const haloB = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.PointLight>(null);

  const glow = useRef<THREE.PointLight>(null);
  const budLight = useRef<THREE.PointLight>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const smooth = useRef({ v: 0, init: false });
  const land = useRef<(number | null)[]>([]);
  const podLand = useRef<number | null>(null);
  const hl = useRef<number[]>([]);
  const ptr = useRef(Array.from({ length: N_PTR }, () => ({ x: 0, z: 0, t0: -99 })));
  const ptrState = useRef({ slot: 0, lx: 1e3, lz: 1e3 });

  const geos = useMemo(() => LAYERS.map((L) => makePetalGeometry(L.len, L.w)), []);
  const budGeos = useMemo(() => BUD.map((L) => makePetalGeometry(L.len, L.w)), []);
  const petals = useMemo(() => {
    const r = mulberry32(7);
    return LAYERS.flatMap((L, li) =>
      Array.from({ length: L.n }, (_, i) => ({
        li,
        az: (i / L.n) * Math.PI * 2 + L.off + (r() - 0.5) * 0.15,
        open: L.open * (0.9 + r() * 0.2),
        start: 0.72 + r() * 0.05,
        gx: (r() - 0.5) * 5,
        gz: (r() - 0.5) * 2.4 + 0.4,
        yaw: r() * Math.PI * 2,
        ph: r() * Math.PI * 2,
        jit: (r() - 0.5) * 0.3,
      })),
    );
  }, []);
  const budPetals = useMemo(
    () => BUD.flatMap((L, li) => Array.from({ length: L.n }, (_, i) => ({ li, az: (i / L.n) * Math.PI * 2 + L.off, open: L.open, d: li * 0.1 + (i / L.n) * 0.1 }))),
    [],
  );
  const push = useMemo(() => new Float32Array(petals.length * 2), [petals]);
  const stemGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(0.15, -1.7, 0), new THREE.Vector3(-0.2, -3.7, 0),
      new THREE.Vector3(0.1, -6.2, 0), new THREE.Vector3(0, -9.7, 0),
    ]);
    return new THREE.TubeGeometry(curve, 80, 0.07, 8, false);
  }, []);
  const stamens = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ a: (i / 18) * Math.PI * 2, h: 0.35 + (i % 3) * 0.06 })), []);
  const sparkGeo = useMemo(() => makeOrbGeo(90), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uGlow: { value: 0.3 },
    uLight: { value: new THREE.Vector2() },
    uRip: { value: Array.from({ length: N_RIP }, () => new THREE.Vector4(0, 0, 1, 0)) },
  }), []);
  const beamUniforms = useMemo(() => [0, 1, 2].map(() => ({ uOp: { value: 0.1 } })), []);
  const haloUA = useMemo(() => ({ uOp: { value: 0 } }), []);
  const haloUB = useMemo(() => ({ uOp: { value: 0 } }), []);
  const sparkGeo2 = useMemo(() => makeOrbGeo(220), []);
  const orbUA = useMemo(() => ({ uOp: { value: 0 }, uPR: { value: 1 } }), []);
  const orbUB = useMemo(() => ({ uOp: { value: 0 }, uPR: { value: 1 } }), []);

  const T = useMemo(() => ({
    q: new THREE.Quaternion(), qa: new THREE.Quaternion(), qb: new THREE.Quaternion(),
    home: new THREE.Quaternion(), qm: new THREE.Quaternion(), flat: new THREE.Quaternion(), w: new THREE.Quaternion(),
    e: new THREE.Euler(0, 0, 0, "YXZ"), pos: new THREE.Vector3(), hit: new THREE.Vector3(), tgt: new THREE.Vector3(),
    v2: new THREE.Vector2(), plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -GROUND),
    X: new THREE.Vector3(1, 0, 0), Y: new THREE.Vector3(0, 1, 0),
    cA: new THREE.Color("#ffffff"), cB: new THREE.Color("#ffffff"),
  }), []);

  useFrame((s, dt) => {
    // Extra inertia on top of the scroll scrub: the flower glides toward where the scroll says it should be.
    const target = progress.current?.v ?? 0;
    const sm = smooth.current;
    if (!sm.init) { sm.v = target; sm.init = true; }
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 2.6);
    sm.v += (target - sm.v) * k;
    const t = sm.v;
    const time = s.clock.elapsedTime;
    const vw = s.viewport.width;
    const narrow = vw < 7;
    const xr = narrow ? 0 : -vw * 0.2; // RTL: text on the right, flower on the left
    const sc = (narrow ? 0.7 : 1) * 1.12; // overall flower size

    const pull = seg(t, 0.03, 0.09);
    const drop = seg(t, 0.07, 0.21);
    const left = seg(t, 0.25, 0.37);
    const back = seg(t, 0.41, 0.53);
    const mid = seg(t, 0.55, 0.65);
    const end = seg(t, 0.65, 0.72);
    const ctr = seg(t, 0.62, 0.72);
    const bloom = seg(t, 0.02, 0.2);
    const rise = seg(t, 0.88, 0.95);
    const open2 = seg(t, 0.93, 1);
    const so = seg(t, 0.72, 0.78) * (1 - seg(t, 0.86, 0.9));
    const budY = lerp(GROUND - 1.4, GROUND + 0.85, rise);

    const x = lerp(lerp(lerp(lerp(xr, -xr, left), xr, back), 0, mid), xr, end);
    const bob = Math.sin(time * 1.1) * 0.06 * drop + Math.sin(t * 14) * 0.18 * drop * (1 - ctr);
    const y = -0.3 + 0.35 * pull - 0.85 * drop + 1.2 * ctr + bob;
    T.pos.set(x, y, 0.5);

    T.e.set(0.1 + 0.55 * drop + 0.1 * ctr, t * Math.PI * 1.2 + time * 0.08,
      Math.sin(time * 0.7) * 0.04 + 0.05 * Math.sin(time * 0.9) * (1 - drop));
    T.q.setFromEuler(T.e);

    const rip = uniforms.uRip.value;
    uniforms.uTime.value = time;

    // ---------- lighting: warm morning -> golden dusk while the petals fall -> a clean glow for the new bud
    const dusk = seg(t, 0.45, 0.8);
    if (keyLight.current) {
      keyLight.current.color.copy(T.cA).lerp(T.cB, dusk);
      keyLight.current.intensity = 1.5 + 0.1 * dusk;
      keyLight.current.position.set(3 + dusk * 1.5, 6 - dusk * 1.5, 5);
    }
    if (rimLight.current) rimLight.current.intensity = 0.35;
    if (hemi.current) hemi.current.intensity = 0.95 - 0.08 * dusk;
    if (glow.current) {
      glow.current.position.set(x, y + 1.2, 3);
      glow.current.intensity = 0;
    }

    // light shaft + caustics target: flower -> pond where the petals land -> the bud
    const toPond = seg(t, 0.72, 0.8);
    const toBud = seg(t, 0.9, 0.96);
    T.tgt.set(lerp(lerp(x, xr, toPond), 0, toBud), lerp(lerp(y, GROUND + 0.3, toPond), GROUND + 0.3, toBud), 0.3);
    [-0.35, -0.17, -0.55].forEach((a0, j) => {
      const m = beams.current[j];
      if (!m) return;
      const a = a0 + Math.sin(time * 0.3 + j * 2) * 0.05;
      m.rotation.z = a;
      m.position.set(T.tgt.x - Math.sin(a) * 4.5, T.tgt.y + Math.cos(a) * 4.5, 0.2);
      beamUniforms[j].uOp.value = (j === 0 ? 1 : 0.5) * (0.012 + 0.004 * Math.sin(time * 0.4 + j));
    });
    uniforms.uLight.value.set(T.tgt.x, T.tgt.z + 0.4);
    uniforms.uGlow.value = 0.1 + 0.2 * toPond + 0.05 * toBud;

    // ---------- seed pod: the last thing to let go, it settles on the water too
    const pf = clamp((t - POD_START) / 0.1);
    const pe = seg(pf, 0, 1);
    if (pod.current) {
      pod.current.position.set(
        lerp(T.pos.x, xr + 0.35, pe) + Math.sin(pf * 5) * 0.12 * Math.sin(Math.PI * pf),
        lerp(T.pos.y, GROUND - 0.02, pe) + Math.sin(time * 1.2) * 0.012 * pe,
        lerp(T.pos.z, 0.9, pe),
      );
      T.e.set(0.35, 0, 0.25);
      T.flat.setFromEuler(T.e);
      T.qm.copy(T.q).slerp(T.flat, pe);
      T.e.set(Math.sin(time * 0.8) * 0.03 * pe, 0, Math.sin(time * 0.6) * 0.04 * pe + Math.sin(pf * 6) * 0.2 * Math.sin(Math.PI * pf));
      T.w.setFromEuler(T.e);
      pod.current.quaternion.copy(T.qm).multiply(T.w);
      pod.current.scale.setScalar(sc);
    }
    if (pf >= 0.98) { if (podLand.current === null) podLand.current = time; } else podLand.current = null;
    const pk = podLand.current === null ? 1 : (time - podLand.current) / 3;
    rip[21].set(xr + 0.35, 0.9, Math.min(1, pk), pk < 1 ? 1.9 : 0);
    const pk2 = podLand.current === null ? 1 : (time - podLand.current - 0.6) / 3;
    rip[22].set(xr + 0.35, 0.9, Math.min(1, Math.max(0, pk2)), pk2 < 1 && pk2 > 0 ? 1.3 : 0);

    // ---------- stem and its ring where it meets the water
    if (stem.current) {
      stem.current.position.set(xr - 0.6 * drop, -0.3 + Math.pow(Math.max(0, t - 0.08), 2) * 130, lerp(0.5, -0.3, drop));
      stem.current.rotation.z = Math.sin(time * 0.8) * 0.02 + 0.15 * drop;
    }
    rip[27].set(xr, 0.5, (time * 0.22) % 1, 0.9 * (1 - seg(t, 0.06, 0.12)));
    AMBIENT.forEach((a, j) => rip[23 + j].set(a[0], a[1], (time * 0.08 + j * 0.27) % 1, 1.6));

    // ---------- rebirth: a new bud rises out of the pond and opens
    if (bud.current) {
      bud.current.visible = rise > 0.001;
      bud.current.position.set(0, budY + Math.sin(time * 1.1) * 0.015 * rise, 0.6);
      bud.current.scale.setScalar(sc * (0.55 + 0.63 * rise));
      bud.current.rotation.y = time * 0.1;
    }
    budPetals.forEach((p, i) => {
      const m = budRefs.current[i];
      if (!m) return;
      T.qa.setFromAxisAngle(T.Y, p.az);
      // outer petals unfurl first, each with a soft overshoot, then the flower breathes
      const lx = seg(clamp((t - 0.92) / 0.08), p.d, p.d + 0.6) - 1;
      const eb = 1 + 2.1 * lx * lx * lx + 1.1 * lx * lx;
      T.qb.setFromAxisAngle(T.X, p.open * (0.28 + 0.72 * eb) + 0.025 * Math.sin(time * 1.2 + p.az) * open2);
      m.quaternion.copy(T.qa).multiply(T.qb);
      (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.02 + 0.03 * open2;
    });
    if (budLight.current) {
      budLight.current.intensity = 0;
      budLight.current.color.setHSL(0.08 + 0.02 * open2, 0.9, 0.78);
    }

    // living light: an orbiting warm light that rakes across the petals while a flower opens
    if (orbit.current) {
      const cx = lerp(x, 0, toBud), cy = lerp(y + 0.8, budY + 0.9, toBud), ang = time * 0.9;
      orbit.current.position.set(cx + Math.cos(ang) * 2.4, cy + 1.0, 1.8 + Math.sin(ang) * 1.4);
      orbit.current.intensity = 0;
    }
    // soft halos behind each blooming flower
    if (haloA.current) {
      haloA.current.position.set(x, y + 0.9, -0.2);
      haloUA.uOp.value = 0;
    }
    if (haloB.current) {
      haloB.current.position.set(0, budY + 1.0, 0);
      haloB.current.scale.setScalar(0.6 + 0.4 * rise);
      haloUB.uOp.value = 0;
    }
    // ...and again when the new flower opens
    orbUB.uOp.value = 1 * seg(t, 0.9, 0.95);
    if (orbUB.uOp.value > 0.001) rainDew(sparkGeo2, 0, time, vw * 0.95, 1.4);
    rip[28].set(0, 0.6, (time * 0.3) % 1, 1.2 * rise);
    for (let j = 0; j < 3; j++) rip[37 + j].set(0, 0.6, (time * 0.22 + j * 0.33) % 1, (1.6 + j * 0.8) * rise);

    // ---------- dew falls across the screen while the hero flower opens
    orbUA.uPR.value = orbUB.uPR.value = s.viewport.dpr;
    orbUA.uOp.value = 0.9 * seg(t, 0.02, 0.09) * (1 - seg(t, 0.16, 0.22));
    if (orbUA.uOp.value > 0.001) rainDew(sparkGeo, 0, time, vw * 0.9, 1);

    // ---------- pointer on the water: thin ripples, and floating petals drift away from it
    const ps = ptrState.current;
    const active = performance.now() - bus.last < 1800;
    let hitOk = false;
    if (active) {
      s.raycaster.setFromCamera(T.v2.set(bus.nx, bus.ny), s.camera);
      hitOk = !!s.raycaster.ray.intersectPlane(T.plane, T.hit) && Math.abs(T.hit.x) < 14 && T.hit.z > -8 && T.hit.z < 9;
    }
    if (hitOk && Math.hypot(T.hit.x - ps.lx, T.hit.z - ps.lz) > 0.45) {
      ps.slot = (ps.slot + 1) % N_PTR;
      ptr.current[ps.slot] = { x: T.hit.x, z: T.hit.z, t0: time };
      ps.lx = T.hit.x; ps.lz = T.hit.z;
    }
    ptr.current.forEach((q, j) => {
      const kk = (time - q.t0) / 1.8;
      rip[29 + j].set(q.x, q.z, Math.min(1, kk), kk >= 0 && kk < 1 ? 0.7 : 0);
    });

    // ---------- petals: bloom, light up for the hovered service, then drift down and float on the water
    const dk = 1 - Math.exp(-Math.min(dt, 0.1) * 3);
    petals.forEach((p, i) => {
      const m = petalRefs.current[i];
      if (!m) return;
      const h = (hl.current[i] ?? 0) + ((bus.focus === i % SERVICES ? 1 : 0) - (hl.current[i] ?? 0)) * k;
      hl.current[i] = h;
      (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.02 + h * 0.3;

      const tilt = p.open * lerp(0.27, 1, bloom) + Math.sin(time * 1.3 + p.ph) * 0.02 + h * 0.14;
      T.qa.setFromAxisAngle(T.Y, p.az);
      T.qb.setFromAxisAngle(T.X, tilt);
      T.home.copy(T.q).multiply(T.qa).multiply(T.qb);

      const f = clamp((t - p.start) / FALL_SPAN);
      if (f <= 0) {
        m.position.copy(T.pos);
        m.quaternion.copy(T.home);
      } else {
        const flutter = Math.sin(Math.PI * f);
        const landed = seg(f, 0.9, 1);
        const fy = seg(f, 0, 1);
        const fxz = seg(f, 0, 0.92);
        let tx = 0, tz = 0;
        if (hitOk && landed > 0) {
          const dx = m.position.x - T.hit.x, dz = m.position.z - T.hit.z;
          const d = Math.hypot(dx, dz) || 1;
          const pw = Math.pow(clamp(1 - d / 1.3), 2) * 0.5;
          tx = (dx / d) * pw; tz = (dz / d) * pw;
        }
        push[i * 2] += (tx - push[i * 2]) * dk;
        push[i * 2 + 1] += (tz - push[i * 2 + 1]) * dk;
        m.position.set(
          lerp(T.pos.x, p.gx, fxz) + Math.sin(f * 7 + p.ph) * 0.4 * flutter + Math.sin(time * 0.5 + p.ph) * 0.08 * landed + push[i * 2],
          lerp(T.pos.y, GROUND + 0.02, fy) + Math.sin(time * 1.2 + p.ph) * 0.008 * landed,
          lerp(T.pos.z, p.gz, fxz) + Math.cos(f * 5 + p.ph) * 0.28 * flutter + Math.cos(time * 0.4 + p.ph) * 0.06 * landed + push[i * 2 + 1],
        );
        T.e.set(Math.PI / 2 - p.jit, p.yaw, 0);
        T.flat.setFromEuler(T.e);
        T.qm.copy(T.home).slerp(T.flat, seg(f, 0, 0.85));
        T.e.set(Math.sin(f * 9 + p.ph) * 0.55 * flutter + Math.sin(time * 0.7 + p.ph) * 0.03 * landed, 0,
          Math.cos(f * 6 + p.ph) * 0.55 * flutter + Math.cos(time * 0.6 + p.ph) * 0.03 * landed);
        T.w.setFromEuler(T.e);
        m.quaternion.copy(T.qm).multiply(T.w);
      }
      m.scale.setScalar(sc);

      // ring starts when the petal touches the water, then plays out in real time
      if (f >= 0.98) { if (land.current[i] == null) land.current[i] = time; } else land.current[i] = null;
      const lt = land.current[i];
      const kk = lt == null ? 1 : (time - lt) / 2.6;
      rip[i].set(m.position.x, m.position.z, Math.min(1, kk), kk < 1 ? 1.1 : 0);
    });
  });

  const petalMat = <meshPhysicalMaterial vertexColors side={THREE.DoubleSide} roughness={0.5} sheen={0.5} sheenColor="#ffffff" sheenRoughness={0.5} emissive="#b17d56" emissiveIntensity={0.02} />;

  return (
    <>
      <hemisphereLight ref={hemi} args={["#ffffff", "#d9d9de", 0.95]} />
      <directionalLight ref={keyLight} position={[3, 6, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight ref={rimLight} position={[-4, 3, -4]} intensity={1.2} color="#ffffff" />
      <pointLight ref={glow} color="#e0b896" intensity={25} distance={14} />
      <pointLight ref={budLight} color="#ffd9b0" intensity={0} distance={8} position={[0, GROUND + 1.2, 2]} />

      <group ref={stem}>
        <mesh geometry={stemGeo}><meshStandardMaterial color="#3a2f28" roughness={0.7} /></mesh>
      </group>

      <group ref={pod}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.28, 0.14, 0.22, 24]} />
          <meshStandardMaterial color="#4a3526" roughness={0.6} />
        </mesh>
        {stamens.map((s, i) => (
          <mesh key={i} position={[Math.cos(s.a) * 0.24, 0.25 + s.h / 2, Math.sin(s.a) * 0.24]}>
            <cylinderGeometry args={[0.012, 0.012, s.h, 5]} />
            <meshStandardMaterial color="#b17d56" emissive="#b17d56" emissiveIntensity={0.25} />
          </mesh>
        ))}
      </group>

      {petals.map((p, i) => (
        <mesh key={i} ref={(el) => { petalRefs.current[i] = el; }} geometry={geos[p.li]}>{petalMat}</mesh>
      ))}

      <group ref={bud} visible={false}>
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 1.6, 8]} />
          <meshStandardMaterial color="#3a2f28" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.16, 18, 14]} />
          <meshStandardMaterial color="#b17d56" emissive="#e0a060" emissiveIntensity={0.1} />
        </mesh>
        <group scale={0.7} position={[0, 0.05, 0]}>
          {stamens.map((s, i) => (
            <mesh key={i} position={[Math.cos(s.a) * 0.24, 0.1 + s.h / 2, Math.sin(s.a) * 0.24]}>
              <cylinderGeometry args={[0.012, 0.012, s.h, 5]} />
              <meshStandardMaterial color="#e0b070" emissive="#e0a060" emissiveIntensity={0.08} />
            </mesh>
          ))}
        </group>
        {budPetals.map((p, i) => (
          <mesh key={i} ref={(el) => { budRefs.current[i] = el; }} geometry={budGeos[p.li]}>{petalMat}</mesh>
        ))}
      </group>

      <mesh rotation-x={-Math.PI / 2} position-y={GROUND} renderOrder={-1}>
        <planeGeometry args={[60, 60]} />
        <shaderMaterial uniforms={uniforms} vertexShader={waterVert} fragmentShader={waterFrag} transparent depthWrite={false} />
      </mesh>

      {[0, 1, 2].map((j) => (
        <mesh key={j} ref={(el) => { beams.current[j] = el; }} scale={[[1, 0.55, 0.8][j], 1, [1, 0.55, 0.8][j]]} renderOrder={-2} visible={false}>
          <cylinderGeometry args={[0.4, 3.2, 9, 32, 1, true]} />
          <shaderMaterial uniforms={beamUniforms[j]} vertexShader={beamVert} fragmentShader={beamFrag} transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <mesh ref={haloA} renderOrder={-1} visible={false}>
        <circleGeometry args={[2.8, 48]} />
        <shaderMaterial uniforms={haloUA} vertexShader={haloVert} fragmentShader={haloFrag} transparent depthWrite={false} />
      </mesh>
      <mesh ref={haloB} renderOrder={-1} visible={false}>
        <circleGeometry args={[3.4, 48]} />
        <shaderMaterial uniforms={haloUB} vertexShader={haloVert} fragmentShader={haloFrag} transparent depthWrite={false} />
      </mesh>

      <points geometry={sparkGeo2} frustumCulled={false}>
        <shaderMaterial uniforms={orbUB} vertexShader={orbVert} fragmentShader={orbFrag} transparent depthWrite={false} />
      </points>
      <pointLight ref={orbit} color="#ffc48a" intensity={0} distance={9} />

      <points geometry={sparkGeo} frustumCulled={false}>
        <shaderMaterial uniforms={orbUA} vertexShader={orbVert} fragmentShader={orbFrag} transparent depthWrite={false} />
      </points>
    </>
  );
}

export default function LotusScene({ progress }: { progress: RefObject<{ v: number }> }) {
  return (
    <Canvas camera={{ position: [0, 1.2, 10], fov: 38 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}
      onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}>
      <Flower progress={progress} />
    </Canvas>
  );
}
