import { getAllCountries, getCountryData } from "./getCountryData";
import type { Debate, Development, SourceRef } from "./types";

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
  return all.sort((a, b) => b.date.localeCompare(a.date));
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
