import { useIsTv } from "@/lib/hooks/useIsTv";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Clock } from "../prayertime";
import Date from "../prayertime/Date";

const TimeDisplay = () => {
  const isTv = useIsTv();

  if (isTv) {
    return <AltTimeDisplay />;
  }

  return (
    <div className="flex justify-center items-end gap-4 py-1 text-white transition-transform duration-700 ease-in-out">
      <Date className="text-2xl" />
      <Clock className="pb-1 text-7xl" />
    </div>
  );
};

export default TimeDisplay;

const AltTimeDisplay = () => {
  const [showClock, setShowClock] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const loop = () => {
      timer = setTimeout(
        () => {
          setShowClock((prev) => !prev);
          loop();
        },
        showClock ? 10000 : 5000
      ); // 5s clock, 2s date
    };

    loop();

    return () => clearTimeout(timer);
  }, [showClock]);

  return (
    <div className="relative h-full w-full overflow-hidden py-1 text-white">
      <div
        className={cn(
          "absolute top-0 right-0 transition-transform duration-700 ease-in-out",
          showClock ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <Clock className="text-8xl" />
      </div>

      <div
        className={cn(
          "absolute top-3 right-0 transition-transform duration-700 ease-in-out",
          showClock ? "translate-y-full" : "-translate-y-0"
        )}
      >
        <Date className="text-4xl font-bold" />
      </div>
    </div>
  );
};
