import { MythosResult } from "@/lib/types";

const STOPWORDS = new Set([
  "the", "and", "is", "a", "to", "i", "you", "it", "that", "of", "in", "my", "me",
  "was", "for", "with", "but", "not", "have", "be", "this", "they", "he", "she",
  "we", "do", "from", "would", "could", "should", "what", "most", "afraid", "an",
  "are", "am", "were", "been", "being", "had", "has", "did", "does", "will",
  "shall", "may", "might", "can", "about", "into", "through", "during", "before",
  "after", "above", "below", "between", "under", "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
  "few", "more", "most", "other", "some", "such", "no", "nor", "only", "own",
  "same", "so", "than", "too", "very", "just", "now", "oh", "um", "uh",
]);

const FALLBACK_WORD_BANK = [
  "Ember", "Vessel", "Threshold", "Obsidian", "Fathom", "Kindling", "Cipher",
  "Abyss", "Hymn", "Needle", "Wound", "Drift", "Orison", "Loom", "Tide",
  "Hollow", "Volt", "Requiem", "Suture", "Fable",
];

const ARCHETYPES = [
  "The Alchemist", "The Wanderer", "The Oracle", "The Exile", "The Catalyst",
  "The Sentinel", "The Architect", "The Voidwalker", "The Forge", "The Cartographer",
  "The Hierophant", "The Heretic", "The Liminal", "The Vessel", "The Threshold",
  "The Remnant", "The Anchorite", "The Torchbearer",
];

const NAME_TEMPLATES = [
  "The {W} of {W2}",
  "{W} of the {W2}",
  "The {W}",
  "Keeper of {W}",
  "The {W} {W2}",
  "Architect of {W}",
  "The Silent {W}",
  "{W} in {W2}",
  "Heir to the {W}",
  "The {W} Ascending",
  "The Fractured {W}",
  "{W} at the Threshold",
];

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash >>> 0;
}

function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function cleanText(text: string | undefined): string {
  if (!text) return "";
  return text.trim();
}

function paraphrase(text: string, fallback: string): string {
  const t = cleanText(text);
  if (!t) return fallback;
  if (t.length <= 80) return t;
  const cut = t.slice(0, t.indexOf(".", 60) + 1 || t.indexOf(",", 60) + 1 || 80).trim();
  return cut || t.slice(0, 80);
}

function quoteOrParaphrase(text: string, fallback: string): string {
  const t = cleanText(text);
  if (!t) return fallback;
  if (t.length <= 60 && !t.includes(".")) return `"${t}"`;
  return paraphrase(t, fallback);
}

function pick<T>(arr: T[], hash: number, index: number): T {
  return arr[(hash + index * 31) % arr.length];
}

function buildName(words: string[], hash: number): string {
  if (words.length === 0) {
    const w1 = pick(FALLBACK_WORD_BANK, hash, 0);
    const w2 = pick(FALLBACK_WORD_BANK, hash, 1);
    return pick(NAME_TEMPLATES, hash, 2)
      .replace("{W}", w1)
      .replace("{W2}", w2);
  }

  const sorted = [...words].sort((a, b) => b.length - a.length || a.localeCompare(b));
  const w1 = titleCase(sorted[0]);
  const w2 = titleCase(sorted[1] ?? pick(FALLBACK_WORD_BANK, hash, 3));
  const template = pick(NAME_TEMPLATES, hash, 4);
  return template.replace("{W}", w1).replace("{W2}", w2);
}

function extractEvocativeWords(answers: string[]): string[] {
  const all = answers
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return all;
}

function originChapter(answers: string[], hash: number): string {
  const a0 = quoteOrParaphrase(answers[0], "an unspoken thing");
  const a4 = quoteOrParaphrase(answers[4], "a silence you have carried");

  const templates = [
    `Before the pattern, there was the impulse. Your story begins not with your birth, but with the first time you chose differently than expected. Long before the world named you, there was a moment — ${a0} — that carved the first groove into who you would become. The pattern you later recognized, ${a4}, was already forming in that earliest light: a seed of fire buried beneath the silence of becoming.`,

    `There is a memory that precedes language. In the dark before names, you felt something take root: ${a0}. It did not ask permission. It simply arrived, like weather, and rearranged the furniture of your soul. From that moment, the pattern of ${a4} began to write itself across the years in invisible ink. You have been reading it ever since, sometimes with wonder, sometimes with grief.`,

    `Your origin is not a place but a threshold. On one side stood the child you were; on the other, the figure shaped by ${a0}. That moment did not end. It extended itself into habit, into instinct, into the repeating architecture of ${a4}. What looked like fate was, at first, only a small door you walked through without knowing it would become the corridor of your life.`,

    `Long before the world named you, there was a moment — ${a0} — that carved the first groove into who you would become. It was quiet, almost accidental, yet it set the tone of everything after. The pattern of ${a4} did not begin as a burden. It began as a solution: the shape you learned to fold yourself into so the world would not break you.`,

    `Every myth has a hidden root. Yours grows from ${a0}, a memory that glows in the dark of your history like a coal that refuses to cool. From that heat came the recurring form of ${a4}, the rhythm you have mistaken for limitation. But it was never a cage. It was the first language your spirit learned to speak.`,

    `The earliest myth is always small enough to fit in a single room. Yours began with ${a0}, a private event that no witness recorded but no time could erase. Out of that seed, the long vine of ${a4} began to climb, wrapping itself around every later season, every attempt at departure, every home you tried to build.`,
  ];

  return pick(templates, hash, 5);
}

