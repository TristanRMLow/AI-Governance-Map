import { getAllCountries, getCountryData } from "./getCountryData";
import { sortableDate } from "./dates";
import type { CurrentDirection, Debate, Development, Sentiment, SourceRef, UpcomingMilestone } from "./types";

interface CountryTag {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  region: string;
  accentColor: { light: string; dark: string };
  sources: SourceRef[];
}

export type DevelopmentWithCountry = Development & CountryTag;
export type DebateWithCountry = Debate & CountryTag;
export type UpcomingMilestoneWithCountry = UpcomingMilestone & CountryTag;

/** The last day a milestone date could still refer to — a coarse "2027"
 * stays listed through all of 2027, not just until Jan 1. ("-31" compares
 * correctly as a string bound even for shorter months.) */
function periodEnd(date: string): string {
  if (/^\d{4}$/.test(date)) return `${date}-12-31`;
  if (/^\d{4}-\d{2}$/.test(date)) return `${date}-31`;
  return date;
}

/** Every known future milestone across all countries, soonest first — the
 * forward-looking "Coming up" strip on the Timeline page. Entries whose date
 * has fully passed (relative to build time) are dropped rather than shown stale. */
export function getAllUpcomingMilestones(): UpcomingMilestoneWithCountry[] {
  const today = new Date().toISOString().slice(0, 10);
  const all: UpcomingMilestoneWithCountry[] = [];
  for (const meta of getAllCountries()) {
    const data = getCountryData(meta.code);
    if (!data?.upcomingMilestones) continue;
    const tag: CountryTag = {
      countryCode: meta.code,
      countryName: meta.name,
      flagEmoji: meta.flagEmoji,
      region: meta.region,
      accentColor: meta.accentColor,
      sources: data.sources,
    };
    for (const m of data.upcomingMilestones) {
      if (periodEnd(m.date) >= today) all.push({ ...m, ...tag });
    }
  }
  // Sort by period END: a coarse "2026" means "by end of 2026", so it belongs
  // after October's dated deadlines, not at the top of the year.
  return all.sort((a, b) => periodEnd(a.date).localeCompare(periodEnd(b.date)));
}

/** Every recentDevelopments entry across every country, tagged with its
 * source jurisdiction and sorted most-recent-first. Powers the global
 * Timeline page and the RSS feed — the two "push" surfaces the homepage
 * itself can't offer since it's scoped to one country/comparison at a time. */
export function getAllDevelopments(): DevelopmentWithCountry[] {
  const all: DevelopmentWithCountry[] = [];
  for (const meta of getAllCountries()) {
    const data = getCountryData(meta.code);
    if (!data) continue;
    const tag: CountryTag = {
      countryCode: meta.code,
      countryName: meta.name,
      flagEmoji: meta.flagEmoji,
      region: meta.region,
      accentColor: meta.accentColor,
      sources: data.sources,
    };
    for (const dev of data.recentDevelopments) all.push({ ...dev, ...tag });
  }
  return all.sort((a, b) => sortableDate(b.date).localeCompare(sortableDate(a.date)));
}

export interface MatrixRow {
  code: string;
  name: string;
  flagEmoji: string;
  region: string;
  accentColor: { light: string; dark: string };
  policyDirection: { label: string; sentiment: Sentiment };
  trend: CurrentDirection["trend"];
  regulatoryApproach: string;
  /** Counts of tracked policyAndRegulation items by status. Deliberately NOT
   * collapsed into a single "has binding law" verdict — the tracked
   * instruments mix legislation, strategies and voluntary codes, so counts
   * are the honest summary; the country page has the detail. */
  instruments: { inForce: number; passed: number; proposed: number };
  frontierDeveloper: "domestic" | "emerging" | "none" | null;
  latestDevelopmentDate: string | null;
}

/** One row per jurisdiction, entirely from structured fields — powers the
 * cross-country status matrix ("who stands where" without opening 59 pages). */
export function getMatrixRows(): MatrixRow[] {
  const rows: MatrixRow[] = [];
  for (const meta of getAllCountries()) {
    const data = getCountryData(meta.code);
    if (!data) continue;
    const instruments = { inForce: 0, passed: 0, proposed: 0 };
    for (const p of data.policyAndRegulation) {
      if (p.status === "in_force") instruments.inForce++;
      else if (p.status === "passed") instruments.passed++;
      else if (p.status === "proposed") instruments.proposed++;
    }
    rows.push({
      code: meta.code,
      name: meta.name,
      flagEmoji: meta.flagEmoji,
      region: meta.region,
      accentColor: meta.accentColor,
      policyDirection: data.atAGlance.policyDirection,
      trend: data.currentDirection.trend,
      regulatoryApproach: data.atAGlance.regulatoryApproach,
      instruments,
      frontierDeveloper: data.computeFrontier?.frontierDeveloper ?? null,
      latestDevelopmentDate: data.latestDevelopmentDate,
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

/** Every debate across every country, tagged with its source jurisdiction —
 * powers the Topics page's cross-country, category-filterable browser. */
export function getAllDebatesWithCountry(): DebateWithCountry[] {
  const all: DebateWithCountry[] = [];
  for (const meta of getAllCountries()) {
    const data = getCountryData(meta.code);
    if (!data) continue;
    const tag: CountryTag = {
      countryCode: meta.code,
      countryName: meta.name,
      flagEmoji: meta.flagEmoji,
      region: meta.region,
      accentColor: meta.accentColor,
      sources: data.sources,
    };
    for (const debate of data.debates) all.push({ ...debate, ...tag });
  }
  return all;
}
