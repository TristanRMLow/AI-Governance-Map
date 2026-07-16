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
