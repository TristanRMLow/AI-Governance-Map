import type { EcosystemCompany, Institution } from "@/lib/types";

export function EntityGrid({ items }: { items: (EcosystemCompany | Institution)[] }) {
  if (items.length === 0) return null;
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
        {items.map((item) => {
          const content = (
            <>
              <h4 className="text-[13.5px] font-medium break-words text-page-text">{item.name}</h4>
              <p className="mt-1 text-[12.5px] leading-relaxed break-words text-page-text-secondary">
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
              className="min-w-0 rounded-xl border border-page-border bg-page-bg/50 p-4 transition-colors hover:border-page-border-strong hover:bg-page-card-hover"
            >
              {content}
            </a>
          ) : (
            <div key={item.name} className="min-w-0 rounded-xl border border-page-border bg-page-bg/50 p-4">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
