"use client";

import FlipDisplay from "@/components/FlipDisplay";
import usePrayerSession from "@/components/prayertime/usePrayerSession";
import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";

export function PrayerSession() {
  const isMounted = useMounted();
  const { countMode, label, isAdhan, isPraying } = usePrayerSession();

  if (!isMounted || !countMode) {
    return <></>;
  }

  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-50 font-bold">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-emerald-800 bg-gradient-to-b from-emerald-500 to-emerald-600" />

      <div
        className={cn(
          "absolute inset-0 w-full h-full flex items-center justify-center bg-black animate-fadein",
          !isPraying && "hidden"
        )}
      />

      <div
        className={cn(
          "relative flex items-center justify-center h-full text-gray-100 transition-all duration-1000",
          isPraying && "text-gray-300 animate-fadeout"
        )}
      >
        <div
          className={cn(
            "w-auto max-w-4/5 p-8 rounded-lg text-center flex flex-col gap-4 items-center",
            isPraying && "opacity-0 animate-fadein delay-1000"
          )}
        >
          <span key={label.main} className="text-6xl whitespace-pre-wrap text-shadow-md">
            {label.main}
          </span>
          <span
            className={cn(
              "text-[10rem] whitespace-pre-wrap",
              (isAdhan || isPraying) && "text-4xl font-normal text-shadow-md",
              !label.sub && "hidden"
            )}
          >
            {label.sub}
          </span>

          {!!label.count && (
            <FlipDisplay
              num={label.count}
              className="bg-emerald-800/20 shadow-lg mt-8"
              containerClass="w-36 h-56 text-[12rem] text-emerald-700"
              digitClass="ring-2 ring-emerald-600"
              nonFlipClass="text-[10em] text-gray-100"
            />
          )}
        </div>
      </div>
    </div>
  );
}
