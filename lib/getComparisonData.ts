import fs from "node:fs";
import path from "node:path";
import type { ComparisonData } from "./types";
import { getCountryData, getCountryMeta } from "./getCountryData";
import { buildDynamicComparison } from "./buildDynamicComparison";

const DATA_DIR = path.join(process.cwd(), "data", "comparisons");

/** Hand-curated, analyst-depth comparisons. Anything not listed here falls
 * back to buildDynamicComparison — see that file for why the fallback is
 * still substantive rather than a spreadsheet of superficial facts. */
export const FLAGSHIP_SLUGS = ["de-fr", "kr-sg", "cn-us", "fr-sg-uk"];

export function canonicalSlug(codes: string[]): string {
  return Array.from(new Set(codes.map((c) => c.trim().toLowerCase())))
    .sort()
    .join("-");
}

function loadCurated(slug: string): ComparisonData | null {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ComparisonData;
}

/** codes.length must be 2 or 3; returns null if any code is unknown or the
 * count is out of range. */
export function getComparison(codes: string[]): ComparisonData | null {
  if (codes.length < 2 || codes.length > 3) return null;
  for (const code of codes) {
    if (!getCountryMeta(code)) return null;
  }
  const slug = canonicalSlug(codes);
  return loadCurated(slug) ?? buildDynamicComparison(slug.split("-"));
}

export function getComparisonBySlug(slug: string): ComparisonData | null {
  const codes = slug.split("-");
  return getComparison(codes);
}

export interface FlagshipSummary {
  slug: string;
  title: string;
  tagline: string;
  countries: string[];
}

export function getFlagshipComparisons(): FlagshipSummary[] {
  return FLAGSHIP_SLUGS.map((slug) => {
    const data = loadCurated(slug);
    if (!data) {
      throw new Error(`Missing curated comparison data for flagship slug "${slug}"`);
    }
    return { slug, title: data.title, tagline: data.tagline, countries: data.countries };
  });
}

/** Convenience re-export so pages don't need two imports for the common
 * "look up a country's name/flag while rendering a comparison" case. */
export { getCountryData, getCountryMeta };
