import { GitCompare } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";
import { CATEGORY_COLOR } from "@/lib/categoryColors";
import type { ComparisonDimension, CountryMeta } from "@/lib/types";

function DimensionRow({ dimension, countries }: { dimension: ComparisonDimension; countries: CountryMeta[] }) {
  const cat = CATEGORY_COLOR[dimension.category];
  const gridCols = countries.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="rounded-xl border border-page-border bg-page-bg/50 p-4 sm:p-5">
      <div className="mb-3.5 flex items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.05em]"
          style={{ background: cat.soft, color: cat.color }}
        >
          {cat.label}
        </span>
        <h3 className="text-[14.5px] font-semibold text-page-text">{dimension.title}</h3>
      </div>

      <div className={`grid grid-cols-1 gap-3 ${gridCols}`}>
        {countries.map((c) => (
          <div key={c.code} className="rounded-lg border border-page-border bg-page-card px-3.5 py-3">
            <div
              className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold"
              style={{ color: c.accentColor.light }}
            >
              <span aria-hidden>{c.flagEmoji}</span>
              <span>{c.shortName}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-page-text-secondary">
              {dimension.points[c.code]}
            </p>
          </div>
        ))}
      </div>

      <p
        className="mt-3.5 rounded-lg border-l-2 bg-page-card px-3.5 py-3 text-[13px] leading-relaxed text-page-text-secondary"
        style={{ borderColor: cat.color }}
      >
        {dimension.analysis}
      </p>
    </div>
  );
}

export function DimensionsSection({
  dimensions,
  countries,
}: {
  dimensions: ComparisonDimension[];
  countries: CountryMeta[];
}) {
  return (
    <SectionCard
      id="dimensions"
      title="Dimension-by-Dimension"
      icon={GitCompare}
      meta={`${dimensions.length} dimensions`}
    >
      <div className="space-y-3.5">
        {dimensions.map((d) => (
          <DimensionRow key={d.key} dimension={d} countries={countries} />
        ))}
      </div>
    </SectionCard>
  );
}
