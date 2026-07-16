import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { getAllCountries } from "@/lib/getCountryData";
import { getFlagshipComparisons } from "@/lib/getComparisonData";
import { FlagshipCard } from "@/components/compare/FlagshipCard";
import { ComparePicker } from "@/components/compare/ComparePicker";

export const metadata: Metadata = {
  title: "Compare Countries — AI Governance World Map",
  description: "Executive-style briefings comparing AI governance across jurisdictions.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ with?: string }>;
}) {
  const { with: withCode } = await searchParams;
  const countries = getAllCountries();
  const flagships = getFlagshipComparisons();
  const countryByCode = new Map(countries.map((c) => [c.code, c]));

  return (
    <div className="page-surface min-h-dvh bg-page-bg">
      <NavBar variant="light" breadcrumb="Compare" />
      <div className="mx-auto max-w-[1240px] px-6 py-8">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-page-text text-balance">
          Compare Countries
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-page-text-secondary">
          An executive intelligence briefing, not a spreadsheet — governance philosophy, industrial
          strategy, and where regulation actually overlaps.
        </p>

        <div className="mt-8">
          <span className="mb-3 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-page-text-muted">
            Flagship comparisons
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flagships.map((f) => (
              <FlagshipCard
                key={f.slug}
                slug={f.slug}
                title={f.title}
                tagline={f.tagline}
                countries={f.countries.map((code) => countryByCode.get(code)!).filter(Boolean)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <ComparePicker countries={countries} preselected={withCode} />
        </div>
      </div>
    </div>
  );
}
