import type { MythosData } from "./types";
import { determineArchetype } from "./archetypes";
import { generateSigilData, hashString, mulberry32 } from "./sigil";

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "was",
  "i",
  "you",
  "it",
  "and",
  "to",
  "of",
  "in",
  "that",
  "my",
  "for",
  "with",
  "but",
  "not",
  "this",
  "have",
  "be",
  "on",
  "at",
  "as",
  "do",
  "would",
  "could",
  "should",
  "am",
  "me",
  "we",
  "they",
  "he",
  "she",
  "him",
  "her",
  "them",
  "what",
  "when",
  "how",
  "why",
  "which",
  "who",
  "from",
  "or",
  "if",
  "so",
  "no",
  "yes",
  "can",
  "will",
  "has",
  "had",
  "been",
  "being",
  "are",
  "were",
  "your",
  "their",
  "our",
  "his",
  "its",
]);

const MYTHIC_ADJECTIVES = [
  "silent",
  "burning",
  "broken",
  "ancient",
  "wandering",
  "bright",
  "hollow",
  "wild",
  "patient",
  "feral",
  "eclipsed",
  "untamed",
  "fractured",
  "luminous",
  "vast",
  "hidden",
  "ravenous",
  "golden",
  "thundering",
  "quiet",
  "trembling",
  "endless",
  "sacred",
  "bitter",
  "hungering",
  "celestial",
  "eventidal",
  "voidborn",
  "starlit",
  "gravitic",
  "entropic",
  "quantum",
  "stellar",
  "abyssal",
  "nebular",
  "cosmic",
  "singularity-bright",
];

const MYTHIC_NOUNS = [
  "fire",
  "silence",
  "tide",
  "star",
  "thorn",
  "echo",
  "road",
  "door",
  "thread",
  "mirror",
  "ash",
  "flame",
  "sea",
  "mountain",
  "ruin",
  "garden",
  "song",
  "mask",
  "knife",
  "stone",
  "horizon",
  "well",
  "cipher",
  "labyrinth",
  "sky",
  "thorn",
  "ember",
  "tongue",
  "singularity",
  "void",
  "nebula",
  "quasar",
  "horizon",
  "constellation",
  "pulsar",
  "darkness",
];

const MYTHIC_VERBS = [
  "keep",
  "seek",
  "burn",
  "weave",
  "hold",
  "break",
  "mend",
  "guard",
  "watch",
  "unmake",
  "cross",
  "follow",
  "remember",
  "drink",
  "rise",
  "fall",
  "sow",
  "harvest",
  "collapse",
  "expand",
  "orbit",
  "eclipse",
  "ignite",
  "dissolve",
];

const MYTHIC_ABSTRACTS = [
  "silences",
  "embers",
  "longing",
  "ruin",
  "thresholds",
  "shadows",
  "wonders",
  "memories",
  "absences",
  "wounds",
  "tides",
  "dreams",
  "ciphers",
  "songs",
  "histories",
  "flames",
  "mazes",
  "histories",
  "singularities",
  "voids",
  "nebulae",
  "horizons",
  "cosmoses",
  "eclipses",
  "pulsars",
];

const MYTHIC_ELEMENTS = [
  "threshold",
  "ember",
  "tide",
  "ash",
  "mirror",
  "labyrinth",
  "ruin",
  "sky",
  "underworld",
  "wild",
  "dark",
  "dawn",
  "forge",
  "well",
  "storm",
  "void",
  "nebula",
  "singularity",
  "star",
  "pulsar",
  "quasar",
  "eclipse",
  "supernova",
  "dark matter",
  "event horizon",
];

const MYTHIC_ADJECTIVES_SET = new Set(MYTHIC_ADJECTIVES);
const MYTHIC_VERBS_SET = new Set(MYTHIC_VERBS);

function randomEl<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function thirdPersonSingular(verb: string): string {
  if (/^(?:sh|ch|s|x|z|o)$/i.test(verb.slice(-2)) || /[sxzo]$/i.test(verb)) {
    return verb + "es";
  }
  if (verb.endsWith("y") && !/[aeiou]$/i.test(verb.slice(0, -1).slice(-1))) {
    return verb.slice(0, -1) + "ies";
  }
  return verb + "s";
}

