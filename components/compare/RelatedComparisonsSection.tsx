import Link from "next/link";
import { Compass } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import type { CountryMeta } from "@/lib/types";

export interface RelatedComparisonInfo {
  slug: string;
  countries: CountryMeta[];
}

export function RelatedComparisonsSection({ items }: { items: RelatedComparisonInfo[] }) {
  return (
    <SectionCard id="related-comparisons" title="Related Comparisons" icon={Compass}>
      {items.length === 0 ? (
        <EmptyState label="No related comparisons yet." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="card-lift rounded-xl border border-page-border bg-page-bg/50 px-4 py-3.5"
            >
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-page-text">
                {item.countries.map((c, i) => (
                  <span key={c.code} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-page-text-muted">vs</span>}
                    <span aria-hidden>{c.flagEmoji}</span>
                    <span>{c.shortName}</span>
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-[12px] text-page-text-muted">Explore this comparison →</p>
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
