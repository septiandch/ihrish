"use client";

import { PrayerCountdown } from "@/components/prayertime/PrayerCountdown";
import usePrayertime from "@/components/prayertime/usePrayertime";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import dayjs from "dayjs";

function TimeCard({ label, time, isActive }: { label: string; time: string; isActive: boolean }) {
  const [hour, minute, second] = time.split(".").map(Number);
  let prayertime = dayjs().hour(hour).minute(minute).second(second).format("HH:mm");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-4/5 h-auto mx-4 text-white text-lg overflow-hidden rounded-lg",
        isActive && "bg-white text-emerald-800"
      )}
    >
      <span className="text-center font-bold py-1">{label}</span>
      <span className="py-1">{prayertime}</span>
    </div>
  );
}

const PrayerTime = ({ className }: { className?: ClassValue }) => {
  const { times, nextPrayer } = usePrayertime();

  if (!times) return <></>;

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full justify-center items-center gap-1 bg-emerald-600 rounded-lg",
        className
      )}
    >
      <PrayerCountdown />

      {Object.entries(times).map(([label, time]) => (
        <TimeCard
          key={"timecard_" + label}
          label={label}
          time={time}
          isActive={label === nextPrayer}
        />
      ))}
    </div>
  );
};

export default PrayerTime;
