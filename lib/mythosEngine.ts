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
  "Hollow", "Volt", "Requiem", "Suture", "Fable", "Cinder", "Pilgrim",
  "Tremor", "Lantern", "Eidolon", "Shroud", "Bracken", "Sigil", "Gulf",
  "Severance", "Monolith", "Harrow", "Tremor", "Aurora", "Fossil", "Magnet",
  "Ritual", "Hearth", "Nebula", "Ritual", "Husk", "Nocturne", "Index",
  "Cipher", "Harrow", "Lantern", "Rift", "Pylon", "Orbit", "Fissure",
];

const ARCHETYPES = [
  "The Alchemist", "The Wanderer", "The Oracle", "The Exile", "The Catalyst",
  "The Sentinel", "The Architect", "The Voidwalker", "The Forge", "The Cartographer",
  "The Hierophant", "The Heretic", "The Liminal", "The Vessel", "The Threshold",
  "The Remnant", "The Anchorite", "The Torchbearer", "The Voidweaver", "The Bone Reader",
  "The Glass Mountain", "The Last Signal", "The Undercurrent", "The Stormwright",
  "The Ash Cartographer", "The Silence Keeper", "The Dreamforge", "The Hollow Crown",
  "The Tidebreaker", "The Signal Ghost", "The Vessel Keeper", "The Ember Prophet",
  "The Null Architect", "The Wound Weaver", "The Last Frequency",
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
  "The {W} Unraveled",
  "{W} under {W2}",
  "The Last {W}",
  "{W} beyond {W2}",
  "The {W} of No Stars",
  "{W} before {W2}",
  "The Unnamed {W}",
  "Herald of the {W}",
  "The {W} Yet to Burn",
  "The Collapsing {W}",
  "{W} against {W2}",
  "The {W} of Drowned Hours",
  "{W} beneath the {W2}",
  "The {W} in Static",
  "The {W} of Broken Seasons",
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

    `In the beginning was a sound: ${a0}. Not loud, but permanent — a frequency that tuned every instrument of your becoming. The pattern of ${a4} was the echo of that sound, returning through the canyon years, sometimes disguised as disaster, sometimes as desire. You are still listening for the note that will release it.`,

    `You were not born into myth; you were smuggled into it. ${a0} was the first contraband you carried across the border of childhood, and ${a4} was the customs stamp that followed you ever after. The world never asked what you were bringing with you. It assumed you were empty. It was wrong.`,

    `Some origins are carved in water, not stone. Yours took the shape of ${a0}, a moment so fluid it seemed to disappear the moment it happened. But water remembers. The pattern of ${a4} is the current that formed around you, slowly wearing its channel through everything resistant in your life.`,

    `There was a winter in you before any of the seasons had names. In that winter, ${a0} was the first spark — small, orange, unforgivably hopeful. The pattern of ${a4} grew around it like ice around a lantern: beautiful, repeating, cold enough to preserve the flame forever if you do not break it open.`,

    `You began as a question no one thought to ask. ${a0} was the first answer you gave yourself, spoken in the secret dialect of a child who already knew too much. The pattern of ${a4} is the echo of that answer, still bouncing, still unfinished, still waiting for the syllable that will end the sentence.`,
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

    `You are standing in the aftermath of a choice you have not yet admitted you made. The love you carry, ${a2}, is pulling you toward an opening; the fear, ${a1}, is begging you to call it a wall. The pattern of ${a4} is the architecture of that hesitation — beautiful, repeating, entirely of your own design.`,

    `This is the season of the unsaid. Around you, everything that can be spoken has been spoken, and what remains — ${a1} and ${a2} — moves in silence like two currents beneath a frozen lake. The pattern of ${a4} is the crack in the ice. It will not hold much longer. Something wants to breathe.`,

    `You are mid-transit between the person you were praised for being and the self that loves ${a2} without apology. ${a1} is the toll booth you keep circling, convinced you must pay again. The pattern of ${a4} is not the road. It is the rearview mirror showing you that you have already passed this exit a hundred times.`,

    `In the current chapter, even your strengths are asking to be re-examined. The love that defines you, ${a2}, has worn the same armor for too long. The fear, ${a1}, has learned your passwords. The pattern of ${a4} keeps returning because it is not a test to pass but a vow to renew — one you are finally strong enough to read aloud.`,

    `You are no longer at the beginning, and that is its own kind of grief. ${a2} is what you have built; ${a1} is what you are afraid will undo it. The pattern of ${a4} arrives now not as a warning but as a witness — evidence that you have survived long enough to recognize the shape of your own devotion.`,
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

    `What waits for you is not a reward. It is a reckoning with ${a3}, the promise you keep making in your sleep. ${a6} will arrive as a silence first, then as a voice, then as a door. ${a5} is the only passphrase you will need — say it not with courage, but with accuracy.`,

    `You are being called to a smaller life, not a larger one. A life shaped by ${a3} and lit by ${a5}. The question ${a6} will lose its teeth when you stop answering it and start wearing it. The future is not ahead of you. It is inside the present, folded tight as a letter you are finally allowed to open.`,

    `The next phase does not promise peace. It promises alignment: your daily choices finally agreeing with ${a3}. The child you were still speaks in ${a5}, and the adult you are becoming is learning to listen. ${a6} is not a riddle to solve. It is a flame to carry without dropping.`,

    `A door is being constructed from the materials of ${a6}. On the other side, ${a3} is waiting in its true form — not as sacrifice, but as vocation. You will cross not because you are ready, but because ${a5} has made you refuse to stay. The prophecy is brief: leave before the room learns your name by heart.`,

    `The myth you are becoming will require you to outlive several versions of yourself. ${a6} is the first ghost to forgive. ${a3} is the second spine to grow. ${a5} is the only song the child recognizes — sing it once, and the rest of the future begins to hum in the same key.`,
  ];

  return pick(templates, hash, 7);
}

