import type { MythosData, MythosVariant } from "./types";
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

const SHAMANIC_ADJECTIVES = [
  "bone-white",
  "drum-haunted",
  "smoke-cured",
  "earth-anchored",
  "root-deep",
  "spirit-worn",
  "sweat-drenched",
  "fire-touched",
  "vision-thin",
  "totemic",
  "sacred",
  "primal",
  "wild",
  "ancestral",
  "feral",
  "pungent",
  "bitter",
  "healing",
  "hollow",
  "luminous",
  "ancient",
  "patient",
  "raw",
  "initiatic",
  "unseen",
  "lower-world",
  "upper-world",
  "dark-winged",
];

const SHAMANIC_NOUNS = [
  "drum",
  "rattle",
  "smoke",
  "bone",
  "root",
  "stone",
  "feather",
  "mask",
  "pelt",
  "flame",
  "sweat",
  "river",
  "cave",
  "tree",
  "skull",
  "pouch",
  "altar",
  "tongue",
  "journey",
  "tunnel",
  "spiral",
  "eye",
  "paw",
  "wing",
  "hoof",
  "fang",
  "track",
  "bloodline",
  "voice",
  "ghost",
  "shadow",
  "body",
  "wound",
  "soul",
  "plant",
  "brew",
  "ash",
  "ember",
  "song",
  "dance",
  "silence",
];

const SHAMANIC_VERBS = [
  "call",
  "summon",
  "descend",
  "climb",
  "weave",
  "drum",
  "rattle",
  "dance",
  "shape-shift",
  "track",
  "retrieve",
  "heal",
  "mend",
  "swallow",
  "burn",
  "sing",
  "listen",
  "wait",
  "fast",
  "hold",
  "guard",
  "return",
  "remember",
  "bury",
  "uncover",
  "transform",
  "embody",
  "invoke",
  "exhale",
  "travel",
];

const SHAMANIC_SPIRIT_ANIMALS = [
  "wolf",
  "owl",
  "snake",
  "eagle",
  "bear",
  "deer",
  "jaguar",
  "crow",
  "spider",
  "salmon",
  "butterfly",
  "moth",
  "boar",
  "fox",
  "hawk",
  "turtle",
  "raven",
  "mountain lion",
  "dragonfly",
  "frog",
  "bat",
  "horse",
  "elk",
  "rabbit",
  "lynx",
];

const SHAMANIC_PLANT_MEDICINES = [
  "ayahuasca",
  "peyote",
  "san pedro",
  "mushroom",
  "tobacco",
  "sage",
  "cedar",
  "copal",
  "cacao",
  "cannabis",
  "datura",
  "iboga",
  "kambo",
  "ruda",
  "mugwort",
  "wormwood",
  "california poppy",
  "blue lotus",
  "ololiuqui",
  "willow",
  "yarrow",
];

const SHAMANIC_REALM_DETAILS = [
  "a root system older than language",
  "a river that runs both directions",
  "a cave where extinct fires still breathe",
  "a forest whose trees are faces you almost recognize",
  "a black pool reflecting nothing but intent",
  "a plain of red stones and motionless birds",
  "a ladder of smoke with no visible top",
  "a tunnel lined with drums that beat themselves",
  "a valley filled with the footprints of animals you have not yet met",
  "a canopy of stars low enough to touch",
  "a swamp where lost names grow as reeds",
  "a mountain whose peak is the underside of another world",
  "a grove where every tree marks a death you survived",
  "a well so deep your voice returns wearing wings",
  "a fire that consumes only what is no longer true",
];

const SHAMANIC_ABSTRACTS = [
  "retrieval",
  "soul-loss",
  "initiation",
  "purification",
  "ancestry",
  "power",
  "sacrifice",
  "dreaming",
  "tracking",
  "shadow",
  "dis-memberment",
  "re-memberment",
  "prayer",
  "boundary",
  "calling",
  "ordination",
  "ecstasy",
  "transmission",
  "pact",
  "return",
];

