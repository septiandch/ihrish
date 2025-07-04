"use client";

import usePrayertime from "@/components/prayertime/usePrayertime";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useIsTv } from "@/lib/hooks/useIsTv";
import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { Suspense } from "react";

function PrayerCountdownContent({ className }: { className?: ClassValue }) {
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
        isTv && "text-4xl font-bold gap-2",
        className
      )}
    >
      <span className="font-bold">Menuju {nextPrayer}</span>
      <span>{timeLeftLabel}</span>
    </div>
  );
}

export function PrayerCountdown(props: { className?: ClassValue }) {
  return (
    <Suspense fallback={<div className={cn(props.className)}>Loading...</div>}>
      <PrayerCountdownContent {...props} />
    </Suspense>
  );
}
