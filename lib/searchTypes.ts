export type SearchEntryType = "company" | "institution" | "person" | "debate" | "legislation";

export interface SearchEntry {
  id: string;
  label: string;
  type: SearchEntryType;
  dashboardCountries: string[];
  highlightIso3: string[];
}

/**
 * Hand-curated cross-border links that can't be derived from a single
 * country's data — e.g. NVIDIA is a US company, but its leading-edge chips
 * are fabricated in Taiwan, so the two jurisdictions are meaningfully linked.
 */
export const CROSS_BORDER_OVERRIDES: Record<string, string[]> = {
  nvidia: ["TWN"],
  arm: ["TWN"],
  tsmc: ["TWN"],
};

/**
 * Representative centre points for iso3 codes that appear via
 * CROSS_BORDER_OVERRIDES but aren't one of the dashboard countries — so the
 * map can fly to a sensible point rather than the country's full polygon
 * extent (which, e.g. for the US, spans Alaska to Florida).
 */
export const TERRITORY_CENTERS: Record<string, [number, number]> = {
  TWN: [121, 23.7],
};
