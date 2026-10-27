"use client";

import { useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Settled<T> {
  key: string;
  data: T | null;
  error: string | null;
}

/** Runs `fn` whenever `key` changes; aborts the previous request. `fn` must be stable for a given key. */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, key: string): AsyncState<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fn(ctrl.signal)
      .then((data) => setSettled({ key, data, error: null }))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setSettled({ key, data: null, error: e instanceof Error ? e.message : "เกิดข้อผิดพลาด" });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Loading until a result for the current key arrives; keep showing the previous data meanwhile.
  const loading = settled?.key !== key;
  return { data: settled?.data ?? null, loading, error: loading ? null : (settled?.error ?? null) };
}
