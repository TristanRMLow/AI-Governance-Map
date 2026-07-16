import { getAllCountries, getCountryData } from "./getCountryData";
import { CROSS_BORDER_OVERRIDES, type SearchEntry, type SearchEntryType } from "./searchTypes";

export function getSearchIndex(): SearchEntry[] {
  const countries = getAllCountries();
  const entries: SearchEntry[] = [];
  const debateBuckets = new Map<string, { codes: Set<string>; iso3: Set<string> }>();

  for (const meta of countries) {
    const data = getCountryData(meta.code);
    if (!data) continue;

    const addEntry = (label: string, type: SearchEntryType, aliases: string[] = []) => {
      const override = CROSS_BORDER_OVERRIDES[label.toLowerCase()] ?? [];
      const highlightIso3 = Array.from(new Set([...meta.isoA3, ...override]));
      for (const l of [label, ...aliases]) {
        entries.push({
          id: `${type}-${meta.code}-${l}`,
          label: l,
          type,
          dashboardCountries: [meta.code],
          highlightIso3,
        });
      }
    };

    for (const c of data.companies) addEntry(c.name, "company");
    for (const c of data.cloudInfrastructure.providers) addEntry(c.name, "company");
    for (const i of [...data.governmentInstitutions, ...data.universities, ...data.thinkTanks]) {
      addEntry(i.name, "institution", i.aliases ?? []);
    }
    for (const p of data.keyPeople) addEntry(p.name, "person");
    for (const p of data.peopleToFollow) addEntry(p.name, "person");
    for (const item of data.policyAndRegulation) addEntry(item.title, "legislation");

    for (const d of data.debates) {
      const key = d.topic.toLowerCase();
      if (!debateBuckets.has(key)) {
        debateBuckets.set(key, { codes: new Set(), iso3: new Set() });
      }
      const bucket = debateBuckets.get(key)!;
      bucket.codes.add(meta.code);
      for (const iso of meta.isoA3) bucket.iso3.add(iso);
    }
  }

  for (const [topic, bucket] of debateBuckets.entries()) {
    entries.push({
      id: `debate-${topic}`,
      label: topic,
      type: "debate",
      dashboardCountries: Array.from(bucket.codes),
      highlightIso3: Array.from(bucket.iso3),
    });
  }

  return entries;
}
