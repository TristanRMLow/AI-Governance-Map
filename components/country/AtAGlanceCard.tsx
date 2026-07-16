import { LayoutGrid } from "lucide-react";
import { SectionCard } from "@/components/country/SectionCard";
import type { CountryData } from "@/lib/types";

const SENTIMENT_DOT: Record<string, string> = {
  green: "var(--status-good)",
  amber: "var(--status-warning)",
  red: "var(--status-critical)",
  blue: "var(--status-blue)",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function namesList(names: string[], max = 3) {
  if (names.length === 0) return "—";
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} +${names.length - max} more`;
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-page-border bg-page-bg/50 px-3 py-2.5">
      <dt className="text-[10.5px] uppercase tracking-[0.04em] text-page-text-muted">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium leading-snug text-page-text">{value}</dd>
    </div>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-mono text-[28px] font-bold leading-none tabular-nums text-page-text">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-page-text-muted">{label}</p>
    </div>
  );
}

export function AtAGlanceCard({ country }: { country: CountryData }) {
  const { atAGlance } = country;
  const dotColor = SENTIMENT_DOT[atAGlance.policyDirection.sentiment];

  return (
    <SectionCard id="at-a-glance" title="At a Glance" icon={LayoutGrid}>
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-page-border bg-page-bg/70 px-4 py-3.5">
        <span
          aria-hidden
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: dotColor, boxShadow: `0 0 0 4px color-mix(in srgb, ${dotColor} 18%, transparent)` }}
        />
        <div>
          <p className="text-[11px] uppercase tracking-[0.04em] text-page-text-muted">
            Overall AI policy direction
          </p>
          <p className="text-[15px] font-semibold text-page-text">{atAGlance.policyDirection.label}</p>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-8 border-b border-page-border pb-5">
        <HeroStat value={country.companies.length} label="Major AI companies" />
        <div className="h-10 w-px bg-page-border" />
        <HeroStat value={country.universities.length} label="Research institutions" />
        <div className="h-10 w-px bg-page-border" />
        <HeroStat value={country.debates.length} label="Live debates" />
      </div>

      <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Tile label="Last updated" value={formatDate(country.lastUpdated)} />
        <Tile label="Regulatory approach" value={atAGlance.regulatoryApproach} />
        <Tile label="Major AI companies" value={namesList(country.companies.map((c) => c.name))} />
        <Tile
          label="Major cloud providers"
          value={namesList(country.cloudInfrastructure.providers.map((p) => p.name))}
        />
        <Tile
          label="Leading research institutions"
          value={namesList(country.universities.map((u) => u.name))}
        />
        <Tile label="Key ministries" value={namesList(country.governmentInstitutions.map((g) => g.name))} />
        <Tile label="Government involvement" value={atAGlance.governmentInvolvement} />
        <Tile label="Industrial strategy" value={atAGlance.industrialStrategy} />
        <Tile label="International partnerships" value={atAGlance.internationalPartnerships} />
        <Tile label="Primary policy focus" value={atAGlance.primaryPolicyFocus} />
      </dl>
    </SectionCard>
  );
}
