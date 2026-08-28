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

/** Relative time at editorial granularity: exact days only while they're
 * meaningful, then weeks, then months — "83 days ago" reads like a log line,
 * "3 months ago" like a briefing. Accepts any precision sortableDate does;
 * future dates clamp to "today". */
export function daysAgo(date: string): string {
  const days = Math.max(0, Math.round((Date.now() - new Date(sortableDate(date)).getTime()) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  if (days < 365) return `${Math.round(days / 30.4)} months ago`;
  return "over a year ago";
}

function isWithinDays(date: string, days: number): boolean {
  const elapsed = Date.now() - new Date(sortableDate(date)).getTime();
  return elapsed >= 0 && elapsed <= days * 86400000;
}

/** Newest development date overall and newest severity:"major" date, compared
 * via sortableDate but returned at their original precision. Derived at read
 * time in getCountryData.ts — never stored in the JSON, so it can't drift the
 * way the hand-maintained lastUpdated copies did. */
export function deriveLatestDates(developments: { date: string; severity?: "major" }[]): {
  latestDevelopmentDate: string | null;
  latestMajorDate: string | null;
} {
  let latest: string | null = null;
  let latestMajor: string | null = null;
  for (const d of developments) {
    if (!latest || sortableDate(d.date) > sortableDate(latest)) latest = d.date;
    if (d.severity === "major" && (!latestMajor || sortableDate(d.date) > sortableDate(latestMajor))) {
      latestMajor = d.date;
    }
  }
  return { latestDevelopmentDate: latest, latestMajorDate: latestMajor };
}

export const RECENT_WINDOW_DAYS = 30;
export const MAJOR_WINDOW_DAYS = 45;

export type FreshnessState = "major" | "recent" | "stale";

/** Tri-state "has anything changed" signal, cheap enough to run on the
 * lightweight CountryMeta index (map/homepage) as well as full CountryData.
 * Based on when developments actually HAPPENED (event dates), not when the
 * site was edited — a landmark law from January is history, not news, so
 * "major" only holds within its window before decaying to stale. */
export function getFreshnessState(meta: {
  latestDevelopmentDate: string | null;
  latestMajorDate: string | null;
}): FreshnessState {
  if (meta.latestMajorDate && isWithinDays(meta.latestMajorDate, MAJOR_WINDOW_DAYS)) return "major";
  if (meta.latestDevelopmentDate && isWithinDays(meta.latestDevelopmentDate, RECENT_WINDOW_DAYS)) {
    return "recent";
  }
  return "stale";
}

/** Display formatting that honours the date's precision instead of
 * fabricating a day: "2026" → "2026", "2026-08" → "August 2026",
 * "2026-08-15" → "August 15, 2026". */
export function formatEventDate(date: string | null): string | null {
  if (!date) return null;
  if (/^\d{4}$/.test(date)) return date;
  const opts: Intl.DateTimeFormatOptions = /^\d{4}-\d{2}$/.test(date)
    ? { year: "numeric", month: "long" }
    : { year: "numeric", month: "long", day: "numeric" };
  return new Date(sortableDate(date)).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}
