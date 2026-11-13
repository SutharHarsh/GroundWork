"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Per-device UI preferences stored in localStorage (theme, expanded roadmap domains, filters).
 * Learning data never lives here — it is always saved on the server.
 *
 * Built on useSyncExternalStore: the server snapshot is the default, so hydration never
 * mismatches, and the stored value is applied right after hydration. Changes sync across tabs.
 */
const PREFIX = "groundwork:";
const EVENT = "groundwork-storage";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writePersistent(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the UI still works for this visit.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

function subscribe(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

export function usePersistentState<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const value = useMemo<T>(() => {
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
    // fallback is intentionally not a dependency: callers pass literals
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = (() => {
        const r = read(key);
        if (r == null) return fallback;
        try {
          return JSON.parse(r) as T;
        } catch {
          return fallback;
        }
      })();
      writePersistent(key, typeof next === "function" ? (next as (p: T) => T)(current) : next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

/* ── Theme ─────────────────────────────────────────────────────────────── */

export type ThemeChoice = "system" | "light" | "dark";
export const THEME_KEY = "theme";

/** Inline script for <head>: applies the saved theme before first paint (no flash). */
export const THEME_SCRIPT = `(function(){try{var t=JSON.parse(localStorage.getItem("${PREFIX}${THEME_KEY}"));if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function applyTheme(theme: ThemeChoice) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}
