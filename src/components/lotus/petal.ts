import * as THREE from "three";

/** One cupped, pointed petal. Base at origin, grows along +Y, cup opens toward +Z. */
export function makePetalGeometry(length: number, width: number) {
  const g = new THREE.PlaneGeometry(1, 1, 8, 18);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const base = new THREE.Color("#ffe3e3");
  const mid = new THREE.Color("#cf767b");
  const tip = new THREE.Color("#c51d27");
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2; // -1..1
    const v = pos.getY(i) + 0.5; // 0..1
    const profile = Math.max(Math.pow(Math.sin(Math.PI * Math.pow(v, 0.8)), 0.75), 0.14 * (1 - v));
    const x = u * width * profile;
    const y = v * length;
    const z = -0.35 * width * u * u * profile - 0.3 * length * v * v; // cup + tip curl
    pos.setXYZ(i, x, y, z);

    if (v < 0.5) c.copy(base).lerp(mid, v * 2);
    else c.copy(mid).lerp(tip, (v - 0.5) * 2);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