function doomChapter(answers: string[], hash: number): string {
  const a3 = quoteOrParaphrase(answers[3], "what you would die for");
  const a5 = quoteOrParaphrase(answers[5], "a message you still carry");
  const a6 = quoteOrParaphrase(answers[6], "a question you are afraid to answer");

  const templates = [
    `A shadow is moving across the pattern. The thing you swore you would die for, ${a3}, has begun to ask for a death smaller and slower than you imagined — the death of the self that promised. ${a6} will not be answered; it will be burned. And ${a5}, the words you carried like a lantern, will gutter out unless you find new fuel. The prophecy is not gentle. It says: what refuses to change will be unmade.`,

    `There is a door at the end of ${a6}, and it opens inward. What waits behind it does not forgive hesitation. You have kept ${a3} as a keepsake, but the keep is crumbling. The voice of ${a5} grows thin with distance. Soon you will have to choose between the myth you have told and the life that remains after the telling. The doom is this: either choice costs more than you were prepared to pay.`,

    `The pattern is no longer repeating. It is tightening. ${a3}, which once felt like the brightest star in your constellation, is now a collapsing light. ${a6} is the gravity pulling everything toward a single dark point. Only ${a5} can slow the fall — not by saving you, but by giving you something true to say on the way down.`,

    `A drought is coming to the country of ${a3}. The rivers there have always been fed by denial, and the denial is running out. ${a6} stands at the border like a customs officer who does not accept apologies. You may carry ${a5} across, but only if you leave the rest behind. The doom is not the drought. The doom is your refusal to believe in thirst.`,

    `What you would die for, ${a3}, has begun to die for you first — slowly, in your place, while you watch from the doorway of ${a6}. This is the worst kind of mercy: it gives you time to understand the cost. ${a5} is the last letter from a place you can no longer return to. Read it once. Then let the fire take what the fire needs.`,

    `The prophecy arrives as a static hiss between stations. In it, ${a6} repeats until it is no longer a question but a verdict. ${a3} is the voltage that will pass through you whether you consent or not. And ${a5} — the tender instruction you gave your younger self — is now the warning they are giving back. The doom is not destruction. It is recognition, arriving too late to be kind.`,
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
    doom: doomChapter(padded, hash),
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
