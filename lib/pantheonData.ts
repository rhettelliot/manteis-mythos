export interface Deity {
  id: string;
  name: string;
  tradition: string;
  domain: string;
  archetype: string;
  symbol: string;
  element: string;
  alignment: string;
  description: string;
}

export interface PantheonResult {
  deities: Deity[];
  reading: string;
  seed: string;
}

export const PANTHEON_TRADITIONS = [
  "Greek",
  "Norse",
  "Egyptian",
  "Shinto",
  "Celtic",
  "Hindu",
  "Sumerian",
  "Aztec",
  "Yoruba",
  "Mesopotamian",
  "Canaanite",
  "Polynesian",
  "Slavic",
] as const;

export const DEITIES: Deity[] = [
  {
    id: "zeus",
    name: "Zeus",
    tradition: "Greek",
    domain: "Sky / Sovereignty",
    archetype: "The Ruler",
    symbol: "Thunderbolt",
    element: "Air",
    alignment: "Lawful",
    description:
      "Lord of thunder and mountain peak. Zeus brings order through sudden judgement, a force that clears the sky and reshapes kingdoms with a single flash.",
  },
  {
    id: "hades",
    name: "Hades",
    tradition: "Greek",
    domain: "Death / Wealth",
    archetype: "The Shadow King",
    symbol: "Helm of Darkness",
    element: "Earth",
    alignment: "Neutral",
    description:
      "Keeper of the underworld and the buried seed. Hades rules what lies beneath, turning endings into the silent wealth of roots and minerals.",
  },
  {
    id: "athena",
    name: "Athena",
    tradition: "Greek",
    domain: "Wisdom / Strategy",
    archetype: "The Strategist",
    symbol: "Owl",
    element: "Air",
    alignment: "Lawful",
    description:
      "Born from the forehead of thought. Athena offers icy clarity in battle, weaving victory from foresight, craft, and the patience of the loom.",
  },
  {
    id: "dionysus",
    name: "Dionysus",
    tradition: "Greek",
    domain: "Ecstasy / Rebirth",
    archetype: "The Liberator",
    symbol: "Thyrsus",
    element: "Water",
    alignment: "Chaotic",
    description:
      "God of vine and veil. Dionysus dissolves rigid boundaries, inviting collapse as the prelude to renewal and the body as a doorway.",
  },
  {
    id: "artemis",
    name: "Artemis",
    tradition: "Greek",
    domain: "Hunt / Wilderness",
    archetype: "The Untamed",
    symbol: "Crescent Moon",
    element: "Earth",
    alignment: "Neutral",
    description:
      "Mistress of beasts and the silver arrow. Artemis guards the threshold between the civilized and the wild, asking you to trust instinct over approval.",
  },
  {
    id: "odin",
    name: "Odin",
    tradition: "Norse",
    domain: "Wisdom / War",
    archetype: "The Seeker",
    symbol: "Ravens",
    element: "Air",
    alignment: "Chaotic",
    description:
      "One-eyed wanderer who hung himself for knowledge. Odin pays any price for understanding and whispers that sacrifice is the currency of transformation.",
  },
  {
    id: "freyja",
    name: "Freyja",
    tradition: "Norse",
    domain: "Love / Seiðr",
    archetype: "The Enchantress",
    symbol: "Brisingamen",
    element: "Fire",
    alignment: "Neutral",
    description:
      "Chooser of the slain and weaver of desire. Freyja moves between battlefield and bower, teaching that power and beauty are not opposites but twins.",
  },
  {
    id: "thor",
    name: "Thor",
    tradition: "Norse",
    domain: "Thunder / Protection",
    archetype: "The Defender",
    symbol: "Mjölnir",
    element: "Air",
    alignment: "Lawful",
    description:
      "Straightforward as lightning. Thor defends the boundary between order and chaos, a force of plain courage and the honest blow that lands true.",
  },
  {
    id: "loki",
    name: "Loki",
    tradition: "Norse",
    domain: "Trickery / Change",
    archetype: "The Catalyst",
    symbol: "Flame",
    element: "Fire",
    alignment: "Chaotic",
    description:
      "Shape-shifter and boundary-crosser. Loki cracks every system from within, proving that deception and invention are born from the same spark.",
  },
  {
    id: "hel",
    name: "Hel",
    tradition: "Norse",
    domain: "Death / Halflife",
    archetype: "The Threshold",
    symbol: "Half-Rot Face",
    element: "Earth",
    alignment: "Neutral",
    description:
      "Ruler of the misty realm between. Hel holds the space of not-yet and no-longer, where transformation ferments in silence and grey.",
  },
  {
    id: "ra",
    name: "Ra",
    tradition: "Egyptian",
    domain: "Sun / Creation",
    archetype: "The Source",
    symbol: "Solar Disk",
    element: "Fire",
    alignment: "Lawful",
    description:
      "The sun barge crossing the sky. Ra is the first word spoken into darkness, the daily promise that creation is a journey renewed each dawn.",
  },
  {
    id: "osiris",
    name: "Osiris",
    tradition: "Egyptian",
    domain: "Afterlife / Resurrection",
    archetype: "The Renewed King",
    symbol: "Djed Pillar",
    element: "Earth",
    alignment: "Lawful",
    description:
      "Dismembered and restored. Osiris carries the knowledge that what is torn apart can be reassembled into something more durable than before.",
  },
  {
    id: "set",
    name: "Set",
    tradition: "Egyptian",
    domain: "Storm / Disorder",
    archetype: "The Adversary",
    symbol: "Was Scepter",
    element: "Air",
    alignment: "Chaotic",
    description:
      "Red god of desert and thunder. Set tests every structure with destruction, forcing life to evolve by breaking what has grown too still.",
  },
  {
    id: "thoth",
    name: "Thoth",
    tradition: "Egyptian",
    domain: "Knowledge / Writing",
    archetype: "The Scribe",
    symbol: "Ibis",
    element: "Air",
    alignment: "Neutral",
    description:
      "Measurer of time and inventor of language. Thoth records the patterns behind the patterns, revealing that reality is a manuscript still being written.",
  },
  {
    id: "amaterasu",
    name: "Amaterasu",
    tradition: "Shinto",
    domain: "Sun / Ancestry",
    archetype: "The Radiant Ancestor",
    symbol: "Mirror",
    element: "Fire",
    alignment: "Lawful",
    description:
      "Sun goddess hidden in the cave and drawn back out by laughter. Amaterasu reminds that light returns only when we dare to celebrate it.",
  },
  {
    id: " susanoo",
    name: "Susanoo",
    tradition: "Shinto",
    domain: "Storm / Sea",
    archetype: "The Tempest",
    symbol: "Kusanagi Sword",
    element: "Water",
    alignment: "Chaotic",
    description:
      "Impulsive dragon-slayer of the sea. Susanoo rages, breaks, and then gifts a sword of honor — proof that chaos can be shaped into protection.",
  },
  {
    id: "inari",
    name: "Inari",
    tradition: "Shinto",
    domain: "Rice / Fertility",
    archetype: "The Provider",
    symbol: "Fox Spirit",
    element: "Earth",
    alignment: "Neutral",
    description:
      "Kami of rice and fox messengers. Inari governs the quiet miracle of abundance, teaching that prosperity grows from attention and reciprocity.",
  },
  {
    id: "morrigan",
    name: "The Morrígan",
    tradition: "Celtic",
    domain: "War / Fate",
    archetype: "The Phantom Queen",
    symbol: "Crow",
    element: "Air",
    alignment: "Chaotic",
    description:
      "Crow-washer of the battlefield. The Morrígan sees the thread before it is cut, a sovereignty of endings that fertilizes the next beginning.",
  },
  {
    id: "cernunnos",
    name: "Cernunnos",
    tradition: "Celtic",
    domain: "Nature / Cycles",
    archetype: "The Horned One",
    symbol: "Antlers",
    element: "Earth",
    alignment: "Neutral",
    description:
      "Lord of animals and the cross-legged guardian. Cernunnos sits between life and death, antlers branching like the seasons themselves.",
  },
  {
    id: "brigid",
    name: "Brigid",
    tradition: "Celtic",
    domain: "Poetry / Forge",
    archetype: "The Sacred Flame",
    symbol: "Brigid's Cross",
    element: "Fire",
    alignment: "Lawful",
    description:
      "Triple goddess of hearth, healing, and inspiration. Brigid keeps the fire that melts metal and kindles verse — transformation made gentle.",
  },
  {
    id: "shiva",
    name: "Shiva",
    tradition: "Hindu",
    domain: "Destruction / Dance",
    archetype: "The Cosmic Dancer",
    symbol: "Trishula",
    element: "Fire",
    alignment: "Neutral",
    description:
      "Destroyer who dances worlds in and out of being. Shiva turns endings into rhythm, proving that stillness and motion share one breath.",
  },
  {
    id: "kali",
    name: "Kali",
    tradition: "Hindu",
    domain: "Time / Liberation",
    archetype: "The Fierce Mother",
    symbol: "Skull Garland",
    element: "Fire",
    alignment: "Chaotic",
    description:
      "Black-skinned devourer of ego. Kali cuts away illusion with a sword and a laugh, offering freedom through the very fear she inspires.",
  },
  {
    id: "ganesha",
    name: "Ganesha",
    tradition: "Hindu",
    domain: "Beginnings / Obstacles",
    archetype: "The Threshold Guardian",
    symbol: "Elephant Head",
    element: "Earth",
    alignment: "Lawful",
    description:
      "Remover of obstacles and writer of beginnings. Ganesha places the door you must pass, then holds it open if you arrive with humility.",
  },
  {
    id: "ishtar",
    name: "Ishtar",
    tradition: "Sumerian",
    domain: "Love / War",
    archetype: "The Lover-Warrior",
    symbol: "Eight-Pointed Star",
    element: "Fire",
    alignment: "Chaotic",
    description:
      "Queen of heaven and evening star. Ishtar descends into death and returns, braiding passion and combat into one unbreakable cord.",
  },
  {
    id: "enki",
    name: "Enki",
    tradition: "Sumerian",
    domain: "Fresh Water / Wisdom",
    archetype: "The Craftsman",
    symbol: "Goat-Fish",
    element: "Water",
    alignment: "Neutral",
    description:
      "God of the abzu and the knowing waters. Enki shapes life from mud and mercy, intervening through invention when law has grown too hard.",
  },
  {
    id: "quetzalcoatl",
    name: "Quetzalcoatl",
    tradition: "Aztec",
    domain: "Wind / Creation",
    archetype: "The Feathered Serpent",
    symbol: "Plumed Serpent",
    element: "Air",
    alignment: "Lawful",
    description:
      "Lord of the morning star and the breath that stirred the first waters. Quetzalcoatl descends from heaven as wind made flesh, teaching that creation is a spiral of knowledge surrendered and regained.",
  },
  {
    id: "tezcatlipoca",
    name: "Tezcatlipoca",
    tradition: "Aztec",
    domain: "Night / Sorcery",
    archetype: "The Smoking Mirror",
    symbol: "Obsidian Mirror",
    element: "Fire",
    alignment: "Chaotic",
    description:
      "Jaguar-footed sovereign of the darkened sky. Tezcatlipoca's obsidian surface reflects the hidden self, proving that power often arrives disguised as temptation, conflict, and the necessary shattering of order.",
  },
  {
    id: "shango",
    name: "Shango",
    tradition: "Yoruba",
    domain: "Thunder / Justice",
    archetype: "The Storm King",
    symbol: "Double-Headed Axe",
    element: "Air",
    alignment: "Chaotic",
    description:
      "Orisha of firestones and the drum that speaks before lightning. Shango does not separate wrath from righteousness; his storm clears the world of false verdicts and dances afterward in the cool rain of restored balance.",
  },
  {
    id: "yemoja",
    name: "Yemoja",
    tradition: "Yoruba",
    domain: "Ocean / Motherhood",
    archetype: "The Ocean Mother",
    symbol: "Crescent over Waves",
    element: "Water",
    alignment: "Lawful",
    description:
      "Great mother whose body became the sea when her womb could hold no more sorrow. Yemoja gathers the drowned and the dreamers alike, rocking them in tides that remember every name ever whispered to the water.",
  },
  {
    id: "tiamat",
    name: "Tiamat",
    tradition: "Mesopotamian",
    domain: "Salt Sea / Chaos",
    archetype: "The Primordial Deep",
    symbol: "Coiled Serpent",
    element: "Water",
    alignment: "Chaotic",
    description:
      "Mother of dragons and the brine from which the first gods were torn. Tiamat is the ungovernable horizon, the salty refusal to be shaped, whose death birthed the sky and whose memory still murmurs beneath every storm.",
  },
  {
    id: "marduk",
    name: "Marduk",
    tradition: "Mesopotamian",
    domain: "Storm / Kingship",
    archetype: "The Dragon Slayer",
    symbol: "Triangular Spade",
    element: "Air",
    alignment: "Lawful",
    description:
      "Four-eyed lord of thunder who spoke the cosmos into measured form. Marduk's victory over the deep is not mere conquest but the first architecture: sky, stars, and season arranged so that mortal life might learn to pray.",
  },
  {
    id: "baal",
    name: "Baal",
    tradition: "Canaanite",
    domain: "Storm / Fertility",
    archetype: "The Rider on the Clouds",
    symbol: "Bull Thunderbolt",
    element: "Air",
    alignment: "Chaotic",
    description:
      "Rider of the clouds and voice that cracks the summer drought. Baal stands in the doorway between famine and harvest, beloved and contested, reminding us that abundance arrives on the heels of violence and returns only when challenged.",
  },
  {
    id: "tangaroa",
    name: "Tangaroa",
    tradition: "Polynesian",
    domain: "Ocean / Procreation",
    archetype: "The Deep Progenitor",
    symbol: "Fish Hook",
    element: "Water",
    alignment: "Neutral",
    description:
      "Father of fish and whales, whose body is the living sea itself. Tangaroa draws islands up from his depths with a bone hook and counts every current as a child, vast enough to shelter and swallow without malice.",
  },
  {
    id: "veles",
    name: "Veles",
    tradition: "Slavic",
    domain: "Cattle / Magic",
    archetype: "The Horned Magician",
    symbol: "Horned Serpent",
    element: "Earth",
    alignment: "Chaotic",
    description:
      "Shapeshifting lord of forests, herds, and the low places where treasure speaks. Veles steals Perun's cattle not for greed but for cycle, slipping between root and river as the trickster who keeps the high gods honest.",
  },
  {
    id: "mokosh",
    name: "Mokosh",
    tradition: "Slavic",
    domain: "Fate / Weaving",
    archetype: "The Spinner",
    symbol: "Distaff",
    element: "Earth",
    alignment: "Neutral",
    description:
      "Goddess of the spindle and the women who know the weight of thread. Mokosh measures lives between thumb and forefinger, honoring the secret labor by which raw wool becomes garment, and raw fate becomes story.",
  },
];

