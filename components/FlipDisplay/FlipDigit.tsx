import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { useEffect, useRef, useState } from "react";

export type FlipDigitProps = {
  digit: string;
  containerClass?: ClassValue;
  digitClass?: ClassValue;
};

export function FlipDigit({ digit, containerClass, digitClass }: FlipDigitProps) {
  const prevDigitRef = useRef(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== prevDigitRef.current) {
      setFlipping(true);
      const midTimeout = setTimeout(() => setNextDigit(digit), 300);
      const endTimeout = setTimeout(() => {
        prevDigitRef.current = digit;
        setFlipping(false);
      }, 600);
      return () => {
        clearTimeout(midTimeout);
        clearTimeout(endTimeout);
      };
    }
  }, [digit]);

  return (
    <div
      className={cn(
        "relative w-12 h-16 perspective-500 font-bold shadow-sm text-gray-600 text-4xl",
        containerClass
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-md flex items-center justify-center bg-gray-200",
          digitClass
        )}
      >
        {digit}
      </div>

      {/* Top Half */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-md z-10 bg-gray-200",
          "origin-bottom transition-transform duration-300",
          flipping && "animate-flip-top",
          digitClass,
          "outline-0"
        )}
      >
        <div className="w-full h-full flex items-end justify-center">
          <span className="translate-y-1/2">{prevDigitRef.current}</span>
        </div>
      </div>

      {/* Bottom Half */}
      <div
        className={cn(
          "absolute bottom-0 left-0 w-full h-1/2 overflow-hidden rounded-b-md z-10 bg-gray-200 brightness-95",
          "origin-top transition-transform duration-300 delay-300",
          flipping && "animate-flip-bottom",
          digitClass,
          "outline-0"
        )}
      >
        <div className="w-full h-full flex items-start justify-center">
          <span className="-translate-y-1/2">{nextDigit}</span>
        </div>
      </div>
    </div>
  );
}

export function NonFlipDigit({ digit, className }: { digit: string; className: ClassValue }) {
  return (
    <div
      className={cn(
        "relative w-12 h-16 perspective-500 font-bold text-gray-100 text-4xl",
        className
      )}
    >
      <div className="absolute inset-0 rounded-md flex items-center justify-center text-shadow-sm">
        {digit}
      </div>
    </div>
  );
}