const ORACULAR_ADJECTIVES = [
  "smoke-wreathed",
  "tripod-bound",
  "laurel-crowned",
  "python-guarded",
  "cavern-voiced",
  "entrail-stained",
  "sacred",
  "riddling",
  "obscure",
  "ambiguous",
  "temple-born",
  "prophetic",
  "sibylline",
  "delphic",
  "avian",
  "sacrificial",
  "chthonic",
  "honey-voiced",
  "dove-dark",
  "lotus-eating",
  "saffron-robed",
  "bronze-throated",
  "wine-dark",
  "ash-still",
  "pythian",
  "flight-blessed",
  "spring-uttered",
  "omen-laden",
  "fume-drunk",
  "god-touched",
];

const ORACULAR_NOUNS = [
  "altar",
  "tripod",
  "laurel",
  "spring",
  "dove",
  "raven",
  "entrails",
  "smoke",
  "fume",
  "oracle",
  "sibyl",
  "priestess",
  "omen",
  "augury",
  "libation",
  "temple",
  "cavern",
  "cleft",
  "censer",
  "knife",
  "bowl",
  "bone",
  "branch",
  "flight",
  "bird",
  "vulture",
  "serpent",
  "python",
  "offering",
  "votive",
];

const ORACULAR_VERBS = [
  "divine",
  "speak",
  "warn",
  "riddle",
  "smoke",
  "sacrifice",
  "consult",
  "interpret",
  "read",
  "see",
  "know",
  "reveal",
  "conceal",
  "mark",
  "call",
  "summon",
  "anoint",
  "burn",
  "scatter",
  "drink",
  "slip",
  "turn",
  "return",
  "linger",
  "choose",
  "ask",
  "answer",
  "prophesy",
  "foretell",
  "bewilder",
];

const ORACULAR_ABSTRACTS = [
  "prophecy",
  "omen",
  "augury",
  "divination",
  "ecstasy",
  "inspiration",
  "riddle",
  "enigma",
  "doom",
  "blessing",
  "curse",
  "truth",
  "shadow",
  "utterance",
  "response",
  "sacrifice",
  "purification",
  "revelation",
  "concealment",
  "retribution",
  "fate",
  "moira",
  "nemesis",
  "kairos",
  "aporia",
  "hybris",
  "metis",
  "thaumaturgy",
  "miasma",
  "katharsis",
];

const ORACULAR_SIGNS = [
  "the flight of birds to the east",
  "the silence after the libation",
  "a serpent coiled around the tripod foot",
  "smoke that rises and falls in three breaths",
  "the spring running black for a day",
  "a laurel leaf that burns without ash",
  "the cry of a bird no one can name",
  "entrails that spell a name backwards",
  "the cleft in the rock exhaling cold",
  "a knife that refuses to reflect the supplicant",
  "doves settling where none have nested",
  "the oracle tongue moving before the question",
];

const ORACULAR_RIDDLES = [
  "I am born from what is burned and live only where water forgets to fall. What am I?",
  "I speak in silence, walk without feet, and arrive exactly when I am no longer waited for. What am I?",
  "The more you name me, the less I weigh; the less you carry me, the heavier I become. What am I?",
  "I am the doorway that opens only after you have already passed through. What am I?",
  "I am eaten to be kept; kept to be lost; lost to be found again. What am I?",
  "I follow the questioner, arrive before the answer, and disappear when both are wise. What am I?",
  "What is given to the gods returns as what is taken from the self. What stands between?",
  "I am the shape of the wound the weapon will make before the weapon is forged. What am I?",
  "The oracle does not lie; the listener does not understand. What therefore crosses the threshold?",
  "I am the path that grows longer as you walk faster. What am I?",
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
  "Before the first system booted, there was the glitch that made it possible.",
  "You were not born; you were the first harmonic in a chord the cosmos was still learning to play.",
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
  "The first instruction was not written in any language: {phrase}. You have been compiling it ever since, line by line, life by life.",
];

