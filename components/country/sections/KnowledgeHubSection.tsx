import { Library } from "lucide-react";
import { SectionCard, EmptyState } from "@/components/country/SectionCard";
import type { KnowledgeHubItem, KnowledgeHubType } from "@/lib/types";

const TYPE_ORDER: KnowledgeHubType[] = [
  "government",
  "academic",
  "think_tank",
  "book",
  "substack",
  "newsletter",
  "podcast",
  "interview",
  "speech",
  "conference_talk",
  "video",
  "github",
  "dataset",
];

const TYPE_LABEL: Record<KnowledgeHubType, string> = {
  government: "Official documents",
  academic: "Academic papers",
  think_tank: "Think tank reports",
  book: "Books",
  substack: "Substacks",
  newsletter: "Newsletters",
  podcast: "Podcasts",
  interview: "Interviews",
  speech: "Speeches",
  conference_talk: "Conference talks",
  video: "Videos",
  github: "GitHub projects",
  dataset: "Datasets",
};

export function KnowledgeHubSection({ items }: { items: KnowledgeHubItem[] }) {
  const groups = TYPE_ORDER.map((type) => ({
    type,
    items: items.filter((i) => i.type === type),
  })).filter((g) => g.items.length > 0);

  return (
    <SectionCard id="knowledge-hub" title="Knowledge Hub" icon={Library} category="sources" meta={`${items.length} curated`}>
      {items.length === 0 ? (
        <EmptyState label="No knowledge hub items compiled yet." />
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.type}>
              <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-page-text-muted">
                {TYPE_LABEL[group.type]}
              </p>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13.5px] font-medium text-page-text transition-colors hover:text-[var(--color-country)]"
                    >
                      {item.title}
                    </a>
                    {item.author && (
                      <span className="ml-1.5 text-[12px] text-page-text-muted">— {item.author}</span>
                    )}
                    {item.note && (
                      <p className="mt-0.5 text-[12px] text-page-text-secondary">{item.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
