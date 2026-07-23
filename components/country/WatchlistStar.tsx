"use client";

import { Star } from "lucide-react";
import { useWatchlist } from "@/lib/useWatchlist";

export function WatchlistStar({ code }: { code: string }) {
  const { isStarred, toggle, hydrated } = useWatchlist();
  const starred = hydrated && isStarred(code);

  return (
    <button
      type="button"
      onClick={() => toggle(code)}
      aria-label={starred ? "Remove from watchlist" : "Add to watchlist"}
      title={starred ? "On your watchlist" : "Add to watchlist"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-page-border text-page-text-muted transition-colors hover:border-page-border-strong hover:text-page-text"
    >
      <Star size={16} strokeWidth={2.25} fill={starred ? "currentColor" : "none"} />
    </button>
  );
}
