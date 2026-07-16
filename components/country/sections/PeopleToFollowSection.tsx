import { Users } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import type { FollowEntry } from "@/lib/types";

const CATEGORY_LABEL: Record<FollowEntry["category"], string> = {
  government: "Government",
  researcher: "Researcher",
  journalist: "Journalist",
  think_tank: "Think tank",
  company: "Company",
  university: "University",
  podcast: "Podcast",
  newsletter: "Newsletter",
};

export function PeopleToFollowSection({ items }: { items: FollowEntry[] }) {
  return (
    <SectionCard
      id="people-to-follow"
      title="People and Organisations to Follow"
      icon={Users}
      category="sources"
      meta={`${items.length}`}
    >
      {items.length === 0 ? (
        <EmptyState label="No follow recommendations compiled yet." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[13.5px] font-medium text-page-text">{item.name}</h4>
                  <span className="shrink-0 rounded-full border border-page-border-strong px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-page-text-muted">
                    {CATEGORY_LABEL[item.category]}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-page-text-secondary">{item.role}</p>
              </>
            );
            return item.url ? (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-page-border bg-page-bg/50 p-4 transition-colors hover:border-page-border-strong hover:bg-page-card-hover"
              >
                {content}
              </a>
            ) : (
              <div key={item.name} className="rounded-xl border border-page-border bg-page-bg/50 p-4">
                {content}
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
