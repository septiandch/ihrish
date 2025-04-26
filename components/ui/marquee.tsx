"use client";

import useMounted from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MarqueeProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function Marquee({ text, className, speed = 2 }: MarqueeProps) {
  const [duration, setDuration] = useState("15s"); // Default duration for SSR
  const isMounted = useMounted();

  useEffect(() => {
    // Calculate animation duration on client-side only
    const containerWidth = window.innerWidth;
    const textWidth = text.length * 8;
    const totalDistance = containerWidth + textWidth;
    setDuration(`${totalDistance / (speed * 100)}s`);
  }, [text, speed]);

  // During SSR and initial client render, use a static duration
  if (!isMounted) {
    return <div className={cn("w-full whitespace-nowrap", className)}>{text}</div>;
  }

  // After mounting, use the calculated duration
  return (
    <div
      className={cn("w-full whitespace-nowrap animate-marquee", className)}
      style={{ animationDuration: duration }}
    >
      {text}
    </div>
  );
}
