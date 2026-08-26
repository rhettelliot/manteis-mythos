"use client";

export type Phase = "gate" | "questions" | "generating" | "mythos";

export const QUESTIONS: string[] = [
  "What is the earliest memory that shaped you?",
  "What do you fear most about yourself?",
  "What do you love most fiercely?",
  "What would you die for?",
  "What pattern keeps repeating in your life?",
  "If you could speak to your 10-year-old self, what would you say?",
  "What is the question you are afraid to answer?",
];

export interface MythosData {
  name: string;
  sigilSvg: string;
  chapters: { title: string; body: string }[];
  archetype: { name: string; description: string };
}

export interface SavedMythos {
  seed: number;
  answers: string[];
  mythos: MythosData;
}

const STORAGE_KEY = "manteis.mythos.v1";

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function answersToSeed(answers: string[]): number {
  const joined = answers.map((a) => a.trim()).join("\u0001");
  return hashString(joined);
}

export function compressAnswers(answers: string[]): string {
  const payload = JSON.stringify(answers.map((a) => a.trim()));
  if (typeof window === "undefined") return "";
  try {
    return window.btoa(encodeURIComponent(payload));
  } catch {
    return "";
  }
}

export function decompressAnswers(compressed: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const payload = decodeURIComponent(window.atob(compressed));
    const parsed = JSON.parse(payload);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveMythos(seed: number, answers: string[], mythos: MythosData): void {
  if (typeof window === "undefined") return;
  try {
    const payload: SavedMythos = { seed, answers, mythos };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota or privacy errors
  }
}

export function loadMythos(): SavedMythos | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isSavedMythos(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isSavedMythos(value: unknown): value is SavedMythos {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.seed !== "number" || !Array.isArray(v.answers)) return false;
  if (typeof v.mythos !== "object" || v.mythos === null) return false;
  const m = v.mythos as Record<string, unknown>;
  if (typeof m.name !== "string" || typeof m.sigilSvg !== "string") return false;
  if (!Array.isArray(m.chapters) || typeof m.archetype !== "object" || m.archetype === null) return false;
  const a = m.archetype as Record<string, unknown>;
  return typeof a.name === "string" && typeof a.description === "string";
}

export function clearSavedMythos(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

const STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day",
  "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "who", "boy", "did", "she",
  "use", "her", "way", "many", "oil", "sit", "set", "run", "eat", "far", "sea", "eye", "ago", "off", "too", "any",
  "say", "man", "try", "ask", "end", "why", "let", "put", "say", "she", "try", "way", "own", "say", "too", "old",
  "tell", "very", "when", "come", "here", "just", "like", "long", "make", "over", "such", "take", "than", "them",
  "well", "were", "what", "with", "have", "from", "they", "know", "want", "been", "good", "much", "some", "time",
  "would", "there", "their", "said", "each", "which", "will", "about", "could", "other", "after", "first", "never",
  "these", "think", "where", "being", "every", "great", "might", "shall", "still", "those", "while", "this", "that",
  "your", "into", "upon", "more", "only", "back", "also", "before", "should", "really", "always", "something",
  "someone", "nothing", "everything", "because", "though", "through", "during", "between", "under", "over",
  "again", "further", "then", "once", "dont", "didnt", "wasnt", "werent", "isnt", "arent", "wont", "cant",
]);

function pickWord(answers: string[], rng: () => number): string {
  const all = answers.flatMap(extractWords);
  if (all.length === 0) {
    const fallback = ["ember", "threshold", "needle", "origin", "rift", "mirror", "ash", "flare", "vein", "silence"];
    return fallback[Math.floor(rng() * fallback.length)] ?? "ember";
  }
  return all[Math.floor(rng() * all.length)] ?? all[0] ?? "ember";
}

