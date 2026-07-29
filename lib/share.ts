export function generateShareURL(answers: string[]): string {
  const encoded = (() => {
    try {
      return btoa(encodeURIComponent(JSON.stringify(answers)));
    } catch {
      return "";
    }
  })();

  if (typeof window !== "undefined") {
    return `${window.location.origin}${window.location.pathname}#mythos=${encoded}`;
  }

  return `#mythos=${encoded}`;
}

export function decodeShareURL(hash: string): string[] | null {
  const marker = "mythos=";
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!cleaned.startsWith(marker)) return null;

  const payload = cleaned.slice(marker.length);
  if (!payload) return null;

  try {
    const json = decodeURIComponent(atob(payload));
    const answers = JSON.parse(json) as string[];
    if (!Array.isArray(answers)) return null;
    return answers;
  } catch {
    return null;
  }
}
