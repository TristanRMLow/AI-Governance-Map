import { FileText } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";

export function ExecutiveSummarySection({ paragraphs }: { paragraphs: string[] }) {
  return (
    <SectionCard id="executive-summary" title="Executive Summary" icon={FileText}>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="max-w-3xl text-[14.5px] leading-relaxed text-page-text-secondary">
            {p}
          </p>
        ))}
      </div>
    </SectionCard>
  );
}
