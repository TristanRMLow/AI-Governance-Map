import type { ComparisonData } from "@/lib/types";
import type { CountryMeta } from "@/lib/types";

export function ComparisonHeader({
  comparison,
  countries,
}: {
  comparison: ComparisonData;
  countries: CountryMeta[];
}) {
  return (
    <div className="hero-wash enter-up overflow-hidden rounded-3xl border border-page-border px-7 py-8 sm:px-9 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="flex shrink-0 -space-x-2">
            {countries.map((c) => (
              <span
                key={c.code}
                aria-hidden
                className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-page-card bg-page-card text-[28px] leading-none shadow-[0_1px_2px_rgba(23,23,15,0.06)]"
              >
                {c.flagEmoji}
              </span>
            ))}
          </div>
          <div>
            <span
              className="mb-2 inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em]"
              style={{ background: "var(--status-blue-soft)", color: "var(--status-blue)" }}
            >
              {comparison.curated ? "Curated comparison" : "Comparison"}
            </span>
            <h1 className="text-[32px] font-bold leading-[1.08] tracking-[-0.02em] text-page-text text-balance sm:text-[38px]">
              {comparison.title}
            </h1>
            <p className="mt-2 max-w-xl text-[15px] text-page-text-secondary">{comparison.tagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
