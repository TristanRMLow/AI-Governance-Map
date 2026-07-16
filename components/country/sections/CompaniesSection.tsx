import { Building2 } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { EntityGrid } from "@/components/country/EntityGrid";
import type { EcosystemCompany } from "@/lib/types";

export function CompaniesSection({ items }: { items: EcosystemCompany[] }) {
  return (
    <SectionCard id="companies" title="Major AI Companies" icon={Building2} category="industry" meta={`${items.length}`}>
      {items.length === 0 ? <EmptyState label="No companies recorded yet." /> : <EntityGrid items={items} />}
    </SectionCard>
  );
}
