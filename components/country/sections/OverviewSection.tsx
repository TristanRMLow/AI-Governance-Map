import { FileText } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";

export function OverviewSection({ overview }: { overview: string }) {
  return (
    <SectionCard id="overview" title="Country Overview" icon={FileText}>
      <div className="max-w-2xl space-y-3 text-[14.5px] leading-relaxed text-page-text-secondary">
        {overview.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </SectionCard>
  );
}
