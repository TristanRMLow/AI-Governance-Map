import { Cloud } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { EntityGrid } from "@/components/country/EntityGrid";
import type { CloudShare, ComputeFrontier, EcosystemCompany } from "@/lib/types";

const FRONTIER_LABEL: Record<ComputeFrontier["frontierDeveloper"], string> = {
  domestic: "Domestic frontier developer",
  emerging: "Emerging / sovereign models",
  none: "No domestic frontier developer",
};
const FRONTIER_DOT: Record<ComputeFrontier["frontierDeveloper"], string> = {
  domestic: "#4D9D80",
  emerging: "#D9A521",
  none: "#8A8578",
};

/** Recognisable, at-a-glance colours per cloud provider so a chart with AWS
 * and Azure side by side is never a guessing game — deliberately distinct
 * from both the category-colour system and any one country's own accent. */
const PROVIDER_COLORS: [pattern: RegExp, color: string][] = [
  [/aws|amazon/i, "#D9821B"],
  [/azure|microsoft/i, "#2E7FC1"],
  [/google/i, "#D9A521"],
  [/oracle/i, "#B5453F"],
  [/huawei/i, "#2E6B4F"],
  [/alibaba/i, "#8B3A3A"],
  [/ovh/i, "#7C5CBF"],
  [/tencent/i, "#6FA1CC"],
  [/naver/i, "#4FA85B"],
  [/ntt/i, "#7B6BA8"],
  [/g42/i, "#B5943E"],
  [/humain/i, "#4A8A7E"],
];
const FALLBACK_COLORS = ["#8A8578", "#A0998A", "#B8B2A2"];

function colorForProvider(name: string, fallbackIndex: number): string {
  for (const [pattern, color] of PROVIDER_COLORS) {
    if (pattern.test(name)) return color;
  }
  return FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length];
}

export function CloudInfrastructureSection({
  providers,
  dominance,
  computeFrontier,
}: {
  providers: EcosystemCompany[];
  dominance: CloudShare[];
  computeFrontier?: ComputeFrontier;
}) {
  const total = dominance.reduce((sum, d) => sum + d.share, 0) || 1;

  return (
    <SectionCard id="cloud-infrastructure" title="Cloud Infrastructure" icon={Cloud} category="infrastructure">
      {computeFrontier && (
        <dl className="mb-5 grid gap-x-4 gap-y-2 border-b border-page-border/60 pb-4 text-[12.5px] sm:grid-cols-3">
          <div>
            <dt className="mb-0.5 text-[10.5px] uppercase tracking-[0.04em] text-page-text-muted">
              Frontier AI
            </dt>
            <dd className="inline-flex items-center gap-1.5 text-page-text-secondary">
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: FRONTIER_DOT[computeFrontier.frontierDeveloper] }}
              />
              {FRONTIER_LABEL[computeFrontier.frontierDeveloper]}
            </dd>
          </div>
          <div>
            <dt className="mb-0.5 text-[10.5px] uppercase tracking-[0.04em] text-page-text-muted">
              Compute
            </dt>
            <dd className="text-page-text-secondary">{computeFrontier.compute}</dd>
          </div>
          <div>
            <dt className="mb-0.5 text-[10.5px] uppercase tracking-[0.04em] text-page-text-muted">
              Chip access
            </dt>
            <dd className="text-page-text-secondary">{computeFrontier.chipAccess}</dd>
          </div>
        </dl>
      )}
      {dominance.length > 0 && (
        <div className="mb-6">
          <p className="mb-1.5 text-[11px] uppercase tracking-[0.04em] text-page-text-muted">
            Cloud market share
          </p>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-page-border/70">
            {dominance.map((d, i) => (
              <div
                key={d.provider}
                style={{
                  width: `${(d.share / total) * 100}%`,
                  background: colorForProvider(d.provider, i),
                }}
                title={`${d.provider} ${d.share}%`}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-page-text-secondary">
            {dominance.map((d, i) => (
              <span key={d.provider} className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ background: colorForProvider(d.provider, i) }}
                />
                {d.provider} <span className="font-medium text-page-text">{d.share}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {providers.length === 0 ? (
        <EmptyState label="No cloud providers recorded yet." />
      ) : (
        <EntityGrid items={providers} />
      )}
    </SectionCard>
  );
}