function pickClean(answers: string[], rng: () => number): string {
  const word = pickWord(answers, rng);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function seedName(answers: string[], rng: () => number): string {
  const fragments: string[] = [];
  // try to get a descriptor from Q3 (love)
  const loveWords = extractWords(answers[2] ?? "");
  if (loveWords.length) {
    fragments.push(loveWords[Math.floor(rng() * loveWords.length)] ?? "");
  }
  // noun from Q1 (memory)
  const memoryWords = extractWords(answers[0] ?? "");
  if (memoryWords.length) {
    fragments.push(memoryWords[Math.floor(rng() * memoryWords.length)] ?? "");
  }
  // fallback word
  if (fragments.filter(Boolean).length < 2) {
    const pool = ["ember", "needle", "mirror", "rift", "ash", "flare", "vein", "silence", "threshold", "origin"];
    fragments.push(pool[Math.floor(rng() * pool.length)] ?? "ember");
  }

  const suffixes = [
    "of the Refiner's Fire",
    "Who Walks the Threshold",
    "the Unbroken",
    "Against the Darkening",
    "Beneath the Signal",
    "the Memory-Keeper",
    "in the Last Light",
    "of the Hollow Crown",
    "Without a Name",
    "the Pattern-Breaker",
    "at the Edge of the Known",
    "the Still Point",
  ];
  const suffix = suffixes[Math.floor(rng() * suffixes.length)] ?? suffixes[0];

  const clean = fragments
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => sentenceCase(w));
  if (suffix?.startsWith("of") || suffix?.startsWith("in") || suffix?.startsWith("at") || suffix?.startsWith("Beneath") || suffix?.startsWith("Against") || suffix?.startsWith("Without")) {
    return `${clean.slice(0, 1).join(" ")} ${suffix}`;
  }
  return `${clean.slice(0, 2).join(" ")} ${suffix}`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function generateSigilSvg(seed: number): string {
  const rng = mulberry32(seed + 0x9e3779b9);
  const sides = 3 + Math.floor(rng() * 6); // 3-8
  const outerR = 180;
  const innerR = 70 + rng() * 70;
  const midR = 120 + rng() * 40;
  const cx = 200;
  const cy = 200;

  const pts = (radius: number, count: number, rotation: number) => {
    const arr: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rotation;
      arr.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
    return arr;
  };

  const outer = pts(outerR, sides, -Math.PI / 2);
  const inner = pts(innerR, sides, -Math.PI / 2 + (rng() > 0.5 ? 0 : Math.PI / sides));
  const mid = pts(midR, sides, -Math.PI / 2);

  const polygon = (p: [number, number][]) => "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";

  const spokeCount = 2 * sides;
  const spokePts = pts(outerR - 10, spokeCount, -Math.PI / 2 + Math.PI / spokeCount);
  const spokes = spokePts
    .map(([x, y]) => `M ${cx.toFixed(1)} ${cy.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const circles = [90, 140, 170]
    .filter(() => rng() > 0.25)
    .map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FF5500" stroke-width="${rng() > 0.5 ? 1.2 : 0.8}" />`)
    .join("");

  const glyphCount = clamp(3 + Math.floor(rng() * 6), 3, 10);
  const glyphs = outer
    .slice(0, glyphCount)
    .map(([x, y], i) => {
      const r = 4 + rng() * 6;
      const rot = (i / glyphCount) * 360;
      return `<rect x="${x - r / 2}" y="${y - r / 2}" width="${r}" height="${r}" fill="none" stroke="#FF4D00" stroke-width="1" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" />`;
    })
    .join("");

  const crossCount = clamp(2 + Math.floor(rng() * 5), 2, 8);
  const crosses = inner
    .slice(0, crossCount)
    .map(([x, y], i) => {
      const len = 12 + rng() * 10;
      const angle = (i / crossCount) * Math.PI + Math.PI / 2;
      const x1 = x + Math.cos(angle) * len;
      const y1 = y + Math.sin(angle) * len;
      const x2 = x - Math.cos(angle) * len;
      const y2 = y - Math.sin(angle) * len;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#FF5500" stroke-width="1.5" />`;
    })
    .join("");

  const centerGlyph = rng() > 0.5 ? `<circle cx="${cx}" cy="${cy}" r="${16 + rng() * 16}" fill="none" stroke="#FF4D00" stroke-width="2" />` : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" class="sigil-svg" role="img" aria-label="Personal sigil">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${polygon(outer)}" stroke="#FF4D00" stroke-width="2" />
    <path d="${polygon(mid)}" stroke="#FF4D00" stroke-width="1.2" />
    <path d="${polygon(inner)}" stroke="#FF5500" stroke-width="1.8" />
    <path d="${spokes}" stroke="#FF5500" stroke-width="0.9" />
    ${circles}
    ${glyphs}
    ${crosses}
    ${centerGlyph}
  </g>
</svg>`;
}

const ORIGIN_TEMPLATES = [
  "Before the pattern, there was the impulse. Your story begins not with your birth, but with the first time you chose differently than expected — with {memory}. That moment taught your body that memory is not past; it is the architecture of will.",
  "The first chapter was written in the body before the mind could read it. {memory} became the root. From it grew every room you have lived inside, every door you still hesitate to open.",
  "You did not begin in the place where records are kept. You began where sensation outpaced language: {memory}. The child you were is still there, holding the message you later returned to deliver: {message}.",
  "Origin is not a date. It is a frequency. The earliest chord that shaped you sounded like this: {memory}. Since then you have been tuning every decision toward the voice that once told the child: {message}",
];

const CURRENT_TEMPLATES = [
  "You are in the chapter of the Refiner's Fire. Everything that is not essential is being burned away. Your fear — {fear} — is not an obstacle; it is the fuel. The pattern that repeats, {pattern}, is the kiln. This is not destruction — this is revelation.",
  "The pattern you keep repeating — {pattern} — is not a flaw in the machine. It is the machine. It has been running on one question: what if {fear} becomes real? You are learning that the question itself is the guardian.",
  "At the center of your current chapter stands a single mirror. It shows not what you have done, but what you have refused to feel: {fear}. The pattern you trace, {pattern}, is the shape of that refusal. To break it, you must first look long enough to be seen.",
  "This chapter is called The Work. The repeating pattern, {pattern}, is the raw material. The fear, {fear}, is the chisel. Each turn of the wheel removes a little more of what you were never meant to carry.",
];

const PROPHECY_TEMPLATES = [
  "The pattern you have been repeating is about to break. Not because you will finally solve it, but because you will finally outgrow it. You have already proved what you would lay down: {sacrifice}. Now the question you are afraid to answer — {afraid} — becomes the threshold you walk through.",
  "Ahead lies a crossing where the cost is counted. You have known the price since you first said: {sacrifice}. The prophecy is not that you will avoid it; it is that you will meet it awake, carrying the question {afraid} like a lantern instead of a chain.",
  "What you would die for — {sacrifice} — is not a static truth. It is a direction. The prophecy says you will keep moving toward it until the question you fear, {afraid}, no longer paralyzes you. Then the real journey begins.",
  "The future does not need you to be fearless. It needs you to be precise. {sacrifice} will be the compass. {afraid} will be the door. Walk through not because you have the answer, but because staying is the only impossible choice.",
];

function formatFragment(fragment: string, fallback: string): string {
  const trimmed = fragment.trim();
  if (!trimmed) return fallback;
  if (/[.!?]$/.test(trimmed)) return trimmed.slice(0, -1);
  return trimmed;
}

function firstNWords(text: string, n: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "—";
  if (words.length <= n) return text.trim();
  return words.slice(0, n).join(" ");
}

function seedChapters(answers: string[], rng: () => number): { title: string; body: string }[] {
  const memory = formatFragment(firstNWords(answers[0] ?? "", 8), "the first light in an unknown room");
  const message = formatFragment(firstNWords(answers[5] ?? "", 12), "be exactly as strange as you are");
  const fear = formatFragment(firstNWords(answers[1] ?? "", 6), "the shadow you cannot name");
  const pattern = formatFragment(firstNWords(answers[4] ?? "", 7), "the loop that always returns to the same door");
  const sacrifice = formatFragment(firstNWords(answers[3] ?? "", 6), "what cannot be negotiated");
  const afraid = formatFragment(firstNWords(answers[6] ?? "", 8), "the question behind every question");

  const originTpl = ORIGIN_TEMPLATES[Math.floor(rng() * ORIGIN_TEMPLATES.length)] ?? ORIGIN_TEMPLATES[0];
  const currentTpl = CURRENT_TEMPLATES[Math.floor(rng() * CURRENT_TEMPLATES.length)] ?? CURRENT_TEMPLATES[0];
  const prophecyTpl = PROPHECY_TEMPLATES[Math.floor(rng() * PROPHECY_TEMPLATES.length)] ?? PROPHECY_TEMPLATES[0];

  return [
    { title: "CH.01 / ORIGIN", body: originTpl.replace("{memory}", memory).replace("{message}", message) },
    { title: "CH.02 / CURRENT CHAPTER", body: currentTpl.replace("{fear}", fear).replace("{pattern}", pattern) },
    { title: "CH.03 / PROPHECY", body: prophecyTpl.replace("{sacrifice}", sacrifice).replace("{afraid}", afraid) },
  ];
}

const ARCHETYPES = [
  { name: "The Threshold Walker", description: "You do not belong on either side of the door; you are the door itself." },
  { name: "The Refiner", description: "You convert pressure into clarity, and loss into a sharper edge." },
  { name: "The Unbroken", description: "Not unscathed — simply still standing, with the fractures lit from within." },
  { name: "The Memory-Keeper", description: "You hold the earliest fire so the rest of the house can see by it." },
  { name: "The Pattern-Breaker", description: "You were not built to repeat the loop; you were built to outgrow it." },
  { name: "The Heart-Bearer", description: "You carry what you love in plain sight, which makes you both beacon and target." },
  { name: "The Shadow-Walker", description: "You know the fear by name, and that naming is the beginning of power." },
  { name: "The Still Point", description: "While everything turns, you remember how to stand at the center and choose." },
  { name: "The Signal Keeper", description: "You transmit on a frequency most people have forgotten how to hear." },
  { name: "The Last Light", description: "You burn precisely so others do not have to navigate in the dark." },
  { name: "The Hollow Crown", description: "Your authority comes from what you have surrendered, not what you have claimed." },
  { name: "The Origin-Seeker", description: "Every answer you give is a map back to the first true thing you knew." },
];

function scoreArchetype(a: (typeof ARCHETYPES)[number], answers: string[]): number {
  const full = answers.join(" ").toLowerCase();
  let score = 0;
  const weights: Record<string, string[]> = {
    "The Heart-Bearer": ["love", "heart", "beloved", "devotion", "passion", "care", "tender", "fierce"],
    "The Shadow-Walker": ["fear", "dark", "shadow", "afraid", "night", "hidden", "dread", "terror"],
    "The Pattern-Breaker": ["pattern", "repeat", "loop", "again", "cycle", "always", "never"],
    "The Memory-Keeper": ["memory", "remember", "childhood", "young", "past", "earliest"],
    "The Refiner": ["burn", "fire", "pressure", "pain", "forge", "test", "strength"],
    "The Threshold Walker": ["door", "threshold", "between", "edge", "crossing", "boundary"],
    "The Unbroken": ["survive", "still", "stand", "endure", "broken", "refuse"],
    "The Last Light": ["die", "sacrifice", "give", "protect", "guard", "light"],
    "The Still Point": ["calm", "center", "quiet", "still", "peace", "focus"],
    "The Signal Keeper": ["speak", "voice", "message", "truth", "tell", "word"],
    "The Hollow Crown": ["lead", "weight", "responsibility", "king", "queen", "command"],
    "The Origin-Seeker": ["begin", "origin", "first", "source", "root", "why"],
  };
  const words = weights[a.name] ?? [];
  for (const w of words) {
    if (full.includes(w)) score += 2;
  }
  // Q3 love influence
  if (a.name === "The Heart-Bearer" || a.name === "The Last Light") {
    score += Math.min((answers[2] ?? "").length / 60, 3);
  }
  // Q2 fear influence
  if (a.name === "The Shadow-Walker" || a.name === "The Refiner") {
    score += Math.min((answers[1] ?? "").length / 60, 3);
  }
  // longer answers → more complex archetypes
  const avgLen = answers.reduce((s, a) => s + a.length, 0) / Math.max(answers.length, 1);
  if (avgLen > 120 && (a.name === "The Threshold Walker" || a.name === "The Origin-Seeker")) {
    score += 2;
  }
  return score;
}

function seedArchetype(answers: string[], rng: () => number): { name: string; description: string } {
  const scored = ARCHETYPES.map((a) => ({ a, score: scoreArchetype(a, answers) }));
  scored.sort((x, y) => y.score - x.score);
  const top = scored.slice(0, 4);
  const pick = top[Math.floor(rng() * top.length)] ?? scored[0];
  return pick?.a ?? ARCHETYPES[0];
}

export function generateMythos(answers: string[]): MythosData {
  const seed = answersToSeed(answers);
  const rng = mulberry32(seed);
  const name = seedName(answers, rng);
  const chapters = seedChapters(answers, rng);
  const archetype = seedArchetype(answers, rng);
  const sigilSvg = generateSigilSvg(seed);
  return { name, chapters, archetype, sigilSvg };
}

