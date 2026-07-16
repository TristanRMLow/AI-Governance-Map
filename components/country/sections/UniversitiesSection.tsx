import { GraduationCap } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { EntityGrid } from "@/components/country/EntityGrid";
import type { Institution } from "@/lib/types";

export function UniversitiesSection({ items }: { items: Institution[] }) {
  return (
    <SectionCard id="universities" title="Leading Universities" icon={GraduationCap} category="research" meta={`${items.length}`}>
      {items.length === 0 ? (
        <EmptyState label="No universities or research institutions recorded yet." />
      ) : (
        <EntityGrid items={items} />
      )}
    </SectionCard>
  );
}