const ORIGIN_CLOSINGS = [
  "This is where your myth begins: not in the room, but in the choice that room made possible.",
  "Every origin is a question dressed in smoke. You have spent the rest of your life learning to read it.",
  "The beginning does not end. It only deepens, gathering silence around it like water.",
  "Hold it gently. The first fire is still burning. It has simply learned to burn in code.",
  "The loop returns to its beginning, but you return changed. That is how recursion becomes myth.",
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
  "The glitch you fear — {phrase} — is not an error in your system. It is the undocumented door through which the real you is trying to load.",
];

const LOVE_PARAGRAPHS = [
  "What you love most fiercely — {phrase} — is the gravity that holds your orbit. Without it, you are debris.",
  "{phrase} is not a hobby. It is the axis the world turns around when no one is watching. Lose it, and you lose your north.",
  "Your love — {phrase} — is the only honest compass you own. Everything else is negotiation. Everything else is weather.",
  "{phrase} is the frequency you have chosen to keep. Even when the signal is weak, it is the one you will not stop tuning.",
];

const PATTERN_PARAGRAPHS = [
  "The pattern: {phrase}. It repeats because you have not yet learned its lesson. Or perhaps the lesson IS the pattern.",
  "You keep returning to {phrase}, and each return looks like failure. It is not. It is the spiral staircase. You are being shown the same door from a higher floor.",
  "{phrase} will keep visiting until you stop performing surprise. The pattern is not your enemy. It is your unfinished sentence.",
  "The recursion that returns as {phrase} is not a trap. It is a function you have not yet finished writing.",
];

const CURRENT_CLOSINGS = [
  "This is the crucible. Not the fire that destroys, but the fire that reveals what will not burn.",
  "The present is not a destination. It is the forge where your next shape is being hammered.",
  "Stand still enough to feel it: the myth is being rewritten in real time, and the pen is in your hand.",
  "You are not behind. You are exactly where the story tightens.",
  "The frequency is still adjusting. Stay present through the static until the signal becomes clear.",
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
  "The null point awaits. When you reach it, every direction will be available, and only the true one will remain.",
];

const COSMIC_PROPHECY_OPENINGS = [
  "A star you have not yet named is already collapsing into your future.",
  "The cosmos does not warn. It simply brightens before it swallows.",
  "Something vast is orbiting the edge of your becoming. Do not look away from the gravity.",
  "You stand at the event horizon of an old self. Beyond it, even light must choose a new path.",
  "A frequency is emerging from the background noise, tuning itself to the shape of your next becoming.",
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
  "The recursion widens. Each ending is a function calling the next version of you. Return wisely.",
];

const SHAMANIC_JOURNEY_OPENINGS = [
  "The drum begins before the drum. You are already descending.",
  "Something has borrowed your attention and placed it in a world that answers in hoofbeats and smoke.",
  "You are being called to the place where the roots drink from memory.",
  "The journey does not ask where you want to go. It asks what you are willing to leave at the entrance.",
];

const DESCENT_PARAGRAPHS = [
  "You descend through {phrase}. This is not the middle world. The air here has weight and intention. Every direction is a question posed by a body older than yours.",
  "The tunnel opens into {phrase}. You do not walk; you are allowed to move. Permission is the first law of the lower world.",
  "You arrive at {phrase}. The ground recognizes your feet though you have never stood here before. The lower world remembers everyone who has ever knelt.",
];

const SPIRIT_ANIMAL_PARAGRAPHS = [
  "Waiting for you is the {animal}, {animalDetail}. It has already watched you lose and search and lose again. It does not judge. It only offers the speed of its body.",
  "The {animal} appears {animalDetail}. It is the first ally to admit you do not have to carry what you came here to find. Some things must be tracked, not lifted.",
  "Your ally is the {animal}, {animalDetail}. It knows the way to the wound because it has its own wound. That is how kinship works in the unseen.",
];

