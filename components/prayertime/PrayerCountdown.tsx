"use client";

import usePrayertime from "@/components/prayertime/usePrayertime";
import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function PrayerCountdown({ className }: { className?: ClassValue }) {
  const isMounted = useMounted();
  const { nextPrayer, timeLeft } = usePrayertime();

  // Don't render anything until after mounting
  if (!isMounted) {
    return <></>;
  }

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center w-full px-4 py-1 text-lg text-emerald-800",
        className
      )}
    >
      <span>Menuju {nextPrayer}</span>
      <span className="font-bold text-sm">{timeLeft}</span>
    </div>
  );
}
