"use client";

import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function Clock({ className }: { className?: ClassValue }) {
  const [time, setTime] = useState<string>();
  const isMounted = useMounted();

  useEffect(() => {
    // Create interval
    const interval = setInterval(() => {
      const time = dayjs().format("HH:mm:ss");
      setTime(time);
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  return <span className={cn("text-6xl font-bold", className)}>{time}</span>;
}
