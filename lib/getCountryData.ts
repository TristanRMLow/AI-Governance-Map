import fs from "node:fs";
import path from "node:path";
import type { CountryData, CountryMeta } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

let cachedIndex: CountryMeta[] | null = null;

function readCountryFile(code: string): CountryData | null {
  const filePath = path.join(DATA_DIR, "countries", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as CountryData;
}

/**
 * Single read point for country data. Swap the file reads below for a
 * database query later without touching any component that calls these.
 *
 * `countries.json` is a hand-maintained index of design/identity fields
 * (colors, geometry, region, etc.) that rarely change. Its freshness fields
 * (lastUpdated, newDevelopmentsCount, hasMajorUpdate, debateTopics) are NOT
 * trusted as-is — they're overlaid here from each country's own detail file,
 * since that's the file actually edited when content changes, and nothing
 * enforced keeping the index copy in sync (it silently drifted stale for
 * every country in the original 20-country audit).
 */
export function getAllCountries(): CountryMeta[] {
  if (cachedIndex) return cachedIndex;
  const raw = fs.readFileSync(path.join(DATA_DIR, "countries.json"), "utf-8");
  const index = JSON.parse(raw) as CountryMeta[];
  cachedIndex = index.map((meta) => {
    const full = readCountryFile(meta.code);
    if (!full) return meta;
    return {
      ...meta,
      lastUpdated: full.lastUpdated,
      newDevelopmentsCount: full.newDevelopmentsCount,
      hasMajorUpdate: full.hasMajorUpdate,
      debateTopics: full.debateTopics,
    };
  });
  return cachedIndex;
}

export function getCountryCodes(): string[] {
  return getAllCountries().map((c) => c.code);
}

export function getCountryMeta(code: string): CountryMeta | null {
  return getAllCountries().find((c) => c.code === code) ?? null;
}

export function getCountryData(code: string): CountryData | null {
  return readCountryFile(code);
}
