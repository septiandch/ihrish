"use client";

import { usePrayerCountdown } from "@/components/prayertime/usePrayertime";
import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function PrayerCountdown({ className }: { className?: ClassValue }) {
  const isMounted = useMounted();
  const { countdown } = usePrayerCountdown();

  // Don't render anything until after mounting
  if (!isMounted) {
    return <></>;
  }

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center w-max px-4 py-1 text-lg text-white bg-emerald-600 rounded-md",
        className
      )}
    >
      <span className="font-bold">Menuju {countdown.label}</span>
      <span>-{countdown.time}</span>
    </div>
  );
}
