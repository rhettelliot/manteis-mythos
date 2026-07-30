import { hashString, mulberry32 } from "./sigil";

interface Archetype {
  name: string;
  description: string;
  keywords: string[];
}

export const ARCHETYPES: Archetype[] = [
  {
    name: "The Alchemist",
    description:
      "You transform base material into gold. Every loss becomes ingredient.",
    keywords: [
      "transform",
      "change",
      "turn",
      "transmute",
      "convert",
      "lead",
      "gold",
      "cook",
      "brew",
      "mix",
      "become",
    ],
  },
  {
    name: "The Exile",
    description:
      "You walk the edge between worlds, belonging fully to none, observing all.",
    keywords: [
      "alone",
      "outside",
      "different",
      "edge",
      "exile",
      "apart",
      "stranger",
      "wander",
      "nowhere",
      "between",
    ],
  },
  {
    name: "The Phoenix",
    description:
      "You have burned and been reborn. Destruction is not your enemy — it is your method.",
    keywords: [
      "fire",
      "burn",
      "destroy",
      "rebuild",
      "rise",
      "ash",
      "flame",
      "renew",
      "die",
      "reborn",
      "fall",
    ],
  },
  {
    name: "The Witness",
    description:
      "You hold space for what others cannot face. Your gift is presence, not performance.",
    keywords: [
      "watch",
      "see",
      "observe",
      "listen",
      "hold",
      "space",
      "presence",
      "quiet",
      "attend",
      "bear",
    ],
  },
  {
    name: "The Builder",
    description:
      "You make things that outlast you. Structure is your prayer.",
    keywords: [
      "build",
      "make",
      "create",
      "structure",
      "construct",
      "foundation",
      "design",
      "craft",
      "tool",
      "assemble",
    ],
  },
  {
    name: "The Oracle",
    description:
      "You see what others miss. The pattern reveals itself to you first.",
    keywords: [
      "see",
      "know",
      "pattern",
      "vision",
      "future",
      "prophecy",
      "sign",
      "intuition",
      "read",
      "truth",
    ],
  },
  {
    name: "The Cartographer",
    description:
      "You map territory no one has named. You walk first so others can follow.",
    keywords: [
      "map",
      "explore",
      "discover",
      "path",
      "journey",
      "terrain",
      "navigate",
      "uncharted",
      "trail",
      "guide",
    ],
  },
  {
    name: "The Bridge",
    description:
      "You connect what should not connect. You are the translation between worlds.",
    keywords: [
      "connect",
      "bridge",
      "between",
      "link",
      "translate",
      "join",
      "mediate",
      "meet",
      "cross",
      "bond",
    ],
  },
  {
    name: "The Forge",
    description:
      "You are the heat and the hammer. What enters you is unmade and remade.",
    keywords: [
      "forge",
      "hammer",
      "heat",
      "pressure",
      "steel",
      "melt",
      "shape",
      "temper",
      "refine",
      "fire",
    ],
  },
  {
    name: "The Loom",
    description:
      "You weave threads others cannot see. The tapestry is larger than any single thread.",
    keywords: [
      "weave",
      "thread",
      "tapestry",
      "pattern",
      "story",
      "narrative",
      "connect",
      "strand",
      "fabric",
      "intertwine",
    ],
  },
  {
    name: "The Threshold",
    description:
      "You are the door itself. Others pass through you to become themselves.",
    keywords: [
      "door",
      "threshold",
      "pass",
      "enter",
      "transition",
      "become",
      "liminal",
      "gate",
      "cross",
      "open",
    ],
  },
  {
    name: "The Mirror",
    description:
      "You reflect what others cannot see in themselves. This is a gift and a curse.",
    keywords: [
      "mirror",
      "reflect",
      "reflects",
      "image",
      "self",
      "face",
      "shadow",
      "show",
      "reveal",
      "recognize",
    ],
  },
  {
    name: "The Voidwalker",
    description:
      "You move through absence as others move through rooms. The void does not frighten you; it recognizes you.",
    keywords: [
      "void",
      "empty",
      "absence",
      "dark",
      "darkness",
      "abyss",
      "nothing",
      "silence",
      "stillness",
      "unknown",
      "unseen",
    ],
  },
  {
    name: "The Starforger",
    description:
      "You compress dust and longing into light. What you make is not built — it is ignited.",
    keywords: [
      "forge",
      "star",
      "fire",
      "ignite",
      "create",
      "craft",
      "build",
      "born",
      "spark",
      "light",
      "forge",
      "make",
    ],
  },
  {
    name: "The Event Horizon",
    description:
      "You are the boundary beyond which old selves cannot return. Crossing you changes everything.",
    keywords: [
      "edge",
      "boundary",
      "horizon",
      "limit",
      "threshold",
      "change",
      "become",
      "transform",
      "cross",
      "point",
      "no return",
    ],
  },
  {
    name: "The Nebula Mother",
    description:
      "You birth possibilities out of cloud and color. From your uncertainty, constellations later emerge.",
    keywords: [
      "mother",
      "birth",
      "nurture",
      "nebula",
      "cloud",
      "create",
      "gestate",
      "possibility",
      "potential",
      "form",
      "emerge",
    ],
  },
  {
    name: "The Pulsar Oracle",
    description:
      "You transmit signals across impossible distance. Your rhythm is the clock by which others find their way.",
    keywords: [
      "pulse",
      "signal",
      "rhythm",
      "oracle",
      "pattern",
      "repeat",
      "transmit",
      "listen",
      "watch",
      "time",
      "beacon",
    ],
  },
  {
    name: "The Dark Matter Sage",
    description:
      "You are invisible to most instruments, yet your gravity shapes the motion of everything.",
    keywords: [
      "dark",
      "hidden",
      "gravity",
      "sage",
      "influence",
      "unseen",
      "shadow",
      "mystery",
      "power",
      "shape",
      "silent",
    ],
  },
  {
    name: "The Drum Caller",
    description:
      "You do not command the spirits; you remember the rhythm that makes them audible.",
    keywords: [
      "drum",
      "rhythm",
      "beat",
      "call",
      "dance",
      "pulse",
      "sound",
      "listen",
      "invoke",
      "summon",
      "ceremony",
    ],
  },
  {
    name: "The Wounded Healer",
    description:
      "Your medicine was forged in the exact place you broke. You treat others by the map of your own scar tissue.",
    keywords: [
      "heal",
      "wound",
      "medicine",
      "pain",
      "suffer",
      "scar",
      "care",
      "treat",
      "recover",
      "mend",
      "empathy",
    ],
  },
  {
    name: "The Spirit Walker",
    description:
      "You move through the middle, lower, and upper worlds as if they were rooms of one house.",
    keywords: [
      "walk",
      "spirit",
      "world",
      "travel",
      "journey",
      "realm",
      "cross",
      "vision",
      "soul",
      "otherworld",
      "fly",
    ],
  },
  {
    name: "The Bone Keeper",
    description:
      "You tend the ancestors. The dead are not gone; they are a council waiting to be consulted.",
    keywords: [
      "ancestor",
      "bone",
      "dead",
      "death",
      "memory",
      "legacy",
      "root",
      "blood",
      "line",
      "elder",
      "wisdom",
    ],
  },
  {
    name: "The Plant Speaker",
    description:
      "You translate green intelligence. Roots, vines, and poisons tell you what the mind cannot yet say.",
    keywords: [
      "plant",
      "root",
      "leaf",
      "vine",
      "flower",
      "medicine",
      "poison",
      "grow",
      "green",
      "nature",
      "earth",
    ],
  },
  {
    name: "The Shape Shifter",
    description:
      "You borrow forms to learn what cannot be learned in one skin. Identity is your instrument, not your cage.",
    keywords: [
      "shift",
      "change",
      "skin",
      "form",
      "mask",
      "become",
      "transform",
      "animal",
      "wear",
      "embody",
      "adapt",
    ],
  },
];

export function determineArchetype(answers: string[]): {
  name: string;
  description: string;
} {
  const text = answers.join(" ").toLowerCase();
  const scores = ARCHETYPES.map((archetype) => {
    let score = 0;
    for (const keyword of archetype.keywords) {
      if (text.includes(keyword)) {
        score += 1;
      }
    }
    return { archetype, score };
  });

  const maxScore = Math.max(...scores.map((s) => s.score));
  const top = scores.filter((s) => s.score === maxScore).map((s) => s.archetype);

  const seed = hashString(answers.join("|"));
  const rng = mulberry32(seed);
  const chosen = top[Math.floor(rng() * top.length)];

  return { name: chosen.name, description: chosen.description };
}
