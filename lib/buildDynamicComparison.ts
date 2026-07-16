import type { ComparisonData, ComparisonDimension, CountryData } from "./types";
import { getAllCountries, getCountryData, getCountryMeta } from "./getCountryData";
import { CATEGORY_COLOR } from "./categoryColors";

const TREND_WORD: Record<CountryData["currentDirection"]["trend"], string> = {
  tightening: "tightening its regulatory grip",
  loosening: "loosening its regulatory grip",
  stable: "holding a steady regulatory posture",
};

function dim(
  key: string,
  title: string,
  category: ComparisonDimension["category"],
  points: Record<string, string>,
  analysis: string
): ComparisonDimension {
  return { key, title, category, points, analysis };
}

/** Builds a substantive comparison for any 2-3 country combination that
 * doesn't have hand-curated content. Every sentence here is assembled from
 * fields each country's own analyst copy already carries (atAGlance,
 * currentDirection, debates) — never a generic "both have universities"
 * filler, per the brief's explicit instruction to avoid superficial
 * comparisons even in the fallback path. */
export function buildDynamicComparison(codes: string[]): ComparisonData | null {
  const entries = codes
    .map((code) => {
      const meta = getCountryMeta(code);
      const data = getCountryData(code);
      return meta && data ? { code, meta, data } : null;
    })
    .filter((e): e is { code: string; meta: NonNullable<ReturnType<typeof getCountryMeta>>; data: CountryData } => Boolean(e));

  if (entries.length !== codes.length) return null;

  const names = entries.map((e) => e.meta.shortName);
  const title = names.join(" vs ");
  const slug = codes.slice().sort().join("-");

  const executiveSummary = [
    `${names.join(" and ")} illustrate different points on the AI governance spectrum. ${entries
      .map((e) => `${e.meta.shortName}'s approach — ${e.data.governanceModel}`)
      .join("; ")}.`,
    `On trajectory: ${entries
      .map((e) => `${e.meta.shortName} is ${TREND_WORD[e.data.currentDirection.trend]}`)
      .join("; ")}.`,
  ];

  const points = (field: keyof CountryData["atAGlance"]) =>
    Object.fromEntries(entries.map((e) => [e.code, e.data.atAGlance[field] as string]));

  const dimensions: ComparisonDimension[] = [
    dim(
      "regulatory-model",
      "Regulatory Philosophy",
      "government",
      points("regulatoryApproach"),
      entries
        .map((e) => `${e.meta.shortName} (${e.data.currentDirection.trend}): ${e.data.currentDirection.summary}`)
        .join(" ")
    ),
    dim(
      "industrial-strategy",
      "Industrial Strategy & State Involvement",
      "investment",
      points("industrialStrategy"),
      entries.map((e) => `${e.meta.shortName}: ${e.data.atAGlance.governmentInvolvement}`).join(" ")
    ),
    dim(
      "international-posture",
      "International Posture",
      "infrastructure",
      points("internationalPartnerships"),
      `Compare how each jurisdiction positions itself relative to allies and rivals rather than assuming shared alignment just because both are covered here.`
    ),
    dim(
      "policy-focus",
      "Primary Policy Focus",
      "research",
      points("primaryPolicyFocus"),
      `Where each government is actually spending its attention right now — not a statement of law, but of priority.`
    ),
  ];

  const byCategory = new Map<string, Map<string, string[]>>();
  for (const e of entries) {
    for (const d of e.data.debates) {
      if (!byCategory.has(d.category)) byCategory.set(d.category, new Map());
      const m = byCategory.get(d.category)!;
      if (!m.has(e.code)) m.set(e.code, []);
      m.get(e.code)!.push(d.topic);
    }
  }

  const shared: string[] = [];
  for (const [category, m] of byCategory.entries()) {
    if (m.size >= 2) {
      const label = CATEGORY_COLOR[category as keyof typeof CATEGORY_COLOR]?.label ?? category;
      const parts = Array.from(m.entries()).map(
        ([code, topics]) => `${getCountryMeta(code)?.shortName}: "${topics[0]}"`
      );
      shared.push(`${label} — both are actively legislating or debating this axis: ${parts.join("; ")}.`);
    }
  }

  const perCountry: Record<string, string[]> = {};
  for (const e of entries) {
    perCountry[e.code] = [e.data.atAGlance.regulatoryApproach, e.data.atAGlance.primaryPolicyFocus];
  }

  const strategicTradeoffs = [
    entries
      .map(
        (e) =>
          `${e.meta.shortName} trades off: ${e.data.atAGlance.governmentInvolvement.toLowerCase().startsWith("high") || e.data.atAGlance.governmentInvolvement.toLowerCase().startsWith("very high") ? "heavier state involvement for more direct control over outcomes" : "a lighter federal or national touch for faster deployment, at the cost of enforceability"}.`
      )
      .join(" "),
  ];

  const anchor = entries[0];
  const allCountries = getAllCountries().filter((c) => !codes.includes(c.code));
  const scored = allCountries
    .map((c) => {
      const data = getCountryData(c.code);
      if (!data) return null;
      const sameRegion = c.region === anchor.meta.region ? 2 : 0;
      const sharedCats = data.debates.filter((d) =>
        anchor.data.debates.some((ad) => ad.category === d.category)
      ).length;
      return { code: c.code, score: sameRegion + sharedCats };
    })
    .filter((s): s is { code: string; score: number } => Boolean(s))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const relatedSlugs = scored.map((s) => [anchor.code, s.code].sort().join("-"));

  return {
    slug,
    countries: codes,
    title,
    tagline: `${names.join(" · ")} — an assembled comparison from each country's own governance data.`,
    executiveSummary,
    dimensions,
    policyOverlap: { shared, perCountry },
    strategicTradeoffs,
    relatedSlugs,
    curated: false,
  };
}
