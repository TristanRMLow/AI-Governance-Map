import { Gavel } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { SourceRefs } from "@/components/country/SourceRefs";
import { StatusBadge } from "@/components/country/StatusBadge";
import { VerificationBadge } from "@/components/country/VerificationBadge";
import type { PolicyItem, SourceRef } from "@/lib/types";

export function PolicyRegulationSection({
  items,
  sources,
}: {
  items: PolicyItem[];
  sources: SourceRef[];
}) {
  return (
    <SectionCard
      id="policy-regulation"
      title="Policy and Regulation"
      icon={Gavel}
      category="government"
      meta={`${items.length} tracked`}
    >
      {items.length === 0 ? (
        <EmptyState label="No policy or regulation tracked yet." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-page-border bg-page-bg/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <h3 className="text-[14.5px] font-medium text-page-text">{item.title}</h3>
                <div className="flex shrink-0 items-center gap-1.5">
                  {item.needsVerification && <VerificationBadge />}
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-page-text-secondary">
                {item.summary}
              </p>
              {item.officialUrl && (
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[12.5px] font-medium"
                  style={{ color: "var(--color-country)" }}
                >
                  Official text ↗
                </a>
              )}
              <SourceRefs sourceIds={item.sourceIds} sources={sources} />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
