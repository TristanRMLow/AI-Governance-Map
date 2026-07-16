import { Users } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import { PeopleGrid } from "@/components/country/PeopleGrid";
import { InfluenceMap } from "@/components/country/InfluenceMap";
import type { EcosystemPerson, InfluenceNode } from "@/lib/types";

export function KeyPeopleSection({
  people,
  influenceMap,
}: {
  people: EcosystemPerson[];
  influenceMap: InfluenceNode[];
}) {
  return (
    <SectionCard id="key-people" title="Key People" icon={Users} meta={`${people.length}`}>
      <InfluenceMap nodes={influenceMap} />
      {people.length === 0 ? <EmptyState label="No key people recorded yet." /> : <PeopleGrid items={people} />}
    </SectionCard>
  );
}
