import fs from "node:fs";
import path from "node:path";
import type { CountryData, CountryMeta } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

let cachedIndex: CountryMeta[] | null = null;

/**
 * Single read point for country data. Swap the file reads below for a
 * database query later without touching any component that calls these.
 */
export function getAllCountries(): CountryMeta[] {
  if (cachedIndex) return cachedIndex;
  const raw = fs.readFileSync(path.join(DATA_DIR, "countries.json"), "utf-8");
  cachedIndex = JSON.parse(raw) as CountryMeta[];
  return cachedIndex;
}

export function getCountryCodes(): string[] {
  return getAllCountries().map((c) => c.code);
}

export function getCountryMeta(code: string): CountryMeta | null {
  return getAllCountries().find((c) => c.code === code) ?? null;
}

export function getCountryData(code: string): CountryData | null {
  const filePath = path.join(DATA_DIR, "countries", `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as CountryData;
}