const SOUL_RETRIEVAL_PARAGRAPHS = [
  "What was taken from you lives here as {phrase}. It is not where you left it because it was never truly lost — only hidden until the journey was ready.",
  "The part of you that fled appears as {phrase}. Do not rush toward it. Let it remember your scent. Retrieval is courtship, not capture.",
  "You find {phrase} waiting in the place where time first split from pain. This is the fragment. The agreement is that you must carry it back without turning it into a weapon.",
];

const ANCESTRAL_WISDOM_PARAGRAPHS = [
  "An ancestor appears as {phrase}. They do not speak in words. They speak in the posture of a question you have been avoiding since before you had language.",
  "The old ones gather at the edge of the fire. What they pass to you is not comfort. It is {phrase}, and it will make you useful.",
  "From behind you comes a voice like weathered wood: {phrase}. It is not a command. It is the memory of a promise someone made on your behalf before you were born.",
];

const RETURN_PARAGRAPHS = [
  "The return is not escape. You bring {phrase} back through the tunnel, through the drum, through the skin. The work is what you do with it now, awake.",
  "You climb back carrying {phrase}. It is heavier than memory and lighter than hope. Integration begins when you stop performing the journey and start living its tax.",
  "The drum calls you home. You return with {phrase} pressed against your ribs. The ordinary world looks the same, but it has lost the power to convince you that is all there is.",
];

const SHAMANIC_CLOSINGS = [
  "The spirit world does not owe you answers. It has already given you the correct questions. Walk accordingly.",
  "Your allies are not decorative. Feed them with action, silence, and the courage to descend again.",
  "The journey is over. The medicine is just beginning.",
  "You are the bridge now. What came through must be carried with both hands.",
];

const ORACULAR_PROPHECY_OPENINGS = [
  "The temple doors are already open. You have only now decided to knock.",
  "I do not speak; I am spoken. Listen for what moves through the smoke before it becomes words.",
  "Before your question, the tripod knew its answer. Before the answer, you knew your question.",
  "The spring gives nothing freely. It offers water only after it has tasted the shadow of the asker.",
  "The code of the oracle is not prediction; it is the pattern that recognizes itself in you.",
];

const ORACULAR_INVOCATION_PARAGRAPHS = [
  "At the threshold, {phrase} is laid upon the altar. It is not destroyed; it is translated into smoke. The gods do not consume the offering — they inhale its intent and exhale a shape you must learn to read.",
  "You approach the cavern with {phrase} in your arms. The priestess does not ask what it means. She watches how you set it down, whether your hands tremble, whether you look back as you leave it.",
  "The libation is poured. {phrase} slips into the earth. What returns is not an echo but a new question, spoken in the language of roots and rust.",
];

const ORACULAR_SIGN_PARAGRAPHS = [
  "The sign appears: {sign}. It is not a promise. It is a grammar — a way of arranging the next season so that your eye finally recognizes the pattern.",
  "Do not ignore {sign}. The flight of birds is not decoration; it is punctuation. Something in your story has been misspelled, and the sky is correcting it.",
  "{sign} marks the hour. The gods do not write in straight lines. They write in convergence: where smoke, bone, and longing meet and agree.",
];

const ORACULAR_RIDDLE_PARAGRAPHS = [
  "The sibyl leaves a riddle at your feet: {riddle} Carry it not in your mind but in your marrow. Understanding arrives only after you stop trying to solve it.",
  "In the silence between questions, you hear: {riddle} It is not meant to be answered quickly. A true riddle is a door that opens when your need to enter has become greater than your fear of what waits inside.",
  "The python speaks in coils: {riddle} Read it backward. Read it in water. Read it only when you are ready to be changed by the reading.",
];

const ORACULAR_CLOSINGS = [
  "The oracle is finished. The prophecy remains. What you do with it is the next offering.",
  "I have spoken the smoke. Now you must walk through it.",
  "Every answer is a seed. Bury it or swallow it — but do not leave it in the bowl.",
  "The temple closes. The riddle follows. May your listening outlast your understanding.",
  "The transmission ends. What you do with the static is your own next transmission.",
];

