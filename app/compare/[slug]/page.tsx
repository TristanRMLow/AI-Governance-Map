import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComparisonBySlug, FLAGSHIP_SLUGS } from "@/lib/getComparisonData";
import { getCountryMeta } from "@/lib/getCountryData";
import { ComparisonView } from "@/components/compare/ComparisonView";
import type { RelatedComparisonInfo } from "@/components/compare/RelatedComparisonsSection";
import type { CountryMeta } from "@/lib/types";

export function generateStaticParams() {
  return FLAGSHIP_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return {};
  return {
    title: `${comparison.title} — AI Governance World Map`,
    description: comparison.tagline,
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const countries = comparison.countries
    .map((code) => getCountryMeta(code))
    .filter((c): c is CountryMeta => Boolean(c));

  const related: RelatedComparisonInfo[] = comparison.relatedSlugs
    .map((rSlug) => {
      const rCountries = rSlug
        .split("-")
        .map((code) => getCountryMeta(code))
        .filter((c): c is CountryMeta => Boolean(c));
      if (rCountries.length === 0) return null;
      return { slug: rSlug, countries: rCountries };
    })
    .filter((r): r is RelatedComparisonInfo => Boolean(r));

  return <ComparisonView comparison={comparison} countries={countries} related={related} />;
}