export function extractKeyPhrases(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase().trim();

  // Strategy 1: Extract sentence fragments (split on sentence boundaries, then trim)
  const sentences = lower
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const phrases: string[] = [];

  for (const sentence of sentences) {
    // Strategy 2: Extract meaningful sub-clauses by splitting on commas, semicolons, dashes
    const clauses = sentence
      .split(/[,;:—–-]+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    for (const clause of clauses) {
      const tokens = (clause.match(/[a-z0-9']+/g) ?? []).map((t) =>
        t.replace(/^'+|'+$/g, "")
      );

      if (tokens.length === 0) continue;

      // Trim leading/trailing stop words from the full clause
      let start = 0;
      while (start < tokens.length && STOP_WORDS.has(tokens[start])) start++;
      let end = tokens.length - 1;
      while (end > start && STOP_WORDS.has(tokens[end])) end--;

      if (start > end) continue;

      const trimmed = tokens.slice(start, end + 1);

      // Filter: must have at least one word > 4 chars (not stop word)
      const hasContentWord = trimmed.some(
        (w) => w.length > 4 && !STOP_WORDS.has(w)
      );
      if (!hasContentWord) continue;

      const fullPhrase = trimmed.join(" ");

      // Add full phrase if reasonable length
      if (fullPhrase.length >= 4 && fullPhrase.length <= 45) {
        phrases.push(fullPhrase);
      }

      // Strategy 3: Also extract shorter n-gram windows (2-4 words) from longer clauses
      // This ensures we always have shorter phrases available for template slots
      if (trimmed.length > 4) {
        for (let windowSize = 2; windowSize <= Math.min(4, trimmed.length); windowSize++) {
          for (let i = 0; i <= trimmed.length - windowSize; i++) {
            const window = trimmed.slice(i, i + windowSize);
            // Window must start and end with a content word (not stop word)
            if (STOP_WORDS.has(window[0]) || STOP_WORDS.has(window[window.length - 1])) continue;
            // Must have at least one word > 4 chars
            if (!window.some((w) => w.length > 4 && !STOP_WORDS.has(w))) continue;
            const ngram = window.join(" ");
            if (ngram.length >= 4 && ngram.length <= 40 && !phrases.includes(ngram)) {
              phrases.push(ngram);
            }
          }
        }
      }
    }
  }

  // Deduplicate while preserving order
  const seen = new Set<string>();
  const unique = phrases.filter((p) => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });

  return unique;
}

// Extract single evocative words for name generation (short, punchy words)
export function extractEvocativeWords(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase().trim();
  const raw = lower.match(/[a-z0-9']+/g) ?? [];
  const words = raw
    .map((token) => token.replace(/^'+|'+$/g, ""))
    .filter((token) => token.length > 3 && !STOP_WORDS.has(token));

  // Also filter out very common non-stop words that aren't evocative
  const weakWords = new Set([
    "just", "really", "very", "much", "thing", "things", "something",
    "someone", "everything", "nothing", "always", "never", "still",
    "even", "only", "also", "than", "then", "here", "there", "about",
    "into", "through", "before", "after", "again", "once", "more",
    "most", "some", "such", "each", "every", "both", "few", "many",
    "any", "all", "one", "two", "three", "first", "last", "next",
    "other", "same", "different", "new", "old", "good", "bad",
    "make", "made", "get", "got", "go", "went", "come", "came",
    "take", "took", "give", "gave", "want", "wanted", "know", "knew",
    "think", "thought", "feel", "felt", "look", "looked", "seem",
    "seemed", "find", "found", "tell", "told", "ask", "asked",
    "said", "say", "see", "saw", "heard", "hear",
  ]);
  return words.filter((w) => !weakWords.has(w));
}

function pickEvocativeWord(
  words: string[],
  seed: number
): string {
  if (words.length === 0) return "";
  const rng = mulberry32(seed);
  // Prefer longer words (more distinctive)
  const sorted = words.slice().sort((a, b) => b.length - a.length);
  const topCount = Math.max(1, Math.ceil(sorted.length * 0.5));
  const candidates = sorted.slice(0, topCount);
  return candidates[Math.floor(rng() * candidates.length)];
}

export function pickEvocative(phrases: string[], seed: number, maxLen = 45): string {
  if (phrases.length === 0) return "a truth you have not yet named";
  const rng = mulberry32(seed);
  // Filter out phrases that are too long for the template slot
  const fitting = phrases.filter((p) => p.length <= maxLen);
  const pool = fitting.length > 0 ? fitting : phrases;

  // Score: prefer medium-length phrases (15-35 chars) for best narrative fit
  const scored = pool
    .slice()
    .map((p) => ({
      phrase: p,
      score: p.length >= 15 && p.length <= 35 ? 2 : p.length >= 8 ? 1 : 0,
    }))
    .sort((a, b) => b.score - a.score || b.phrase.length - a.phrase.length);

  // Pick from top 60%
  const topCount = Math.max(1, Math.ceil(scored.length * 0.6));
  const candidates = scored.slice(0, topCount);
  return candidates[Math.floor(rng() * candidates.length)].phrase;
}

function wordFromAnswer(
  answers: string[],
  index: number,
  seed: number,
  fallback: readonly string[],
  rng: () => number
): string {
  const words = extractEvocativeWords(answers[index] ?? "");
  if (words.length > 0) {
    return pickEvocativeWord(words, seed + index);
  }
  return randomEl(fallback, rng);
}

function generateName(answers: string[], rng: () => number, seed: number): string {
  const n = Math.max(1, answers.length);
  const idx1 = Math.floor(rng() * n);
  let idx2 = (idx1 + 1 + Math.floor(rng() * (n - 1))) % n;
  if (n === 1) idx2 = 0;

  const pattern = Math.floor(rng() * 5);

  switch (pattern) {
    case 0: {
      const adjPhrases = extractKeyPhrases(answers[idx1] ?? "").filter((w) =>
        MYTHIC_ADJECTIVES_SET.has(w)
      );
      const adjective =
        adjPhrases.length > 0
          ? pickEvocative(adjPhrases, seed + idx1)
          : randomEl(MYTHIC_ADJECTIVES, rng);
      const noun = wordFromAnswer(answers, idx2, seed, MYTHIC_NOUNS, rng);
      return `The ${capitalize(adjective)} ${capitalize(noun)}`;
    }
    case 1: {
      const verbPhrases = extractKeyPhrases(answers[idx1] ?? "").filter((w) =>
        MYTHIC_VERBS_SET.has(w)
      );
      const verb =
        verbPhrases.length > 0
          ? pickEvocative(verbPhrases, seed + idx1)
          : randomEl(MYTHIC_VERBS, rng);
      const abstract = randomEl(MYTHIC_ABSTRACTS, rng);
      const agent = verb.endsWith("e") ? verb + "r" : verb + "er";
      return `${capitalize(agent)} of ${capitalize(abstract)}`;
    }
    case 2: {
      const noun = wordFromAnswer(answers, idx1, seed, MYTHIC_NOUNS, rng);
      const verbPhrases = extractKeyPhrases(answers[idx2] ?? "").filter((w) =>
        MYTHIC_VERBS_SET.has(w)
      );
      const verb =
        verbPhrases.length > 0
          ? pickEvocative(verbPhrases, seed + idx2)
          : randomEl(MYTHIC_VERBS, rng);
      return `The ${capitalize(noun)} That ${capitalize(
        thirdPersonSingular(verb)
      )}`;
    }
    case 3: {
      const noun = wordFromAnswer(answers, idx1, seed, MYTHIC_NOUNS, rng);
      const element = randomEl(MYTHIC_ELEMENTS, rng);
      return `${capitalize(noun)} of the ${capitalize(element)}`;
    }
    default: {
      const w1 = wordFromAnswer(answers, idx1, seed, MYTHIC_NOUNS, rng);
      let idx3 = idx1;
      let guard = 0;
      while (idx3 === idx1 && n > 1 && guard < 10) {
        idx3 = Math.floor(rng() * n);
        guard += 1;
      }
      const w2 = wordFromAnswer(answers, idx3, seed, MYTHIC_NOUNS, rng);
      return `The ${capitalize(w1)} ${capitalize(w2)}`;
    }
  }
}

function pickPhrase(answer: string, seed: number, maxLen = 40): string {
  const phrases = extractKeyPhrases(answer ?? "");
  if (phrases.length === 0) return "a truth you have not yet named";
  return pickEvocative(phrases, seed, maxLen);
}

const ORIGIN_OPENINGS = [
  "Before the pattern, there was the impulse.",
  "Your story begins not with your birth, but with the first time you chose differently.",
  "In the beginning, there was only the wanting.",
  "Every myth starts in a single room. Yours was no exception.",
  "Long before you could name it, the current was already moving through you.",
];

const ORIGIN_MEMORY_PARAGRAPHS = [
  "The first fire was {phrase}. It arrived before language, before defense, before the self you would later build to contain it. In that moment, the world tilted, and you tilted with it. You have been returning to that angle ever since.",
  "Before you knew the names of things, there was this: {phrase}. It did not ask permission. It simply arrived, and in arriving, it made you — quietly, completely, without review.",
  "You carry an origin like a lantern: {phrase}. It does not illuminate everything. It only insists that what happened then is still happening now, beneath the newer floors you laid over it.",
  "The earliest memory that shaped you holds a single image: {phrase}. From it, all later rooms were furnished. From it, you learned what to want and what to fear.",
];

const ORIGIN_CHILD_PARAGRAPHS = [
  "And to the child you were — {phrase} — this is the origin. Not of the body, but of the choosing. The child is still inside you, listening for the voice you promised to become.",
  "To the child you would later speak, you would say: {phrase}. But the child already knew. The child had memorized your face before you learned to wear it.",
  "The words you would offer your ten-year-old self — {phrase} — are not advice. They are a password. They unlock the door you closed to survive.",
  "Somewhere, the child you were still waits for a single sentence: {phrase}. That sentence is the true beginning of your myth. Everything else is commentary.",
];

const ORIGIN_BRIDGE_PARAGRAPHS = [
  "Between the first fire and the voice that answers it, a path was carved. You have walked it backward and forward, mistaking the walking for the destination.",
  "Myth is not what happened. Myth is what survived the happening. You are the archive and the flame.",
  "What begins as wound becomes map. What begins as map becomes door. You are still standing in the first threshold, choosing which side to call home.",
  "The origin does not apologize. It simply repeats, softly, under every decision you make.",
];

const ORIGIN_CLOSINGS = [
  "This is where your myth begins: not in the room, but in the choice that room made possible.",
  "Every origin is a question dressed in smoke. You have spent the rest of your life learning to read it.",
  "The beginning does not end. It only deepens, gathering silence around it like water.",
  "Hold it gently. The first fire is still burning. It has simply learned to burn in code.",
];

function generateOrigin(answers: string[], rng: () => number, seed: number): string {
  const phrase1 = pickPhrase(answers[0] ?? "", seed + 1);
  const phrase6 = pickPhrase(answers[5] ?? "", seed + 6);

  const paragraphs = [
    randomEl(ORIGIN_OPENINGS, rng),
    randomEl(ORIGIN_MEMORY_PARAGRAPHS, rng).replace("{phrase}", phrase1),
    randomEl(ORIGIN_CHILD_PARAGRAPHS, rng).replace("{phrase}", phrase6),
  ];

  if (rng() > 0.4) {
    paragraphs.push(randomEl(ORIGIN_BRIDGE_PARAGRAPHS, rng));
  }

  paragraphs.push(randomEl(ORIGIN_CLOSINGS, rng));
  return paragraphs.join("\n\n");
}

const CURRENT_OPENINGS = [
  "You stand now in the chapter of the {archetype}.",
  "This is the season of the {archetype}. The air tastes of metal and decision.",
  "Now, you wear the mask of the {archetype}. Do not be deceived: the mask was carved by your own hands.",
  "The current chapter is named for the {archetype}. Everything before was prologue.",
];

const FEAR_PARAGRAPHS = [
  "The thing you fear most about yourself — {phrase} — is not your weakness. It is your edge. The blade is sharpened by the very thing that threatens to cut you.",
  "You hide {phrase} from the world, as if it were a flaw. But look closer: it is the source of your pressure. It is what makes you real.",
  "What you call a darkness — {phrase} — is only power you have not yet learned to aim. The fear is not the thing. The fear is how much it matters.",
];

const LOVE_PARAGRAPHS = [
  "What you love most fiercely — {phrase} — is the gravity that holds your orbit. Without it, you are debris.",
  "{phrase} is not a hobby. It is the axis the world turns around when no one is watching. Lose it, and you lose your north.",
  "Your love — {phrase} — is the only honest compass you own. Everything else is negotiation. Everything else is weather.",
];

const PATTERN_PARAGRAPHS = [
  "The pattern: {phrase}. It repeats because you have not yet learned its lesson. Or perhaps the lesson IS the pattern.",
  "You keep returning to {phrase}, and each return looks like failure. It is not. It is the spiral staircase. You are being shown the same door from a higher floor.",
  "{phrase} will keep visiting until you stop performing surprise. The pattern is not your enemy. It is your unfinished sentence.",
];

const CURRENT_CLOSINGS = [
  "This is the crucible. Not the fire that destroys, but the fire that reveals what will not burn.",
  "The present is not a destination. It is the forge where your next shape is being hammered.",
  "Stand still enough to feel it: the myth is being rewritten in real time, and the pen is in your hand.",
  "You are not behind. You are exactly where the story tightens.",
];

function generateCurrent(
  answers: string[],
  rng: () => number,
  seed: number,
  archetypeName: string
): string {
  const phrase2 = pickPhrase(answers[1] ?? "", seed + 2);
  const phrase3 = pickPhrase(answers[2] ?? "", seed + 3);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5);
  const archetypeLabel = archetypeName.replace(/^The /, "");

  const paragraphs = [
    randomEl(CURRENT_OPENINGS, rng).replace("{archetype}", archetypeLabel),
    randomEl(FEAR_PARAGRAPHS, rng).replace("{phrase}", phrase2),
    randomEl(LOVE_PARAGRAPHS, rng).replace("{phrase}", phrase3),
    randomEl(PATTERN_PARAGRAPHS, rng).replace("{phrase}", phrase5),
    randomEl(CURRENT_CLOSINGS, rng),
  ];

  return paragraphs.join("\n\n");
}

const PROPHECY_OPENINGS = [
  "The pattern you have been repeating is about to break.",
  "What comes next was always coming.",
  "The future is not ahead of you. It is leaning through you, reading the text of your life.",
  "A door is preparing to open. You have already built it. You have only to recognize the frame.",
];

const DIE_FOR_PARAGRAPHS = [
  "What you would die for — {phrase} — will find you. Not as death, but as the thing that makes death irrelevant.",
  "{phrase} is the thread that runs from your first breath to your last. It will return wearing a new face. Do not mistake the face for the thread.",
  "You have already pledged yourself to {phrase}. The pledge was not spoken. It was lived. Now it will ask you to live it louder.",
];

const PATTERN_RESOLUTION_PARAGRAPHS = [
  "The pattern, {phrase}, will not dissolve. It will transform. The loop becomes a ladder the moment you stop climbing in place.",
  "What returns as {phrase} is not a punishment. It is the draft of a promise. You are being edited into clarity.",
  "When {phrase} appears again, you will meet it differently — not because the world has changed, but because you have stopped pretending you do not know its name.",
];

const AFRAID_PARAGRAPHS = [
  "And the question you are afraid to answer — {phrase} — will be answered for you. By time. By the slow accumulation of choices that become destiny.",
  "{phrase} is the question you keep in your pocket like a stone. The stone is getting warm. Soon it will be too hot to carry. That is the answer arriving.",
  "You do not have to speak {phrase} yet. The myth will speak it through you. The silence is part of the speaking.",
];

const PROPHECY_CLOSINGS = [
  "Your mythos is not complete. It is being written. Right now. In the space between this breath and the next.",
  "You are the oracle and the prophecy. Begin again, but with eyes open.",
  "The end of this reading is not the end of the story. Turn the page. The ink is still wet.",
  "What has been named can now be carried. Go gently. Go fiercely. Go.",
];

const COSMIC_PROPHECY_OPENINGS = [
  "A star you have not yet named is already collapsing into your future.",
  "The cosmos does not warn. It simply brightens before it swallows.",
  "Something vast is orbiting the edge of your becoming. Do not look away from the gravity.",
  "You stand at the event horizon of an old self. Beyond it, even light must choose a new path.",
];

const COSMIC_CYCLE_PARAGRAPHS = [
  "The cosmic cycle turns on {phrase}. It has burned before — a billion years ago, a breath ago — and it will burn again. You are not the first fire. You are the fire that learned to remember.",
  "All stars die into the same ash: {phrase}. From that ash, new constellations are negotiated. Your death and rebirth are not tragedy. They are stellar metabolism.",
  "What returns to you as {phrase} is not a pattern. It is an orbit. You have circled this truth long enough to begin falling toward it.",
];

const VOID_PARAGRAPHS = [
  "The void does not want you empty. The void wants you accurate. It asks you to set down {phrase} and see what orbits without gravity.",
  "There is a darkness older than your fear. It holds {phrase} the way space holds a star — without touching, without looking away.",
  "You have been calling {phrase} a lack. It is not. It is the medium in which singularities are born. The void is your first ingredient.",
];

const HORIZON_PARAGRAPHS = [
  "The event horizon approaches as {phrase}. Once crossed, information cannot return unchanged. That is not loss. That is translation into a brighter compression.",
  "You will arrive at {phrase} as if by accident. But the horizon has been bending your path since before you chose it. Step through. Light cannot, but you are not only light.",
];

const COSMIC_CLOSINGS = [
  "The cosmos is not indifferent. It is precise. You are the exact density around which the next galaxy organizes itself.",
  "Burn, collapse, expand, repeat. The stellar cycle is your inheritance. Make it luminous.",
  "What you call an ending is only the surface of a deeper ignition. The universe rewrites itself in fire. So do you.",
  "Your mythos is cosmic now. Carry it like a small, bright singularity — dense, dangerous, and absolutely necessary.",
];

function generateCosmicProphecy(
  answers: string[],
  rng: () => number,
  seed: number
): string {
  const phrase4 = pickPhrase(answers[3] ?? "", seed + 4);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5);
  const phrase7 = pickPhrase(answers[6] ?? "", seed + 7);

  const paragraphs = [
    randomEl(COSMIC_PROPHECY_OPENINGS, rng),
    randomEl(COSMIC_CYCLE_PARAGRAPHS, rng).replace("{phrase}", phrase4),
    randomEl(VOID_PARAGRAPHS, rng).replace("{phrase}", phrase5),
    randomEl(HORIZON_PARAGRAPHS, rng).replace("{phrase}", phrase7),
    randomEl(COSMIC_CLOSINGS, rng),
  ];

  return paragraphs.join("\n\n");
}

function generateProphecy(answers: string[], rng: () => number, seed: number): string {
  const phrase4 = pickPhrase(answers[3] ?? "", seed + 4);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5);
  const phrase7 = pickPhrase(answers[6] ?? "", seed + 7);

  // 25% chance to generate a cosmic prophecy variant.
  if (rng() < 0.25) {
    return generateCosmicProphecy(answers, rng, seed);
  }

  const paragraphs = [
    randomEl(PROPHECY_OPENINGS, rng),
    randomEl(DIE_FOR_PARAGRAPHS, rng).replace("{phrase}", phrase4),
    randomEl(PATTERN_RESOLUTION_PARAGRAPHS, rng).replace("{phrase}", phrase5),
    randomEl(AFRAID_PARAGRAPHS, rng).replace("{phrase}", phrase7),
    randomEl(PROPHECY_CLOSINGS, rng),
  ];

  return paragraphs.join("\n\n");
}

export function generateMythos(answers: string[]): MythosData {
  const seed = hashString(answers.join("|"));
  const rng = mulberry32(seed);

  const archetype = determineArchetype(answers);
  const sigil = generateSigilData(answers);

  return {
    name: generateName(answers, rng, seed),
    archetype: archetype.name,
    archetypeDescription: archetype.description,
    origin: generateOrigin(answers, rng, seed),
    current: generateCurrent(answers, rng, seed, archetype.name),
    prophecy: generateProphecy(answers, rng, seed),
    sigil,
  };
}
