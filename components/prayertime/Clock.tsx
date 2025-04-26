"use client";

import { useCurrentTime } from "@/components/prayertime/usePrayertime";
import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function Clock({ className }: { className?: ClassValue }) {
  const time = useCurrentTime();
  const isMounted = useMounted();

  const currentTime = time.format("HH:mm:ss");

  if (!isMounted) {
    return <></>;
  }

  return <span className={cn("text-6xl font-bold", className)}>{currentTime}</span>;
}
