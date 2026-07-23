"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PanelRight, Scale } from "lucide-react";
import type { CountryMeta } from "@/lib/types";
import type { SearchEntry } from "@/lib/searchTypes";
import { NavBar } from "@/components/layout/NavBar";
import { GlobalNavLinks } from "@/components/layout/GlobalNavLinks";
import { CountrySearch, type SearchSelection } from "@/components/search/CountrySearch";
import { WorldMap, type WorldMapHandle, type HoverInfo } from "@/components/map/WorldMap";
import { MapHoverTooltip } from "@/components/map/MapHoverTooltip";
import { JurisdictionsDrawer } from "@/components/home/JurisdictionsDrawer";
import { navigateWithTransition } from "@/lib/viewTransition";

export function HomeView({
  countries,
  searchIndex,
}: {
  countries: CountryMeta[];
  searchIndex: SearchEntry[];
}) {
  const mapRef = useRef<WorldMapHandle>(null);
  const router = useRouter();
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleSelect(selection: SearchSelection) {
    if (selection.singleCountry) {
      mapRef.current?.flyToCountry(selection.singleCountry);
    } else {
      mapRef.current?.highlightIso3(selection.iso3, selection.centers);
    }
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg">
      <WorldMap ref={mapRef} countries={countries} onHover={setHover} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(10,12,16,0.32) 100%)",
        }}
      />
      <MapHoverTooltip info={hover} countries={countries} />

      <NavBar
        variant="overlay"
        right={
          <>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-bg-elevated/80 px-3 py-2 text-[12.5px] text-text-muted backdrop-blur-md transition-colors hover:text-text"
            >
              <PanelRight size={14} strokeWidth={2.25} />
              Jurisdictions ({countries.length})
            </button>
            <GlobalNavLinks variant="overlay" />
            <button
              type="button"
              onClick={() => navigateWithTransition(router, "/compare")}
              className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-bg-elevated/80 px-3 py-2 text-[12.5px] text-text-muted backdrop-blur-md transition-colors hover:text-text"
            >
              <Scale size={14} strokeWidth={2.25} />
              Compare
            </button>
            <CountrySearch
              countries={countries}
              searchIndex={searchIndex}
              onSelect={handleSelect}
            />
          </>
        }
      />

      <JurisdictionsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        countries={countries}
      />
    </div>
  );
}
