import { Layers } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";
import type { ComparisonOverlap, CountryMeta } from "@/lib/types";

export function PolicyOverlapSection({
  overlap,
  countries,
}: {
  overlap: ComparisonOverlap;
  countries: CountryMeta[];
}) {
  return (
    <SectionCard id="policy-overlap" title="Policy Overlap" icon={Layers}>
      {overlap.shared.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-[10.5px] uppercase tracking-[0.05em] text-page-text-muted">Shared</p>
          <ul className="space-y-2">
            {overlap.shared.map((s, i) => (
              <li
                key={i}
                className="rounded-lg border border-page-border bg-page-bg/50 px-3.5 py-3 text-[13.5px] leading-relaxed text-page-text-secondary"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-3.5 ${countries.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {countries.map((c) => (
          <div key={c.code}>
            <p
              className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold"
              style={{ color: c.accentColor.light }}
            >
              <span aria-hidden>{c.flagEmoji}</span>
              <span>{c.shortName}</span>
            </p>
            <ul className="space-y-1.5">
              {(overlap.perCountry[c.code] ?? []).map((item, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-page-border bg-page-bg/50 px-3 py-2.5 text-[12.5px] leading-relaxed text-page-text-secondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
