#!/usr/bin/env node
// Cheap sanity checks over data/countries/*.json — catches the kind of regressions
// (dangling sourceIds, malformed urls, empty sources) that TypeScript's structural
// typing won't, since it only checks shape, not cross-references or content quality.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(import.meta.dirname, "..", "data", "countries");
const INDEX_PATH = join(import.meta.dirname, "..", "data", "countries.json");
const REQUIRED_KEYS = [
  "code", "name", "shortName", "flagEmoji", "geometryType", "isoA3", "region",
  "jurisdictionType", "governanceModel", "accentColor", "center", "zoom",
  "lastUpdated", "newDevelopmentsCount", "hasMajorUpdate", "debateTopics",
  "overview", "atAGlance", "currentDirection", "recentDevelopments",
  "policyAndRegulation", "researchEcosystem", "companies", "cloudInfrastructure",
  "universities", "thinkTanks", "governmentInstitutions", "keyPeople",
  "peopleToFollow", "influenceMap", "notableGaps", "debates", "knowledgeHub", "sources",
];

let errorCount = 0;
function fail(file, msg) {
  errorCount++;
  console.error(`  ✗ ${file}: ${msg}`);
}

function collectSourceIdRefs(data) {
  const refs = [];
  for (const d of data.recentDevelopments ?? []) refs.push(...(d.sourceIds ?? []));
  for (const p of data.policyAndRegulation ?? []) refs.push(...(p.sourceIds ?? []));
  for (const d of data.debates ?? []) refs.push(...(d.sourceIds ?? []));
  refs.push(...(data.researchEcosystem?.sourceIds ?? []));
  return refs;
}

function collectUrls(data) {
  const urls = [];
  const arrays = [
    data.companies, data.cloudInfrastructure?.providers, data.universities,
    data.thinkTanks, data.governmentInstitutions, data.keyPeople,
    data.peopleToFollow, data.knowledgeHub, data.sources, data.policyAndRegulation,
  ];
  for (const arr of arrays ?? []) {
    for (const item of arr ?? []) {
      if (item?.url) urls.push(item.url);
      if (item?.officialUrl) urls.push(item.officialUrl);
    }
  }
  return urls;
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
console.log(`Validating ${files.length} country files...\n`);

for (const file of files) {
  const path = join(DIR, file);
  let data;
  try {
    data = JSON.parse(readFileSync(path, "utf-8"));
  } catch (e) {
    fail(file, `invalid JSON — ${e.message}`);
    continue;
  }

  for (const key of REQUIRED_KEYS) {
    if (!(key in data)) fail(file, `missing required key "${key}"`);
  }

  if (!Array.isArray(data.sources) || data.sources.length === 0) {
    fail(file, `sources array is empty or not an array`);
  }
  const sourceIds = new Set((data.sources ?? []).map((s) => s.id));

  for (const ref of collectSourceIdRefs(data)) {
    if (!sourceIds.has(ref)) fail(file, `dangling sourceId reference "${ref}" — no matching entry in sources[]`);
  }

  for (const url of collectUrls(data)) {
    if (typeof url === "string" && !/^https?:\/\//.test(url)) {
      fail(file, `malformed url "${url}" — should start with http:// or https://`);
    }
  }

  for (const share of data.cloudInfrastructure?.dominance ?? []) {
    if (typeof share.share !== "number" || share.share < 0 || share.share > 100) {
      fail(file, `cloudInfrastructure.dominance entry for "${share.provider}" has an out-of-range share: ${share.share}`);
    }
  }

  if (!Array.isArray(data.notableGaps)) fail(file, `notableGaps must be an array (can be empty)`);

  const actualCount = (data.recentDevelopments ?? []).length;
  if (data.newDevelopmentsCount !== actualCount) {
    fail(file, `newDevelopmentsCount is ${data.newDevelopmentsCount} but recentDevelopments has ${actualCount} entries`);
  }
  const actualMajor = (data.recentDevelopments ?? []).some((d) => d.severity === "major");
  if (data.hasMajorUpdate !== actualMajor) {
    fail(file, `hasMajorUpdate is ${data.hasMajorUpdate} but recentDevelopments ${actualMajor ? "does" : "does not"} contain a "major" severity entry`);
  }
}

// countries.json is a hand-maintained index that duplicates each country's
// freshness fields — getAllCountries() no longer trusts this copy (it
// overlays fresh values from each country's own file at read time), but a
// stale copy here is still confusing to anyone reading the raw file, so
// catch drift at validate time too.
const index = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
for (const entry of index) {
  const filePath = join(DIR, `${entry.code}.json`);
  let full;
  try {
    full = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    fail("countries.json", `index entry "${entry.code}" has no matching data/countries/${entry.code}.json`);
    continue;
  }
  for (const key of ["lastUpdated", "newDevelopmentsCount", "hasMajorUpdate"]) {
    if (JSON.stringify(entry[key]) !== JSON.stringify(full[key])) {
      fail("countries.json", `entry "${entry.code}" has stale ${key} (index: ${JSON.stringify(entry[key])}, file: ${JSON.stringify(full[key])})`);
    }
  }
  if (JSON.stringify(entry.debateTopics) !== JSON.stringify(full.debateTopics)) {
    fail("countries.json", `entry "${entry.code}" has stale debateTopics`);
  }
}

if (errorCount > 0) {
  console.error(`\n${errorCount} issue(s) found.`);
  process.exit(1);
} else {
  console.log(`All ${files.length} country files pass validation.`);
}
