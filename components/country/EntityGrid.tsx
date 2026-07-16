import type { EcosystemCompany, Institution } from "@/lib/types";
import { VerificationBadge } from "@/components/country/VerificationBadge";

export function EntityGrid({ items }: { items: (EcosystemCompany | Institution)[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const needsVerification = "needsVerification" in item && item.needsVerification;
        const content = (
          <>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-[13.5px] font-medium text-page-text">{item.name}</h4>
              {needsVerification && <VerificationBadge />}
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-page-text-secondary">
              {item.description}
            </p>
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
  );
}