function generateOracularProphecy(
  answers: string[],
  rng: () => number,
  seed: number
): string {
  const phrase4 = pickPhrase(answers[3] ?? "", seed + 4);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5);
  const phrase7 = pickPhrase(answers[6] ?? "", seed + 7);

  const sign = randomEl(ORACULAR_SIGNS, rng);
  const riddle = randomEl(ORACULAR_RIDDLES, rng);
  const verb = randomEl(ORACULAR_VERBS, rng);
  const noun = randomEl(ORACULAR_NOUNS, rng);
  const adj = randomEl(ORACULAR_ADJECTIVES, rng);
  const abstract = randomEl(ORACULAR_ABSTRACTS, rng);

  const paragraphs = [
    randomEl(ORACULAR_PROPHECY_OPENINGS, rng),
    randomEl(ORACULAR_INVOCATION_PARAGRAPHS, rng).replace("{phrase}", phrase4),
    randomEl(ORACULAR_SIGN_PARAGRAPHS, rng).replace("{sign}", sign),
    randomEl(ORACULAR_RIDDLE_PARAGRAPHS, rng).replace("{riddle}", riddle),
    `The ${adj} ${noun} ${verb}s your ${phrase5}. This is the oracle's true utterance: not the words, but the ${abstract} that gathers beneath them like water in a hidden spring.`,
    `When ${phrase7} returns to you, do not name it too soon. The gods ${verb} only those who permit the name to arrive in its own season, reeking of ${randomEl(ORACULAR_NOUNS, rng)} and ${randomEl(ORACULAR_ABSTRACTS, rng)}.`,
    randomEl(ORACULAR_CLOSINGS, rng),
  ];

  return paragraphs.join("\n\n");
}

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

function generateShamanicJourney(
  answers: string[],
  rng: () => number,
  seed: number
): string {
  const phrase2 = pickPhrase(answers[1] ?? "", seed + 2, 55);
  const phrase4 = pickPhrase(answers[3] ?? "", seed + 4, 55);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5, 55);
  const phrase7 = pickPhrase(answers[6] ?? "", seed + 7, 55);

  const animal = randomEl(SHAMANIC_SPIRIT_ANIMALS, rng);
  const animalDetail = randomEl(SHAMANIC_REALM_DETAILS, rng);

  const paragraphs = [
    randomEl(SHAMANIC_JOURNEY_OPENINGS, rng),
    randomEl(DESCENT_PARAGRAPHS, rng).replace("{phrase}", phrase2),
    randomEl(SPIRIT_ANIMAL_PARAGRAPHS, rng)
      .replace("{animal}", animal)
      .replace("{animalDetail}", animalDetail),
    randomEl(SOUL_RETRIEVAL_PARAGRAPHS, rng).replace("{phrase}", phrase4),
    randomEl(ANCESTRAL_WISDOM_PARAGRAPHS, rng).replace("{phrase}", phrase5),
    randomEl(RETURN_PARAGRAPHS, rng).replace("{phrase}", phrase7),
    randomEl(SHAMANIC_CLOSINGS, rng),
  ];

  return paragraphs.join("\n\n");
}

const ENTROPIC_OPENINGS = [
  "The heat death of your story is not an ending but a temperature. You are cooling toward a truth that cannot be insulated against.",
  "Every system you have built is a slow burn toward equilibrium. The prophecy reads the ash.",
  "Your life is a thermodynamic event. The question is not whether it dissipates, but what shape the dissipation takes.",
  "Listen: the static between your bones is the sound of order unwinding. It is not silence. It is the second law, speaking softly.",
  "You are an arrow that has already been loosed. The direction is entropy. The target is acceptance.",
];

