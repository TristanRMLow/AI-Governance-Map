import { Compass, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";
import type { CurrentDirection } from "@/lib/types";

const TREND_META = {
  tightening: { icon: TrendingUp, label: "Tightening" },
  loosening: { icon: TrendingDown, label: "Loosening" },
  stable: { icon: Minus, label: "Stable" },
} as const;

export function CurrentDirectionCard({ direction }: { direction: CurrentDirection }) {
  const { icon: TrendIcon, label } = TREND_META[direction.trend];

  return (
    <SectionCard id="current-direction" title="Current Direction" icon={Compass}>
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--color-country-soft)", color: "var(--color-country)" }}
        >
          <TrendIcon size={16} strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-[14.5px] font-semibold text-page-text">{label}</p>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-page-text-secondary">
            {direction.summary}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
