"use client";

import { PrayerCountdown } from "@/components/prayertime/PrayerCountdown";
import { PrayerLabel } from "@/components/prayertime/types";
import usePrayertime from "@/components/prayertime/usePrayertime";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useIsTv } from "@/lib/hooks/useIsTv";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { CloudMoon, CloudSun, Haze, LucideIcon, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { Suspense } from "react";

function getIcon(label: PrayerLabel) {
  let Icon: LucideIcon;

  switch (label) {
    case "Imsyak":
      Icon = CloudMoon;
      break;
    case "Subuh":
      Icon = Haze;
      break;
    case "Syuruq":
      Icon = Sunrise;
      break;
    case "Dzuhur":
      Icon = Sun;
      break;
    case "Ashar":
      Icon = CloudSun;
      break;
    case "Maghrib":
      Icon = Sunset;
      break;
    case "Isya":
      Icon = Moon;
      break;
    default:
      Icon = Sun;
  }

  return Icon;
}

function TimeCard({
  label,
  time,
  isActive,
  isIncoming,
}: {
  label: PrayerLabel;
  time: string;
  isActive: boolean;
  isIncoming: boolean;
}) {
  const { isFullscreen } = useFullscreen();
  const isTv = useIsTv();
  const Icon = getIcon(label);

  return (
    <div
      className={cn(
        "w-full h-auto p-2 text-white/80 text-2xl overflow-hidden rounded-lg",
        !isFullscreen && "text-xl",
        isTv && "text-3xl px-2 py-6",
        isActive && "bg-white text-emerald-800",
        isIncoming && "bg-emerald-800"
      )}
    >
      <div
        className={cn(
          "grid grid-cols-3 gap-4 items-center w-max mx-auto",
          isTv && "gap-8 grid-cols-5 w-full"
        )}
      >
        <Icon className={cn("col-span-1 w-10 h-10", isTv && "w-12 h-12")} />

        <div
          className={cn(
            "col-span-2 flex flex-col w-full items-start",
            isTv && "col-span-4 w-full flex-row justify-between text-5xl"
          )}
        >
          <span className="font-bold">{label}</span>
          <span className={cn(isTv && "font-bold")}>{time}</span>
        </div>
      </div>
    </div>
  );
}

function PrayertimeContent({ className }: { className?: ClassValue }) {
  const { times, currentPrayer, nextPrayer } = usePrayertime();

  if (!times) return <></>;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 h-full w-full p-2 justify-between items-center bg-emerald-800/20 rounded-lg",
        className
      )}
    >
      <PrayerCountdown />

      <div className="flex flex-col justify-evenly gap-2 w-full h-full p-2 bg-emerald-800/40 rounded-lg">
        {Object.entries(times).map(([label, time]) => (
          <TimeCard
            key={"timecard_" + label}
            label={label as PrayerLabel}
            time={time}
            isActive={label === currentPrayer}
            isIncoming={label === nextPrayer}
          />
        ))}
      </div>
    </div>
  );
}

export function PrayerTime(props: { className?: ClassValue }) {
  return (
    <Suspense fallback={<div className={cn(props.className)}>Loading...</div>}>
      <PrayertimeContent {...props} />
    </Suspense>
  );
}