export function generatePantheonReading(deities: Deity[]): PantheonResult {
  const seed = deities
    .map((d) => d.id)
    .sort()
    .join("-")
    .replace(/[\s]/g, "");

  const traditions = Array.from(new Set(deities.map((d) => d.tradition)));
  const domains = Array.from(new Set(deities.map((d) => d.domain.split(" / ")[0])));
  const elements = Array.from(new Set(deities.map((d) => d.element)));
  const archetypes = deities.map((d) => d.archetype);

  const tension = computeTension(deities);
  const harmony = computeHarmony(deities);

  const reading = buildReading(deities, traditions, domains, elements, archetypes, tension, harmony);

  return { deities, reading, seed };
}

function computeTension(deities: Deity[]) {
  let tension = 0;
  const alignments = deities.map((d) => d.alignment);
  const hasChaotic = alignments.includes("Chaotic");
  const hasLawful = alignments.includes("Lawful");
  if (hasChaotic && hasLawful) tension += 1;

  const elements = deities.map((d) => d.element);
  const pairs = new Set<string>();
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const pair = [elements[i], elements[j]].sort().join("-");
      if (pair === "Fire-Water" || pair === "Air-Earth") pairs.add(pair);
    }
  }
  tension += pairs.size;

  return tension;
}

function computeHarmony(deities: Deity[]) {
  let harmony = 0;
  const traditions = new Set(deities.map((d) => d.tradition));
  if (traditions.size >= 3) harmony += 1;
  if (traditions.size >= 4) harmony += 1;

  const elements = deities.map((d) => d.element);
  const counts = new Map<string, number>();
  elements.forEach((e) => counts.set(e, (counts.get(e) || 0) + 1));
  counts.forEach((c) => {
    if (c >= 2) harmony += 1;
  });

  const alignments = deities.map((d) => d.alignment);
  const allLawful = alignments.every((a) => a === "Lawful");
  const allChaotic = alignments.every((a) => a === "Chaotic");
  if (allLawful || allChaotic) harmony += 1;

  return harmony;
}

