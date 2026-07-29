export interface SigilData {
  points: number;
  vertices: { x: number; y: number }[];
  connections: [number, number][];
  innerRadius: number;
  outerRadius: number;
  symbolType: number; // 0-5 enum
  seed: number;
}

export interface MythosData {
  name: string;
  archetype: string;
  archetypeDescription: string;
  origin: string;
  current: string;
  prophecy: string;
  sigil: SigilData;
}

export interface StoredMythos {
  mythos: MythosData;
  answers: string[];
}
