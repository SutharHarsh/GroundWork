"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { currentUser, getVersion, subscribe, type LocalUser } from "./store";
import { getFile } from "./files";

export function useLocalVersion() {
  return useSyncExternalStore(subscribe, getVersion, () => -1);
}

/**
 * Runs a query against the local database and re-runs it whenever data changes or `deps` change.
 * Returns undefined until the first result is ready; keeps the previous result while refreshing.
 */
export function useLocal<T>(fn: (user: LocalUser) => Promise<T> | T, deps: readonly unknown[]): T | undefined {
  const version = useLocalVersion();
  const [result, setResult] = useState<{ value: T } | { error: unknown } | undefined>();
  useEffect(() => {
    if (version < 1) return;
    let alive = true;
    Promise.resolve()
      .then(() => fn(currentUser()))
      .then(
        (value) => alive && setResult({ value }),
        (error) => alive && setResult({ error }),
      );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...deps]);
  if (result && "error" in result) throw result.error;
  return result?.value;
}

/** An object URL for a proof file stored in this browser (IndexedDB), or null while loading / missing. */
export function useFileUrl(key: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!key?.startsWith("idb:")) return;
    let alive = true;
    let made: string | null = null;
    getFile(key)
      .then((f) => {
        if (!alive || !f) return;
        made = URL.createObjectURL(f.blob);
        setUrl(made);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      if (made) URL.revokeObjectURL(made);
      setUrl(null);
    };
  }, [key]);
  return url;
}
