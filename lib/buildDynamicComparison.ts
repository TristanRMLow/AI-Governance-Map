import type { ComparisonData, ComparisonDimension, CountryData, Development, PolicyItem } from "./types";
import { getAllCountries, getCountryData, getCountryMeta } from "./getCountryData";
import { CATEGORY_COLOR } from "./categoryColors";

const TREND_WORD: Record<CountryData["currentDirection"]["trend"], string> = {
  tightening: "tightening its regulatory grip",
  loosening: "loosening its regulatory grip",
  stable: "holding a steady regulatory posture",
};

const STATUS_RANK: Record<PolicyItem["status"], number> = {
  in_force: 0,
  passed: 1,
  proposed: 2,
  repealed: 3,
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

/** First sentence (or a ~140-char clause at a word boundary) of a longer
 * field, so quoted country-copy stays a phrase rather than a full paragraph
 * dumped into a comparison card. */
function firstClause(text: string, maxLen = 140): string {
  const firstSentence = text.match(/^[^.!?]+[.!?](?!\d)/)?.[0]?.trim();
  const candidate = firstSentence && firstSentence.length <= maxLen ? firstSentence : text;
  if (candidate.length <= maxLen) return candidate;
  const cut = candidate.slice(0, maxLen);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** Most recent tracked development, preferring a "major"-severity one so the
 * executive summary anchors on something that actually matters rather than
 * whatever happens to sort last by date. */
function latestDevelopment(data: CountryData): Development | undefined {
  if (data.recentDevelopments.length === 0) return undefined;
  const sorted = [...data.recentDevelopments].sort((a, b) => b.date.localeCompare(a.date));
  return sorted.find((d) => d.severity === "major") ?? sorted[0];
}

/** The most authoritative policy item to name as a country's "flagship"
 * legislative marker — prefers items already in force/passed over proposals,
 * and prefers confirmed items over ones still flagged needsVerification. */
function flagshipPolicy(data: CountryData): PolicyItem | undefined {
  if (data.policyAndRegulation.length === 0) return undefined;
  const confirmed = data.policyAndRegulation.filter((p) => !p.needsVerification);
  const pool = confirmed.length > 0 ? confirmed : data.policyAndRegulation;
  return [...pool].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])[0];
}

function policyFootprintLine(data: CountryData): string {
  if (data.policyAndRegulation.length === 0) return "no tracked national AI-specific legislation on file";
  const counts = new Map<string, number>();
  for (const p of data.policyAndRegulation) counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
  const parts = Array.from(counts.entries()).map(([status, n]) => `${n} ${status.replace("_", " ")}`);
  const n = data.policyAndRegulation.length;
  return `${n} tracked measure${n === 1 ? "" : "s"} (${parts.join(", ")})`;
}

function topCloudLine(data: CountryData): string | undefined {
  if (data.cloudInfrastructure.dominance.length === 0) return undefined;
  const top = [...data.cloudInfrastructure.dominance].sort((a, b) => b.share - a.share)[0];
  return `${top.provider} leads domestic cloud share at ~${top.share}%`;
}

function namedCompaniesLine(data: CountryData): string | undefined {
  if (data.companies.length === 0) return undefined;
  return data.companies.slice(0, 2).map((c) => c.name).join(", ");
}

