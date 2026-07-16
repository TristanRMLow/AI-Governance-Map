import { Newspaper } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";
import { DateFeed } from "@/components/country/DateFeed";
import type { Development, SourceRef } from "@/lib/types";

export function RecentDevelopmentsSection({
  items,
  sources,
}: {
  items: Development[];
  sources: SourceRef[];
}) {
  return (
    <SectionCard
      id="recent-developments"
      title="Recent Developments"
      icon={Newspaper}
      category="sources"
      meta={`${items.length} this cycle`}
    >
      <DateFeed items={items} sources={sources} emptyLabel="Nothing new logged yet." />
    </SectionCard>
  );
}
