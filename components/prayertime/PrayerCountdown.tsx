"use client";

import usePrayertime from "@/components/prayertime/usePrayertime";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function PrayerCountdown({ className }: { className?: ClassValue }) {
  const isMounted = useMounted();
  const { isFullscreen } = useFullscreen();
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
        !isFullscreen && "text-xl",
        className
      )}
    >
      <span>Menuju {nextPrayer}</span>
      <span className="font-bold text-lg">{timeLeftLabel}</span>
    </div>
  );
}