function currentChapter(answers: string[], hash: number): string {
  const a1 = quoteOrParaphrase(answers[1], "a silence you have carried");
  const a2 = quoteOrParaphrase(answers[2], "something you would not name");
  const a4 = quoteOrParaphrase(answers[4], "the pattern");

  const templates = [
    `You are in the chapter of the Refiner's Fire. Everything that is not essential is being burned away. This is not destruction — this is revelation. What you fear most, ${a1}, has become the lens through which your love, ${a2}, is finally being recognized. The pattern of ${a4} is no longer a trap. It is the furnace in which the real metal of your life is separating from the slag.`,

    `The present is a narrow bridge. Below it moves the dark water of ${a1}; above it burns the cold star of ${a2}. You have walked this span many times before, always disguised as ${a4}, but now the bridge itself is becoming visible. You are not crossing the same river twice — you are the river, learning to name its own current.`,

    `You stand at the hinge of two worlds: the one you were taught to survive, and the one your love, ${a2}, insists is possible. The fear you carry — ${a1} — is not an enemy. It is the shadow cast by a light you have not yet agreed to step into. And still the pattern repeats: ${a4}, a drum calling you toward the one decision you keep postponing.`,

    `This chapter asks you to hold contradictions without collapsing them. You love ${a2} with a fierceness that frightens you, and you fear ${a1} with a tenderness that proves how much is at stake. The recurring shape of ${a4} is neither accident nor punishment. It is the exact shape of the lesson you are still refusing to graduate from.`,

    `There is a weight in your chest that has two names. One is ${a1}, and the other is ${a2}. They are not opposites. They are the two wings of the same bird, and the pattern of ${a4} is the wind that keeps forcing you to learn how to fly. Right now, in this chapter, you are no longer the fledgling. You are the storm learning to choose its own direction.`,

    `What burns in you now is not new. It is the old fire of ${a2}, meeting the old fear of ${a1}, in the same room you keep entering, again and again, as ${a4}. The difference is that this time you have noticed the door. The difference is that this time, the fear is not louder than your own voice.`,
  ];

  return pick(templates, hash, 6);
}

function prophecyChapter(answers: string[], hash: number): string {
  const a3 = quoteOrParaphrase(answers[3], "what you would die for");
  const a5 = quoteOrParaphrase(answers[5], "a message you still carry");
  const a6 = quoteOrParaphrase(answers[6], "a question you are afraid to answer");

  const templates = [
    `The pattern you have been repeating is about to break. Not because you will finally solve it, but because you will finally outgrow it. The thing you would die for, ${a3}, is the compass that will guide you through the fracture. Speak to the child you were: ${a5}. Let that voice answer the question you have been hiding from — ${a6} — not with words, but with the authority of someone who has survived their own becoming.`,

    `A prophecy is not a fortune; it is a truth wearing tomorrow's clothes. Yours says this: what you would die for, ${a3}, will soon ask you to live for it instead. The words you carry for your younger self — ${a5} — are not a letter to the past. They are instructions from the future. And ${a6} will not be answered; it will be transcended.`,

    `You are approaching the last repetition. The cycle that looked like ${a6} is about to reveal itself as a threshold, not a wall. On the other side stands the consequence of ${a3}, the promise you made before you knew its cost. Take ${a5} with you. It is the only key that fits the lock.`,

    `What you are willing to die for, ${a3}, is writing the final draft of your life. It does not ask for martyrdom. It asks for alignment. The message you hold for the child — ${a5} — is the password you will whisper to yourself at the moment of decision. And ${a6} is not a trap. It is the door that only opens from the inside.`,

    `The prophecy is not written in stars but in repetition. Each return of ${a6} has been a rehearsal for this one departure. You will choose ${a3} not in a single dramatic hour, but in a thousand small refusals to betray it. And the voice that speaks ${a5} will become the voice you use to name the rest of your life.`,

    `Soon you will be asked to cross a line that has no map. You will carry ${a3} in your left hand and ${a5} in your right. The question ${a6} will walk beside you like a wolf you have stopped running from. Do not try to tame it. Let it lead you into the territory where the old myth ends and the new one begins.`,
  ];

  return pick(templates, hash, 7);
}

export function generateMythos(answers: string[]): MythosResult {
  const safe = Array.isArray(answers) ? answers.map((a) => cleanText(a)) : [];
  const padded = [...safe];
  while (padded.length < 7) padded.push("");

  const hash = djb2(padded.join("|"));
  const seed = hash.toString(36);

  const words = extractEvocativeWords(padded);
  const name = buildName(words, hash);
  const archetype = pick(ARCHETYPES, hash, 8);
  const origin = originChapter(padded, hash);
  const current = currentChapter(padded, hash);
  const prophecy = prophecyChapter(padded, hash);

  return {
    name,
    archetype,
    origin,
    current,
    prophecy,
    answers: padded.slice(0, 7),
    seed,
  };
}

export function encodeAnswers(answers: string[]): string {
  try {
    const json = JSON.stringify(answers);
    return btoa(json)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

export function decodeAnswers(data: string): string[] {
  try {
    const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===";
    const base64 = padded.slice(0, Math.ceil(padded.length / 4) * 4);
    const json = atob(base64);
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => (typeof item === "string" ? item : ""));
    }
    return [];
  } catch {
    return [];
  }
}
