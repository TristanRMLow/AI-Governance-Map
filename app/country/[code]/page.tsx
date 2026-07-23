import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Scale } from "lucide-react";
import { getCountryCodes, getCountryData } from "@/lib/getCountryData";
import { NavBar } from "@/components/layout/NavBar";
import { GlobalNavLinks } from "@/components/layout/GlobalNavLinks";
import { CountryHeader } from "@/components/country/CountryHeader";
import { RecentUpdateBanner } from "@/components/country/RecentUpdateBanner";
import { CountryToc } from "@/components/country/CountryToc";
import { AtAGlanceCard } from "@/components/country/AtAGlanceCard";
import { CurrentDirectionCard } from "@/components/country/CurrentDirectionCard";
import { OverviewSection } from "@/components/country/sections/OverviewSection";
import { RecentDevelopmentsSection } from "@/components/country/sections/RecentDevelopmentsSection";
import { PolicyRegulationSection } from "@/components/country/sections/PolicyRegulationSection";
import { ResearchEcosystemSection } from "@/components/country/sections/ResearchEcosystemSection";
import { CompaniesSection } from "@/components/country/sections/CompaniesSection";
import { CloudInfrastructureSection } from "@/components/country/sections/CloudInfrastructureSection";
import { UniversitiesSection } from "@/components/country/sections/UniversitiesSection";
import { ThinkTanksSection } from "@/components/country/sections/ThinkTanksSection";
import { GovernmentInstitutionsSection } from "@/components/country/sections/GovernmentInstitutionsSection";
import { NotableGapsSection } from "@/components/country/sections/NotableGapsSection";
import { KeyPeopleSection } from "@/components/country/sections/KeyPeopleSection";
import { PeopleToFollowSection } from "@/components/country/sections/PeopleToFollowSection";
import { DebatesSection } from "@/components/country/sections/DebatesSection";
import { KnowledgeHubSection } from "@/components/country/sections/KnowledgeHubSection";
import { SourcesWeightingSection } from "@/components/country/sections/SourcesWeightingSection";

export function generateStaticParams() {
  return getCountryCodes().map((code) => ({ code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const country = getCountryData(code);
  if (!country) return {};
  return {
    title: `${country.name} — AI Governance World Map`,
    description: country.overview.split("\n\n")[0],
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = getCountryData(code);
  if (!country) notFound();

  const accentVars = {
    "--country-accent": country.accentColor.light,
    "--country-accent-soft": `${country.accentColor.light}17`,
  } as CSSProperties;

  return (
    <div className="page-surface min-h-dvh bg-page-bg" style={accentVars}>
      <NavBar
        variant="light"
        breadcrumb={`${country.flagEmoji} ${country.name}`}
        right={
          <>
            <GlobalNavLinks variant="light" />
            <Link
              href={`/compare?with=${country.code}`}
              className="flex items-center gap-1.5 rounded-lg border border-page-border px-3 py-2 text-[12.5px] text-page-text-muted transition-colors hover:text-page-text"
            >
              <Scale size={14} strokeWidth={2.25} />
              Compare
            </Link>
          </>
        }
      />
      <div className="mx-auto max-w-[1240px] px-6 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-page-text-muted transition-colors hover:text-page-text"
        >
          ← World Map
        </Link>

        <CountryHeader country={country} />

        <div className="mt-5">
          <RecentUpdateBanner country={country} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[168px_1fr]">
          <CountryToc />
          <main className="grid min-w-0 grid-cols-1 gap-5">
            <OverviewSection overview={country.overview} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <AtAGlanceCard country={country} />
              <CurrentDirectionCard direction={country.currentDirection} />
            </div>

            <RecentDevelopmentsSection
              items={country.recentDevelopments}
              sources={country.sources}
            />
            <PolicyRegulationSection items={country.policyAndRegulation} sources={country.sources} />
            <ResearchEcosystemSection
              summary={country.researchEcosystem.summary}
              sourceIds={country.researchEcosystem.sourceIds}
              sources={country.sources}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <CompaniesSection items={country.companies} />
              <CloudInfrastructureSection
                providers={country.cloudInfrastructure.providers}
                dominance={country.cloudInfrastructure.dominance}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <UniversitiesSection items={country.universities} />
              <ThinkTanksSection items={country.thinkTanks} />
              <GovernmentInstitutionsSection items={country.governmentInstitutions} />
            </div>

            <NotableGapsSection items={country.notableGaps} />

            <KeyPeopleSection people={country.keyPeople} influenceMap={country.influenceMap} />
            <PeopleToFollowSection items={country.peopleToFollow} />
            <DebatesSection items={country.debates} sources={country.sources} />
            <KnowledgeHubSection items={country.knowledgeHub} />
            <SourcesWeightingSection items={country.sources} />
          </main>
        </div>
      </div>
    </div>
  );
}
