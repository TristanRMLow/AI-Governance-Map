import { TriangleAlert } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import type { NotableGap } from "@/lib/types";

export function NotableGapsSection({ items }: { items: NotableGap[] }) {
  return (
    <SectionCard id="notable-gaps" title="Notable Gaps" icon={TriangleAlert} meta={`${items.length}`}>
      {items.length === 0 ? (
        <EmptyState label="No significant gaps identified in this review." />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((g) => (
            <li key={g.area} className="rounded-xl border border-page-border bg-page-bg/50 p-4">
              <p className="text-[13.5px] font-medium text-page-text">{g.area}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-page-text-secondary">{g.note}</p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
