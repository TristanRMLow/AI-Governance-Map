#!/usr/bin/env node
// Adds a development to a country file the way the data layer expects it:
// inserts newest-first, allocates sequential source ids, bumps the editorial
// lastUpdated, recomputes the cached count/major flags, and syncs the
// countries.json index copy — then runs the validator. One command instead of
// five hand edits, so the index can't silently drift again.
//
// Usage (JSON on stdin — the normal path for scripted/bulk updates):
//   node scripts/add-development.mjs --json <<'EOF'
//   {
//     "country": "uk",
//     "development": {
//       "text": "…",
//       "date": "2026-08-14",
//       "severity": "major",            // optional
//       "eventGroup": "some-slug",      // optional
//       "sourceIds": ["uk-3"]           // optional refs to EXISTING sources
//     },
//     "sources": [                      // optional NEW sources; ids are
//       { "title": "…", "publisher": "…", "url": "https://…",
//         "date": "2026-08-14", "category": "government" }
//     ]
//   }
//   EOF
//
// Or inline flags for a quick single entry:
//   node scripts/add-development.mjs uk --text "…" --date 2026-08-14 \
//     [--severity major] [--event-group slug] [--source-id uk-3]

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const DIR = join(import.meta.dirname, "..", "data", "countries");
const INDEX_PATH = join(import.meta.dirname, "..", "data", "countries.json");

// Mirrors lib/dates.ts sortableDate — month → mid-month, year → year start.
function sortableDate(date) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (/^\d{4}-\d{2}$/.test(date)) return `${date}-15`;
  if (/^\d{4}$/.test(date)) return `${date}-01-01`;
  return date;
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function parseInput(argv) {
  if (argv.includes("--json")) {
    const raw = readFileSync(0, "utf-8");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      die(`stdin is not valid JSON — ${e.message}`);
    }
    if (!parsed.country || !parsed.development) die(`stdin JSON needs "country" and "development"`);
    return { country: parsed.country, development: parsed.development, sources: parsed.sources ?? [] };
  }

  const [country, ...rest] = argv;
  if (!country || country.startsWith("--")) die("first argument must be a country code (or use --json)");
  const development = { sourceIds: [] };
  for (let i = 0; i < rest.length; i += 2) {
    const value = rest[i + 1];
    if (value === undefined) die(`flag ${rest[i]} needs a value`);
    switch (rest[i]) {
      case "--text": development.text = value; break;
      case "--date": development.date = value; break;
      case "--severity": development.severity = value; break;
      case "--event-group": development.eventGroup = value; break;
      case "--source-id": development.sourceIds.push(value); break;
      default: die(`unknown flag ${rest[i]}`);
    }
  }
  return { country, development, sources: [] };
}

const { country, development, sources } = parseInput(process.argv.slice(2));

if (!development.text) die("development.text is required");
if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(development.date ?? "")) {
  die(`development.date "${development.date}" must be YYYY, YYYY-MM, or YYYY-MM-DD`);
}
if (development.severity !== undefined && development.severity !== "major") {
  die(`severity must be "major" or omitted (routine entries carry no severity)`);
}

const filePath = join(DIR, `${country}.json`);
let data;
try {
  data = JSON.parse(readFileSync(filePath, "utf-8"));
} catch {
  die(`no data file for "${country}" at ${filePath}`);
}

// Allocate ids after the highest existing "{code}-N" and append new sources.
const maxId = Math.max(
  0,
  ...data.sources.map((s) => Number(s.id.match(new RegExp(`^${country}-(\\d+)$`))?.[1] ?? 0))
);
const newIds = sources.map((s, i) => `${country}-${maxId + 1 + i}`);
data.sources.push(...sources.map((s, i) => ({ id: newIds[i], ...s })));
development.sourceIds = [...(development.sourceIds ?? []), ...newIds];
if (development.sourceIds.length === 0) {
  die("development needs at least one source (--source-id or a new sources[] entry)");
}

// Insert keeping the file's newest-first convention.
const at = data.recentDevelopments.findIndex(
  (d) => sortableDate(d.date) <= sortableDate(development.date)
);
data.recentDevelopments.splice(at === -1 ? data.recentDevelopments.length : at, 0, development);

data.newDevelopmentsCount = data.recentDevelopments.length;
data.hasMajorUpdate = data.recentDevelopments.some((d) => d.severity === "major");
data.lastUpdated = new Date().toISOString().slice(0, 10);

writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");

// Sync the index copy of the freshness fields.
const index = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
const entry = index.find((e) => e.code === country);
if (!entry) die(`countries.json has no entry for "${country}" — add one first`);
entry.lastUpdated = data.lastUpdated;
entry.newDevelopmentsCount = data.newDevelopmentsCount;
entry.hasMajorUpdate = data.hasMajorUpdate;
entry.debateTopics = data.debateTopics;
writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + "\n");

console.log(
  `✓ ${country}: added ${development.severity === "major" ? "major " : ""}development (${development.date})` +
    (newIds.length ? `, sources ${newIds.join(", ")}` : "")
);

const result = spawnSync("node", [join(import.meta.dirname, "validate-country-data.mjs")], {
  stdio: "inherit",
});
process.exit(result.status ?? 0);