function buildReading(
  deities: Deity[],
  traditions: string[],
  domains: string[],
  elements: string[],
  archetypes: string[],
  tension: number,
  harmony: number
): string {
  const names = deities.map((d) => d.name);
  const opening =
    names.length === 1
      ? `Your pantheon begins with a single force: ${names[0]}.`
      : `Your pantheon convenes ${names.length} forces across ${traditions.length} traditions: ${formatList(names)}.`;

  const elementSentence =
    elements.length === 1
      ? `The single element ${elements[0]} washes through every chosen form, concentrating power into one channel.`
      : `The elements ${formatList(elements)} cross and collide, weaving a landscape of ${
          tension > 0 ? "contradiction and voltage" : "balanced force"
        }.`;

  const domainSentence =
    domains.length === 1
      ? `All sovereignty bends toward ${domains[0]}, a narrow but absolute focus.`
      : `Domains of ${formatList(domains)} divide the territory of your mythos, each claiming its own altar.`;

  const archetypeSentence =
    archetypes.length <= 2
      ? `The archetypes ${formatList(archetypes)} echo one another in a tight harmonic.`
      : `Between ${archetypes[0]} and ${archetypes[archetypes.length - 1]}, your pantheon spans ${formatList(
          archetypes.slice(1, -1)
        )}.`;

  const dynamic =
    tension > harmony
      ? `Friction is the engine here. Where ${
          tension >= 2 ? "law meets chaos and fire meets water" : "opposing forces meet"
        }, the mythos does not rest; it generates. Your reading asks you to become the translator between irreconcilable powers.`
      : harmony > tension
      ? `Resonance dominates. Repetition of element and tradition builds a stable chord. Your reading is less about crisis and more about the deepening of one continuous tone.`
      : `Tension and harmony hold equal weight. Your pantheon is a living dialectic: a question posed in one voice and answered in another.`;

  const summary =
    names.length <= 2
      ? `This is an intimate, concentrated mythos — few forces, but each one magnified.`
      : names.length >= 5
      ? `This is a crowded, polyphonic mythos — many voices, many truths, no single throne.`
      : `This is a balanced assembly: enough contrast to generate heat, enough overlap to hold shape.`;

  return `${opening}\n\n${elementSentence}\n\n${domainSentence}\n\n${archetypeSentence}\n\n${dynamic}\n\n${summary}`;
}

function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
