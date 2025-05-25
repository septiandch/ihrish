"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useIsTv(defaultValue = false): boolean {
  const params = useSearchParams();

  const isTv = useMemo(() => {
    if (!params) return defaultValue;
    return params.get("display") === "tv";
  }, [params, defaultValue]);

  return isTv;
}