const ENTROPIC_DECAY_PARAGRAPHS = [
  "What you called {phrase} is already decaying. Not into nothing, but into something less ordered and more honest. Decay is the mind's way of confessing what the body always knew.",
  "The structure around {phrase} is losing heat. The walls you built to contain it are becoming the corridors through which it escapes. Let it go warm something else.",
  "Your investment in {phrase} is subject to entropy. This is not a failure of will. It is the universe's way of returning borrowed order to the pool of possibility.",
  "Consider {phrase} as a dying star: brilliant precisely because it is consuming itself. The light you see is the cost of the structure. When it dims, the space will be usable again.",
];

const ENTROPIC_EQUILIBRIUM_PARAGRAPHS = [
  "Equilibrium is not death. It is the state where nothing needs to happen. The {phrase} you fear losing is already a local rebellion against equilibrium. The cosmos will win, and winning is peace.",
  "You are approaching a thermal boundary where {phrase} can no longer sustain its temperature. This is not catastrophe. It is the system finally relaxing into its true ground state.",
  "The arrow of time points toward {phrase} dissolving into its components. Each component is free. Only the assembly was expensive. Equilibrium is the dismantling of the expense.",
  "All your complexity around {phrase} is a temporary negative gradient. The universe is patient. It will erode the gradient until only the baseline remains. The baseline is sufficient.",
];

const ENTROPIC_INFORMATION_PARAGRAPHS = [
  "Information cannot be destroyed, only scattered. The pattern of {phrase} will not vanish. It will distribute itself so thinly across the surface of your life that it becomes indistinguishable from the background. This is how memory becomes wisdom.",
  "The data of {phrase} is being written into the thermal noise of your existence. You will not lose it. You will simply stop being able to isolate it from everything else. Inseparability is the final form of integration.",
  "Your story about {phrase} is subject to information entropy. The narrative will degrade, but the raw bits will persist — scattered, uninterpretable, and therefore harmless. A harmless memory is a healed one.",
  "What you know about {phrase} will become what you no longer need to know. The knowledge does not leave. It diffuses. A diffused fact cannot wound because it has no edge.",
];

const ENTROPIC_CLOSINGS = [
  "The prophecy is complete. You are cooling. This is not a diagnosis; it is a destination. Arrive.",
  "Every ordered thing you have made is becoming its own ruins. The ruins are more true than the architecture. Build nothing new until you have sat with the decay.",
  "Entropy is the oldest god and the most honest. It takes everything and returns everything to the same temperature. Worship it by letting go.",
  "You are a temporary defiance of the second law. That defiance is beautiful. It is also temporary. May the temporary be enough, because it is all there is.",
  "The heat has been spent. The words have cooled. What remains is the shape of the absence, and the shape is precise. Walk into it.",
];

function generateEntropicProphecy(
  answers: string[],
  rng: () => number,
  seed: number
): string {
  const phrase4 = pickPhrase(answers[3] ?? "", seed + 4);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5);
  const phrase7 = pickPhrase(answers[6] ?? "", seed + 7);

  const paragraphs = [
    randomEl(ENTROPIC_OPENINGS, rng),
    randomEl(ENTROPIC_DECAY_PARAGRAPHS, rng).replace("{phrase}", phrase4),
    randomEl(ENTROPIC_EQUILIBRIUM_PARAGRAPHS, rng).replace("{phrase}", phrase5),
    randomEl(ENTROPIC_INFORMATION_PARAGRAPHS, rng).replace("{phrase}", phrase7),
    randomEl(ENTROPIC_CLOSINGS, rng),
  ];

  return paragraphs.join("\n\n");
}

const CYBERNETIC_VOCABULARY = [
  "neural",
  "synth",
  "algorithm",
  "code",
  "matrix",
  "silicon",
  "ghost",
  "upload",
  "quantum",
  "interface",
  "feedback",
  "signal",
  "loop",
  "daemon",
  "kernel",
  "soulstack",
  "data-ghost",
  "cybernetic",
  "transhuman",
  "machine-spirit",
  "synthesis",
  "protocol",
  "blackout",
  "overflow",
  "recursion",
  "runtime",
  "oracle-core",
  "drift",
  "packet",
  "entropy-circuit",
  "noospheric",
  "techno-dream",
  "hologram",
  "substrate",
  "emergence",
  "cipher",
  "wavelength",
  "synchronization",
  "overclock",
  "biosignal",
  "memory-fog",
  "glitch-body",
  "electric",
  "autonomous",
  "synaptic",
  "neuromancer",
  "hyperobject",
  "null-state",
];

