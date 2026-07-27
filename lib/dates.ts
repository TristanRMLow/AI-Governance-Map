/**
 * A string sort key that orders dates correctly regardless of precision.
 *
 * Timeline/RSS sort developments by `date.localeCompare`, but editors write
 * dates at whatever precision they know: "2026-07-26", "2026-07", or "2026".
 * Raw string comparison sinks the imprecise ones ("2026-07" < "2026-07-15"),
 * which silently buries freshly-added entries beneath fully-dated older ones.
 *
 * Resolution is deliberately asymmetric by precision, to match editorial
 * intent rather than blindly float or sink:
 *   - Month precision ("2026-07") → MID-month ("2026-07-15"), the expected
 *     value of an unknown day. This lifts a month-dated item above the early
 *     part of its month (so a freshly added one isn't buried), while still
 *     letting a *known* later day (e.g. "2026-07-21") correctly outrank a
 *     merely "sometime in July" entry. It can never leap out of its month.
 *   - Year precision ("2026") → START of year ("2026-01-01"). A bare year is
 *     too coarse to claim recency — these are almost always vague historical
 *     entries — so it defers below anything dated to a month or day in that
 *     year, sitting at the year's lower boundary.
 * Padding is safe for pure string comparison since "-15"/"-01-01" compare
 * lexically against real "-DD" days exactly as their calendar order implies.
 */
export function sortableDate(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (/^\d{4}-\d{2}$/.test(date)) return `${date}-15`;
  if (/^\d{4}$/.test(date)) return `${date}-01-01`;
  return date;
}

export function daysAgo(iso: string): string {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function isWithinDays(iso: string, days: number): boolean {
  const elapsed = Date.now() - new Date(iso).getTime();
  return elapsed >= 0 && elapsed <= days * 86400000;
}

export type FreshnessState = "major" | "recent" | "stale";

/** Tri-state "has anything changed" signal, cheap enough to run on the
 * lightweight CountryMeta index (map/homepage) as well as full CountryData. */
export function getFreshnessState(meta: {
  lastUpdated: string;
  hasMajorUpdate: boolean;
}): FreshnessState {
  if (meta.hasMajorUpdate) return "major";
  if (isWithinDays(meta.lastUpdated, 30)) return "recent";
  return "stale";
}
