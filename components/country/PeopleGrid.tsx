import type { EcosystemPerson } from "@/lib/types";
import { VerificationBadge } from "@/components/country/VerificationBadge";

const CATEGORY_LABEL: Record<EcosystemPerson["category"], string> = {
  government: "Government",
  researcher: "Researcher",
  think_tank_leader: "Think tank",
  company_leader: "Industry",
  advisor: "Advisor",
};

export function PeopleGrid({ items }: { items: EcosystemPerson[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((p) => {
        const content = (
          <>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-[13.5px] font-medium text-page-text">{p.name}</h4>
              <div className="flex shrink-0 items-center gap-1.5">
                {p.needsVerification && <VerificationBadge />}
                <span className="rounded-full border border-page-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-page-text-muted">
                  {CATEGORY_LABEL[p.category]}
                </span>
              </div>
            </div>
            <p className="mt-1 text-[12.5px] text-page-text-secondary">{p.role}</p>
            {p.affiliation && (
              <p className="mt-0.5 font-mono text-[11px] text-page-text-muted">{p.affiliation}</p>
            )}
          </>
        );
        return p.url ? (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-page-border bg-page-bg/50 p-4 transition-colors hover:border-page-border-strong hover:bg-page-card-hover"
          >
            {content}
          </a>
        ) : (
          <div key={p.name} className="rounded-xl border border-page-border bg-page-bg/50 p-4">
            {content}
          </div>
        );
      })}
    </div>
  );
}
