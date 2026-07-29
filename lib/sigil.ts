import type { SigilData } from "./types";

const CENTER = { x: 100, y: 100 };

export function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSigilData(answers: string[]): SigilData {
  const seed = hashString(answers.join("|"));
  const rng = mulberry32(seed);

  const points = 5 + Math.floor(rng() * 8); // 5–12 vertices
  const outerRadius = 70 + rng() * 30; // 70–100
  const innerRadius = outerRadius * (0.25 + rng() * 0.45);

  const vertices: { x: number; y: number }[] = [];
  for (let i = 0; i < points; i++) {
    const angle = i * ((Math.PI * 2) / points) - Math.PI / 2;
    // varying radius gives organic, asymmetric energy while keeping structure
    const radius = outerRadius * (0.65 + rng() * 0.35);
    vertices.push({
      x: CENTER.x + Math.cos(angle) * radius,
      y: CENTER.y + Math.sin(angle) * radius,
    });
  }

  // star-polygon connection skip
  const maxSkip = Math.max(2, points - 2);
  const skip = 2 + Math.floor(rng() * (maxSkip - 1));
  const connectionSet = new Set<string>();
  const connections: [number, number][] = [];

  for (let i = 0; i < points; i++) {
    const j = (i + skip) % points;
    const a = Math.min(i, j);
    const b = Math.max(i, j);
    const key = `${a},${b}`;
    if (!connectionSet.has(key)) {
      connectionSet.add(key);
      connections.push([a, b]);
    }
  }

  const symbolType = Math.floor(rng() * 6); // 0–5

  return {
    points,
    vertices,
    connections,
    innerRadius,
    outerRadius,
    symbolType,
    seed,
  };
}
