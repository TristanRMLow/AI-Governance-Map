import { FlaskConical } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";
import { SourceRefs } from "@/components/country/SourceRefs";
import type { SourceRef } from "@/lib/types";

export function ResearchEcosystemSection({
  summary,
  sourceIds,
  sources,
}: {
  summary: string;
  sourceIds: string[];
  sources: SourceRef[];
}) {
  return (
    <SectionCard id="research-ecosystem" title="Research Ecosystem" icon={FlaskConical} category="research">
      <p className="max-w-2xl text-[14px] leading-relaxed text-page-text-secondary">{summary}</p>
      <SourceRefs sourceIds={sourceIds} sources={sources} />
    </SectionCard>
  );
}
