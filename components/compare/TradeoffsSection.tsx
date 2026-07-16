import { Scale } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";

export function TradeoffsSection({ paragraphs }: { paragraphs: string[] }) {
  return (
    <SectionCard id="strategic-tradeoffs" title="Strategic Trade-offs" icon={Scale}>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="max-w-3xl text-[14px] leading-relaxed text-page-text-secondary">
            {p}
          </p>
        ))}
      </div>
    </SectionCard>
  );
}
