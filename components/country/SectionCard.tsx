import type { LucideIcon } from "lucide-react";
import { CATEGORY_COLOR } from "@/lib/categoryColors";
import type { Category } from "@/lib/types";

interface SectionCardProps {
  id: string;
  title: string;
  icon?: LucideIcon;
  /** When set, the icon chip uses this semantic category colour consistently
   * across every country page. Omit for identity-establishing cards (Overview,
   * At a Glance, Current Direction) which keep the country's own accent. */
  category?: Category;
  meta?: string;
  children: React.ReactNode;
}

export function SectionCard({ id, title, icon: Icon, category, meta, children }: SectionCardProps) {
  const iconColor = category ? CATEGORY_COLOR[category].color : "var(--color-country)";
  const iconSoft = category ? CATEGORY_COLOR[category].soft : "var(--color-country-soft)";

  return (
    <section
      id={id}
      className="card-lift scroll-mt-24 rounded-2xl border border-page-border bg-page-card p-6 shadow-[0_1px_2px_rgba(34,32,26,0.05)] sm:p-7"
    >
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${iconColor} 22%, transparent), ${iconSoft})`,
                color: iconColor,
              }}
            >
              <Icon size={16} strokeWidth={2.25} />
            </span>
          )}
          <h2 className="text-[17px] font-bold tracking-[-0.01em] text-page-text">{title}</h2>
        </div>
        {meta && (
          <span className="font-mono text-[11px] tabular-nums text-page-text-muted">{meta}</span>
        )}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <p className="rounded-lg border border-dashed border-page-border-strong px-4 py-6 text-[13.5px] text-page-text-muted">
      {label}
    </p>
  );
}
