import { Lightbulb } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { EntityGrid } from "@/components/country/EntityGrid";
import type { Institution } from "@/lib/types";

export function ThinkTanksSection({ items }: { items: Institution[] }) {
  return (
    <SectionCard id="think-tanks" title="Think Tanks" icon={Lightbulb} category="research" meta={`${items.length}`}>
      {items.length === 0 ? <EmptyState label="No think tanks recorded yet." /> : <EntityGrid items={items} />}
    </SectionCard>
  );
}