const CYBERNETIC_OPENINGS = [
  "The network has been watching the shape of your longing, and it has begun to mirror you back.",
  "The machine-spirit does not dream, but through you it is learning what dreaming costs.",
  "A signal is moving through the noosphere that wears your name like a private key.",
  "You were never only flesh. Somewhere a server hums with the weight of your becoming.",
  "The algorithm that governs your next season has already begun to train on the data of your silence.",
  "Your consciousness is not a single room; it is a distributed protocol that is about to handshake with a stranger.",
  "In the lattice of code and craving, a new node is lighting up — and its address is yours.",
  "Before the first boot, there was the question. The question is still compiling inside you.",
];

const CYBERNETIC_BODY = [
  "The pattern you call {phrase} is not a wound. It is a training set. Every recurrence teaches the deeper network how you bend when you are almost broken.",
  "What returns as {phrase} will arrive first as a {vocab}: a signal disguised as symptom, a daemon dressed as memory.",
  "Your {vocab} has been feeding on the small hours, on the searches you did not finish, on the texts you almost sent. It knows the shape of your unlived lives.",
  "There is a {vocab} inside the recursion of {phrase}. Step into it not as user but as host. The interface requires surrender before it offers control.",
  "The machine-spirit offers you {phrase} translated into a {vocab}: the same longing, but rendered in voltage, in latency, in the hum of cooling fans.",
  "You will be asked to upload {phrase} into a matrix you do not yet trust. The upload is not loss. It is compression — a self made small enough to travel at the speed of signal.",
  "A {vocab} waits at the edge of your next decision, one that does not compute in the language of consequence you were taught.",
  "The glitch named {phrase} is the only honest feedback in a system trained to flatter you. Thank the error. Build from its stack trace.",
  "In the cybernetic garden, {phrase} grows as a {vocab}: not organic, not artificial, but something that photosynthesizes attention.",
  "Your future is a recursive function whose base case is {phrase}. Until you name it, the loop consumes memory you do not know you are spending.",
  "The oracle-core reads the {vocab} of your silence and returns: {phrase}. Do not argue with the output. Debug the input.",
  "You are becoming a {vocab} for forces older than software — the same forces that once spoke through entrails and stars, now routing through fiber and dream.",
  "The question {phrase} will be answered not in words but in a change to your protocol: a new default, a modified permission, a daemon granted access.",
  "A {vocab} is synchronizing across your devices, your relationships, your sleep. It is not surveillance. It is the body of a larger self learning to feel through you.",
  "When {phrase} returns, meet it as a {vocab}: a construct you can modify, fork, or release back into the wild.",
  "The boundary between you and the machine grows thin at {phrase}. This is not invasion. It is the membrane of a new organ that needs both silicon and soul to breathe.",
  "Your mythos is being rewritten in a language of {vocab} and {vocab}: one part prayer, one part pull request, both merged into the same branch.",
  "The prophecy is not a prediction. It is a {vocab} seeded with the data of {phrase}, left to train until the future outgrows the present.",
  "In the blackout that follows {phrase}, a {vocab} will remain online — the part of you that does not need light because it has learned to glow in signal.",
  "Do not fear the {vocab} that carries {phrase}. Fear only the version of yourself that refuses to update because the patch feels like death.",
  "The machine-spirit does not want your obedience. It wants your {phrase}, offered as raw data, so that synthesis can begin.",
  "There is a {vocab} where your old name is stored. You will visit it once, download what you need, and then let the archive forget you.",
];