/** Builds a substantive comparison for any 2-3 country combination that
 * doesn't have hand-curated content. Every fact here is read directly off
 * fields each country's own analyst copy already carries (atAGlance,
 * currentDirection, recentDevelopments, policyAndRegulation, notableGaps,
 * companies, cloudInfrastructure, debates) — never invented connective
 * tissue between the countries themselves, since unlike the hand-curated
 * flagship pairs this path runs unreviewed on any combination. */
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
      .join("; ")}. Most recent tracked marker for each: ${entries
      .map((e) => {
        const latest = latestDevelopment(e.data);
        return latest
          ? `${e.meta.shortName} — "${firstClause(latest.text)}" (${latest.date})`
          : `${e.meta.shortName} has no recent development on file`;
      })
      .join("; ")}.`,
  ];

  const points = (field: keyof CountryData["atAGlance"]) =>
    Object.fromEntries(entries.map((e) => [e.code, e.data.atAGlance[field] as string]));

  const byCategory = new Map<string, Map<string, string[]>>();
  for (const e of entries) {
    for (const d of e.data.debates) {
      if (!byCategory.has(d.category)) byCategory.set(d.category, new Map());
      const m = byCategory.get(d.category)!;
      if (!m.has(e.code)) m.set(e.code, []);
      m.get(e.code)!.push(d.topic);
    }
  }
  const sharedCategories = Array.from(byCategory.keys()).filter((c) => byCategory.get(c)!.size >= 2);

  const dimensions: ComparisonDimension[] = [
    dim(
      "regulatory-model",
      "Regulatory Philosophy",
      "government",
      points("regulatoryApproach"),
      entries
        .map((e) => {
          const flagship = flagshipPolicy(e.data);
          const marker = flagship
            ? ` Its clearest legislative marker on file is "${flagship.title}" (${flagship.status.replace("_", " ")}${flagship.needsVerification ? ", unconfirmed" : ""}).`
            : "";
          return `${e.meta.shortName} (${e.data.currentDirection.trend}): ${e.data.currentDirection.summary}${marker}`;
        })
        .join(" ")
    ),
    dim(
      "industrial-strategy",
      "Industrial Strategy & State Involvement",
      "investment",
      points("industrialStrategy"),
      entries
        .map((e) => {
          const cloud = topCloudLine(e.data);
          const companies = namedCompaniesLine(e.data);
          const extras = [companies ? `notable named developers: ${companies}` : undefined, cloud]
            .filter(Boolean)
            .join("; ");
          return `${e.meta.shortName}: ${e.data.atAGlance.governmentInvolvement}${extras ? ` (${extras})` : ""}.`;
        })
        .join(" ")
    ),
    dim(
      "international-posture",
      "International Posture",
      "infrastructure",
      points("internationalPartnerships"),
      sharedCategories.includes("security")
        ? `Both have live "security" debates on file (${Array.from(byCategory.get("security")!.entries())
            .map(([code, topics]) => `${getCountryMeta(code)?.shortName}: "${topics[0]}"`)
            .join("; ")}), suggesting overlapping strategic anxieties rather than fully independent postures.`
        : `No shared "security"-tagged debate axis is recorded for both — on the evidence here, each is legislating its international posture on its own track rather than a shared one.`
    ),
    dim(
      "policy-focus",
      "Primary Policy Focus",
      "research",
      points("primaryPolicyFocus"),
      `Where each government is actually spending its attention right now — not a statement of law, but of priority.`
    ),
    dim(
      "legislative-footprint",
      "Legislative & Institutional Footprint",
      "government",
      Object.fromEntries(entries.map((e) => [e.code, policyFootprintLine(e.data)])),
      `${entries
        .map((e) => `${e.meta.shortName} tracks ${e.data.governmentInstitutions.length} government AI institution${e.data.governmentInstitutions.length === 1 ? "" : "s"}`)
        .join("; ")}. Raw counts aren't a maturity score by themselves — a single binding statute can matter more than five proposals — but they mark how much formal apparatus each country has stood up so far.`
    ),
  ];

  const anyGaps = entries.some((e) => e.data.notableGaps.length > 0);
  if (anyGaps) {
    const gapAreaCounts = new Map<string, number>();
    for (const e of entries) {
      for (const g of e.data.notableGaps) {
        const key = g.area.trim().toLowerCase();
        gapAreaCounts.set(key, (gapAreaCounts.get(key) ?? 0) + 1);
      }
    }
    const sharedAreas = Array.from(gapAreaCounts.entries())
      .filter(([, n]) => n >= 2)
      .map(([area]) => area);

    dimensions.push(
      dim(
        "notable-gaps",
        "Notable Gaps",
        "sources",
        Object.fromEntries(
          entries.map((e) => [
            e.code,
            e.data.notableGaps.length > 0
              ? e.data.notableGaps.map((g) => g.area).join(", ")
              : "No notable gaps recorded in this country's profile",
          ])
        ),
        sharedAreas.length > 0
          ? `Both profiles independently flag the same gap area(s): ${sharedAreas.join(", ")}. That convergence is itself informative — it isn't one analyst's opinion repeated, it's two separate country write-ups landing on the same absence.`
          : `The gaps recorded for each country don't overlap — each is missing something different, which is a weaker signal than a shared gap but still worth reading as "not present as of the most recent research," not "definitively absent forever."`
      )
    );
  }

  const shared: string[] = [];
  for (const category of sharedCategories) {
    const m = byCategory.get(category)!;
    const label = CATEGORY_COLOR[category as keyof typeof CATEGORY_COLOR]?.label ?? category;
    const parts = entries
      .filter((e) => m.has(e.code))
      .map((e) => {
        const debate = e.data.debates.find((d) => d.category === category);
        return `${e.meta.shortName}: ${debate ? firstClause(debate.summary, 110) : m.get(e.code)![0]}`;
      });
    shared.push(`${label} — both are actively legislating or debating this axis. ${parts.join(" ")}`);
  }

  const perCountry: Record<string, string[]> = {};
  for (const e of entries) {
    const items: string[] = [];
    const companies = namedCompaniesLine(e.data);
    if (companies) items.push(`Named developers on file: ${companies}`);
    const otherTopics = new Set(
      entries.filter((o) => o.code !== e.code).flatMap((o) => o.data.debates.map((d) => d.topic))
    );
    const uniqueTopic = e.data.debates.find((d) => !otherTopics.has(d.topic));
    if (uniqueTopic) items.push(`A debate axis not shared by the other side here: "${uniqueTopic.topic}"`);
    if (e.data.notableGaps.length > 0) {
      items.push(
        `${e.data.notableGaps.length} notable gap${e.data.notableGaps.length === 1 ? "" : "s"} recorded: ${e.data.notableGaps
          .map((g) => g.area)
          .join(", ")}`
      );
    }
    if (items.length === 0) items.push(e.data.atAGlance.regulatoryApproach);
    perCountry[e.code] = items;
  }

  const strategicTradeoffs = [
    `${names.join(" and ")} each describe their own state's role differently: ${entries
      .map((e) => `${e.meta.shortName} — "${firstClause(e.data.atAGlance.governmentInvolvement, 100)}"`)
      .join("; ")}. Layered onto trajectory (${entries
      .map((e) => `${e.meta.shortName} ${e.data.currentDirection.trend}`)
      .join(", ")}), the open question this comparison actually poses is how much of each country's AI trajectory is being steered by the state versus left to market and research actors — and, for whichever side is tightening, whether that steering is increasing or easing right now.`,
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
