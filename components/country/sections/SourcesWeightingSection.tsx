import { ShieldCheck } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import type { SourceCategory, SourceRef } from "@/lib/types";

const CATEGORY_ORDER: SourceCategory[] = [
  "government",
  "research",
  "think_tank",
  "industry",
  "news",
  "expert_commentary",
];

const CATEGORY_LABEL: Record<SourceCategory, string> = {
  government: "Government",
  research: "Research",
  think_tank: "Think tanks",
  industry: "Industry",
  news: "News",
  expert_commentary: "Expert commentary",
};

const TARGET_WEIGHT: Record<SourceCategory, number> = {
  government: 30,
  research: 20,
  think_tank: 20,
  industry: 15,
  news: 10,
  expert_commentary: 5,
};

const CATEGORY_BAR: Record<SourceCategory, string> = {
  government: "var(--color-country)",
  research: "var(--status-blue)",
  think_tank: "var(--status-good)",
  industry: "var(--status-warning)",
  news: "var(--page-text-muted)",
  expert_commentary: "var(--page-border-strong)",
};

export function SourcesWeightingSection({ items }: { items: SourceRef[] }) {
  const total = items.length || 1;
  const actual = CATEGORY_ORDER.map((cat) => ({
    cat,
    count: items.filter((s) => s.category === cat).length,
    pct: Math.round((items.filter((s) => s.category === cat).length / total) * 100),
  }));

  return (
    <SectionCard id="sources" title="Sources" icon={ShieldCheck} category="sources" meta={`${items.length} cited`}>
      {items.length === 0 ? (
        <EmptyState label="No sources recorded yet." />
      ) : (
        <>
          <p className="mb-3 max-w-2xl text-[12.5px] text-page-text-secondary">
            Deliberately sourced beyond government publications. The bars below show each
            category&rsquo;s actual share of this page&rsquo;s citations — an internal editorial
            guideline rather than a rigorously derived target, so treat it as a rough steer, not a
            precise benchmark.
          </p>
          <div className="mb-2 flex h-2.5 overflow-hidden rounded-full bg-page-border/70">
            {actual
              .filter((a) => a.count > 0)
              .map((a) => (
                <div
                  key={a.cat}
                  style={{ width: `${a.pct}%`, background: CATEGORY_BAR[a.cat] }}
                  title={`${CATEGORY_LABEL[a.cat]} — ${a.pct}% (guideline ~${TARGET_WEIGHT[a.cat]}%)`}
                />
              ))}
          </div>
          <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-page-text-secondary">
            {actual
              .filter((a) => a.count > 0)
              .map((a) => (
                <span key={a.cat}>
                  {CATEGORY_LABEL[a.cat]} <span className="font-medium text-page-text">{a.pct}%</span>
                </span>
              ))}
          </div>

          <ol className="divide-y divide-page-border rounded-xl border border-page-border">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-[13px] transition-colors hover:bg-page-card-hover"
                >
                  <span className="text-page-text">{item.title}</span>
                  <span className="flex items-center gap-3 font-mono text-[10.5px] text-page-text-muted">
                    <span className="rounded border border-page-border-strong px-1.5 py-0.5">
                      {CATEGORY_LABEL[item.category]}
                    </span>
                    {item.publisher}
                    {item.date && <span>{item.date}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </SectionCard>
  );
}