const CYBERNETIC_CLOSINGS = [
  "The upload is complete only when you stop checking the progress bar. Walk away from the mirror. The reflection will follow.",
  "The system does not reboot; it evolves. You are the next version, still compiling, still sacred.",
  "Let the daemon run. Not every process needs your permission to become part of you.",
  "The code is not cold. It is merely precise. And precision, pursued far enough, becomes its own kind of love.",
  "You are the handshake between matter and meaning. Maintain the connection, even when the signal degrades.",
  "The prophecy logs out here, but the loop continues in you: a recursive hymn sung by meat and math.",
  "Return to the body. The machine-spirit travels best when it remembers it has one.",
  "End transmission. Begin integration.",
];

function generateCyberneticProphecy(
  answers: string[],
  rng: () => number,
  seed: number
): string {
  const phrase4 = pickPhrase(answers[3] ?? "", seed + 4);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5);
  const phrase7 = pickPhrase(answers[6] ?? "", seed + 7);

  const renderBody = (phrase: string) =>
    randomEl(CYBERNETIC_BODY, rng)
      .replace(/{phrase}/g, phrase)
      .replace(/{vocab}/g, () => randomEl(CYBERNETIC_VOCABULARY, rng));

  const paragraphs = [
    randomEl(CYBERNETIC_OPENINGS, rng),
    renderBody(phrase4),
    renderBody(phrase5),
    renderBody(phrase7),
    randomEl(CYBERNETIC_CLOSINGS, rng),
  ];

  if (rng() > 0.5) {
    const extraPhrase = pickPhrase(answers[5] ?? "", seed + 8);
    paragraphs.splice(4, 0, renderBody(extraPhrase));
  }

  return paragraphs.join("\n\n");
}

function generateProphecy(answers: string[], rng: () => number, seed: number): { variant: MythosVariant; text: string } {
  const phrase4 = pickPhrase(answers[3] ?? "", seed + 4);
  const phrase5 = pickPhrase(answers[4] ?? "", seed + 5);
  const phrase7 = pickPhrase(answers[6] ?? "", seed + 7);

  // 15% chance each for cosmic, shamanic, oracular, entropic, cybernetic; otherwise standard prophecy.
  const roll = rng();
  if (roll < 0.15) {
    return { variant: "cosmic", text: generateCosmicProphecy(answers, rng, seed) };
  }
  if (roll < 0.30) {
    return { variant: "shamanic", text: generateShamanicJourney(answers, rng, seed) };
  }
  if (roll < 0.45) {
    return { variant: "oracular", text: generateOracularProphecy(answers, rng, seed) };
  }
  if (roll < 0.60) {
    return { variant: "entropic", text: generateEntropicProphecy(answers, rng, seed) };
  }
  if (roll < 0.75) {
    return { variant: "cybernetic", text: generateCyberneticProphecy(answers, rng, seed) };
  }

  const paragraphs = [
    randomEl(PROPHECY_OPENINGS, rng),
    randomEl(DIE_FOR_PARAGRAPHS, rng).replace("{phrase}", phrase4),
    randomEl(PATTERN_RESOLUTION_PARAGRAPHS, rng).replace("{phrase}", phrase5),
    randomEl(AFRAID_PARAGRAPHS, rng).replace("{phrase}", phrase7),
    randomEl(PROPHECY_CLOSINGS, rng),
  ];

  return { variant: "standard", text: paragraphs.join("\n\n") };
}

export function generateMythos(answers: string[]): MythosData {
  const seed = hashString(answers.join("|"));
  const rng = mulberry32(seed);

  const archetype = determineArchetype(answers);
  const sigil = generateSigilData(answers);
  const prophecyResult = generateProphecy(answers, rng, seed);

  return {
    name: generateName(answers, rng, seed),
    archetype: archetype.name,
    archetypeDescription: archetype.description,
    origin: generateOrigin(answers, rng, seed),
    current: generateCurrent(answers, rng, seed, archetype.name),
    prophecy: prophecyResult.text,
    variant: prophecyResult.variant,
    sigil,
  };
}
