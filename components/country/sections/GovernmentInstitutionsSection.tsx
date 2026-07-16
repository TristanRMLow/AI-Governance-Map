import { Landmark } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { EntityGrid } from "@/components/country/EntityGrid";
import type { Institution } from "@/lib/types";

export function GovernmentInstitutionsSection({ items }: { items: Institution[] }) {
  return (
    <SectionCard id="government-institutions" title="Government Institutions" icon={Landmark} category="government" meta={`${items.length}`}>
      {items.length === 0 ? (
        <EmptyState label="No government institutions recorded yet." />
      ) : (
        <EntityGrid items={items} />
      )}
    </SectionCard>
  );
}
