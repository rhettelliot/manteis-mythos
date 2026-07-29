import type { MythosData, StoredMythos } from "./types";

const STORAGE_KEY = "manteis-mythos";

export function saveMythos(data: { mythos: MythosData; answers: string[] }): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredMythos = {
      mythos: data.mythos,
      answers: data.answers,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // SSR or storage disabled; fail silently.
  }
}

export function loadMythos(): { mythos: MythosData; answers: string[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredMythos;
    if (!parsed?.mythos || !Array.isArray(parsed.answers)) return null;
    return { mythos: parsed.mythos, answers: parsed.answers };
  } catch {
    return null;
  }
}

export function clearMythos(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // SSR or storage disabled; fail silently.
  }
}
