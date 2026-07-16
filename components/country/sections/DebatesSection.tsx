import { MessagesSquare } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { SourceRefs } from "@/components/country/SourceRefs";
import { CATEGORY_COLOR } from "@/lib/categoryColors";
import type { Debate, SourceRef } from "@/lib/types";

export function DebatesSection({
  items,
  sources,
}: {
  items: Debate[];
  sources: SourceRef[];
}) {
  return (
    <SectionCard id="debates" title="Current Debates" icon={MessagesSquare} meta={`${items.length} live`}>
      {items.length === 0 ? (
        <EmptyState label="No live debates recorded yet." />
      ) : (
        <div className="space-y-3">
          {items.map((debate) => {
            const cat = CATEGORY_COLOR[debate.category];
            return (
              <details
                key={debate.topic}
                className="group rounded-xl border border-page-border bg-page-bg/50 open:border-page-border-strong"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.05em]"
                        style={{ background: cat.soft, color: cat.color }}
                      >
                        {cat.label}
                      </span>
                      <h3 className="text-[14px] font-medium text-page-text">{debate.topic}</h3>
                    </div>
                    <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-page-text-secondary">
                      {debate.summary}
                    </p>
                  </div>
                  <span className="mt-0.5 shrink-0 text-page-text-muted transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <div className="border-t border-page-border px-4 py-3.5">
                  <p className="max-w-2xl text-[13.5px] leading-relaxed text-page-text-secondary">
                    {debate.expanded}
                  </p>
                  <SourceRefs sourceIds={debate.sourceIds} sources={sources} />
                </div>
              </details>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
