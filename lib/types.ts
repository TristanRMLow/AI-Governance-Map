export type SourceCategory =
  | "government"
  | "research"
  | "think_tank"
  | "industry"
  | "news"
  | "expert_commentary";

export type GeometryType = "polygon" | "marker";

export interface CountryMeta {
  code: string;
  name: string;
  shortName: string;
  flagEmoji: string;
  geometryType: GeometryType;
  isoA3: string[];
  region: string;
  jurisdictionType: "nation_state" | "supranational";
  governanceModel: string;
  accentColor: { light: string; dark: string };
  center: [number, number];
  zoom: number;
  lastUpdated: string;
  newDevelopmentsCount: number;
  /** True when recentDevelopments contains a severity:"major" entry — mirrors
   * lastUpdated/newDevelopmentsCount as a cheap index-level cache so the
   * homepage/map can render a freshness signal without reading every
   * country's full detail file. */
  hasMajorUpdate: boolean;
  debateTopics: string[];
}

export interface SourceRef {
  id: string;
  title: string;
  publisher: string;
  url: string;
  date?: string;
  category: SourceCategory;
}

export interface Verifiable {
  needsVerification?: boolean;
}

export type Sentiment = "green" | "amber" | "red" | "blue";

/** The 7-way semantic category system used consistently for section icons
 * and debate tags across the whole app — independent of any one country's
 * own accent colour. */
export type Category =
  | "government"
  | "industry"
  | "research"
  | "investment"
  | "security"
  | "infrastructure"
  | "sources";

export interface AtAGlance {
  policyDirection: { label: string; sentiment: Sentiment };
  regulatoryApproach: string;
  latestMajorUpdate: string;
  governmentInvolvement: string;
  industrialStrategy: string;
  internationalPartnerships: string;
  primaryPolicyFocus: string;
}

export interface CurrentDirection {
  trend: "tightening" | "loosening" | "stable";
  summary: string;
}

export interface Development extends Verifiable {
  text: string;
  date: string;
  sourceIds: string[];
  /** Set only for genuinely landmark events (binding legislation passed/in
   * force, major court decisions, landmark investment, significant
   * international agreements). Absent means routine — kept rare so the
   * Recent Updates banner stays meaningful. */
  severity?: "major";
}

export type LegislationStatus = "proposed" | "passed" | "in_force" | "repealed";

export interface PolicyItem extends Verifiable {
  title: string;
  status: LegislationStatus;
  summary: string;
  officialUrl?: string;
  sourceIds: string[];
}

/** A genuine absence in a country's AI ecosystem/governance picture (no
 * frontier model developer, no dedicated strategy, no national AI institute,
 * etc.) — surfaced explicitly rather than left as a silent gap in coverage. */
export interface NotableGap {
  area: string;
  note: string;
}

export interface Debate {
  topic: string;
  category: Category;
  summary: string;
  expanded: string;
  sourceIds: string[];
}

export interface EcosystemCompany {
  name: string;
  description: string;
  url?: string;
}

export interface Institution extends Verifiable {
  name: string;
  description: string;
  url?: string;
  aliases?: string[];
}

export interface EcosystemPerson extends Verifiable {
  name: string;
  role: string;
  affiliation?: string;
  category: "government" | "researcher" | "think_tank_leader" | "company_leader" | "advisor";
  url?: string;
}

export type KnowledgeHubType =
  | "government"
  | "academic"
  | "think_tank"
  | "book"
  | "substack"
  | "newsletter"
  | "podcast"
  | "interview"
  | "speech"
  | "conference_talk"
  | "video"
  | "github"
  | "dataset";

export interface KnowledgeHubItem {
  title: string;
  type: KnowledgeHubType;
  author?: string;
  url?: string;
  note?: string;
}

export interface FollowEntry {
  name: string;
  type: "person" | "organization";
  role: string;
  category:
    | "government"
    | "researcher"
    | "journalist"
    | "think_tank"
    | "company"
    | "university"
    | "podcast"
    | "newsletter";
  url?: string;
}

export interface CloudShare {
  provider: string;
  share: number;
}

export interface InfluenceNode {
  label: string;
  type: "government" | "agency" | "company" | "research" | "think_tank";
}

export interface CountryData extends CountryMeta {
  overview: string;
  atAGlance: AtAGlance;
  currentDirection: CurrentDirection;
  recentDevelopments: Development[];
  policyAndRegulation: PolicyItem[];
  researchEcosystem: { summary: string; sourceIds: string[] };
  companies: EcosystemCompany[];
  cloudInfrastructure: { providers: EcosystemCompany[]; dominance: CloudShare[] };
  universities: Institution[];
  thinkTanks: Institution[];
  governmentInstitutions: Institution[];
  keyPeople: EcosystemPerson[];
  peopleToFollow: FollowEntry[];
  influenceMap: InfluenceNode[];
  notableGaps: NotableGap[];
  debates: Debate[];
  knowledgeHub: KnowledgeHubItem[];
  sources: SourceRef[];
}

/** Compare Countries — an executive-briefing comparison of 2-3 jurisdictions.
 * Curated flagship pairs are hand-authored for analytical depth; any other
 * combination falls back to a template assembled from each country's own
 * atAGlance/currentDirection/debates fields (see buildDynamicComparison.ts). */
export interface ComparisonDimension {
  key: string;
  title: string;
  category: Category;
  /** Country code -> a short analyst point for that axis. */
  points: Record<string, string>;
  /** Why they differ / what it means — the analysis, not a fact restated. */
  analysis: string;
}

export interface ComparisonOverlap {
  shared: string[];
  perCountry: Record<string, string[]>;
}

export interface ComparisonData {
  slug: string;
  countries: string[];
  title: string;
  tagline: string;
  executiveSummary: string[];
  dimensions: ComparisonDimension[];
  policyOverlap: ComparisonOverlap;
  strategicTradeoffs: string[];
  relatedSlugs: string[];
  curated: boolean;
}
