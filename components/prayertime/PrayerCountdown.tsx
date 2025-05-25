"use client";

import usePrayertime from "@/components/prayertime/usePrayertime";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useIsTv } from "@/lib/hooks/useIsTv";
import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function PrayerCountdown({ className }: { className?: ClassValue }) {
  const isMounted = useMounted();
  const { isFullscreen } = useFullscreen();
  const isTv = useIsTv();
  const { nextPrayer, timeLeft } = usePrayertime();

  // Don't render anything until after mounting
  if (!isMounted) {
    return <></>;
  }

  const [hourLeft, minLeft] = timeLeft.split(":").map(Number);
  const timeLeftLabel = `${hourLeft > 0 ? `${hourLeft} Jam, ` : ""}${minLeft + 1} menit lagi`;

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center w-full px-4 py-1 text-2xl text-emerald-800",
        !isFullscreen && "text-lg",
        isTv && "text-2xl font-bold",
        className
      )}
    >
      <span className="font-bold">Menuju {nextPrayer}</span>
      <span>{timeLeftLabel}</span>
    </div>
  );
}
