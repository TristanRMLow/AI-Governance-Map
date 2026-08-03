"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "ai-gov-map:watchlist";
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

/** Client-only, localStorage-backed watchlist — no account or backend
 * needed. Lets a returning visitor mark specific jurisdictions and then
 * filter the Timeline/Topics pages down to just those, so the tool can
 * narrow to "what I track" rather than always showing every jurisdiction. Uses
 * useSyncExternalStore (not useState+useEffect) so same-tab toggles and
 * cross-tab storage events both propagate without an SSR hydration mismatch. */
export function useWatchlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const starred = useMemo(() => {
    try {
      return new Set<string>(JSON.parse(raw));
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const toggle = useCallback((code: string) => {
    const current = new Set<string>(JSON.parse(getSnapshot()));
    if (current.has(code)) current.delete(code);
    else current.add(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
    } catch {
      // localStorage unavailable (private browsing, quota) — watchlist just won't persist.
    }
    emitChange();
  }, []);

  const isStarred = useCallback((code: string) => starred.has(code), [starred]);

  return { starred, toggle, isStarred, hydrated: true };
}
