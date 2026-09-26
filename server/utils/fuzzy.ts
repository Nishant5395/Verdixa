export const normalizeText = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Levenshtein distance that gives up (returns max + 1) once it is clearly too far apart. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, curr[j]);
    }
    if (rowMin > max) return max + 1;
    prev = curr;
  }
  return prev[b.length];
}

/**
 * Scores how well `target` matches `query`. 0 means "no match".
 * Every word of the query has to match some word of the target
 * (exactly, as a prefix, as a substring, or within a small typo distance).
 */
export function scoreMatch(query: string, target: string): number {
  const q = normalizeText(query);
  const t = normalizeText(target);
  if (!q || !t) return 0;
  if (q === t) return 100;
  if (t.startsWith(q)) return 90;

  const targetWords = t.split(" ");
  let total = 0;

  for (const qw of q.split(" ")) {
    let best = 0;
    for (const tw of targetWords) {
      if (tw === qw) best = Math.max(best, 30);
      else if (tw.startsWith(qw)) best = Math.max(best, 25);
      else if (qw.length >= 3 && tw.includes(qw)) best = Math.max(best, 15);
      else if (qw.length >= 3) {
        const max = qw.length <= 4 ? 1 : 2;
        const d = Math.min(distance(qw, tw, max), distance(qw, tw.slice(0, qw.length), max));
        if (d <= max) best = Math.max(best, 12 - d * 3);
      }
    }
    if (best === 0) return 0;
    total += best;
  }

  return total / q.split(" ").length + (t.includes(q) ? 20 : 0);
}
