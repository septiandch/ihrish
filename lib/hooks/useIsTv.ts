"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useIsTv(): boolean {
  const params = useSearchParams();

  const isTv = useMemo(() => {
    return params.get("display") === "tv";
  }, [params]);

  return isTv;
}
