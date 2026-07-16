"use client";

import { useEffect, useState } from "react";
import type { CountryMeta } from "@/lib/types";
import type { HoverInfo } from "@/components/map/WorldMap";
import { daysAgo } from "@/lib/dates";

export function MapHoverTooltip({
  info,
  countries,
}: {
  info: HoverInfo | null;
  countries: CountryMeta[];
}) {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!info) return null;

  const meta = info.code ? countries.find((c) => c.code === info.code) : undefined;
  const flipLeft = info.x > viewportWidth - 260;

  return (
    <div
      className="pointer-events-none absolute z-30 w-60 rounded-xl border p-3.5 shadow-2xl shadow-black/50 backdrop-blur-md transition-[left,top] duration-150 ease-out"
      style={{
        left: flipLeft ? info.x - 244 : info.x + 18,
        top: info.y + 18,
        background: "var(--color-bg-elevated)",
        borderColor: meta ? `${meta.accentColor.dark}66` : "var(--color-border-strong)",
        boxShadow: meta ? `0 12px 32px -8px ${meta.accentColor.dark}55` : undefined,
      }}
    >
      <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-text">
        {meta && <span aria-hidden>{meta.flagEmoji}</span>}
        {info.name}
      </p>
      {meta ? (
        <>
          <p className="mt-1.5 text-[12px] text-text-muted">
            Latest update: <span className="text-text">{daysAgo(meta.lastUpdated)}</span>
          </p>
          <p className="mt-0.5 text-[12px] text-text-muted">
            <span className="text-text">{meta.newDevelopmentsCount}</span> new developments
          </p>
          <p className="mt-2 text-[12px] font-medium" style={{ color: meta.accentColor.dark }}>
            Click to explore →
          </p>
        </>
      ) : (
        <p className="mt-1.5 text-[12px] text-text-faint">
          Not yet on the intelligence platform
        </p>
      )}
    </div>
  );
}
