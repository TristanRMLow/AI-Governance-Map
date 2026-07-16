"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Scale } from "lucide-react";
import type { CountryMeta } from "@/lib/types";
import type { SearchEntry } from "@/lib/searchTypes";
import { NavBar } from "@/components/layout/NavBar";
import { CountrySearch, type SearchSelection } from "@/components/search/CountrySearch";
import { WorldMap, type WorldMapHandle, type HoverInfo } from "@/components/map/WorldMap";
import { MapHoverTooltip } from "@/components/map/MapHoverTooltip";
import { navigateWithTransition } from "@/lib/viewTransition";
import { getFreshnessState } from "@/lib/dates";

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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-bg/95 via-bg/50 to-transparent pb-6 pt-16">
        <div className="pointer-events-auto mx-auto flex max-w-[1400px] flex-col gap-2.5 px-6">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-faint">
            Covered jurisdictions
          </span>
          <div className="flex flex-wrap gap-2">
            {countries.map((c) => {
              const freshness = getFreshnessState(c);
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => navigateWithTransition(router, `/country/${c.code}`)}
                  className="group flex items-center gap-2 rounded-full border border-border-strong bg-bg-elevated/80 py-1.5 pl-2 pr-3.5 text-[12.5px] text-text backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-bg-elevated-hover"
                  style={{ borderColor: `${c.accentColor.dark}55` }}
                >
                  <span aria-hidden className="text-[15px] leading-none">
                    {c.flagEmoji}
                  </span>
                  <span className="text-text-muted group-hover:text-text">{c.name}</span>
                  {freshness !== "stale" && (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          freshness === "major" ? "var(--status-warning)" : "var(--status-good)",
                      }}
                      title={
                        freshness === "major"
                          ? "Major development this cycle"
                          : "Recent development this cycle"
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
