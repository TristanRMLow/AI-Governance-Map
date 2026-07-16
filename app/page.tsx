import { getAllCountries } from "@/lib/getCountryData";
import { getSearchIndex } from "@/lib/searchIndex";
import { HomeView } from "@/components/home/HomeView";

export default function Home() {
  const countries = getAllCountries();
  const searchIndex = getSearchIndex();
  return <HomeView countries={countries} searchIndex={searchIndex} />;
}
