import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { FlipDigit, FlipDigitProps, NonFlipDigit } from "./FlipDigit"; // Import from above

export default function FlipDisplay({
  num,
  className,
  nonFlipClass,
  ...rest
}: { num: string; className?: ClassValue; nonFlipClass?: ClassValue } & Omit<
  FlipDigitProps,
  "digit"
>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 bg-gray-50 shadow-md p-4 rounded-lg",
        className
      )}
    >
      {num
        .split("")
        .map((digit, idx) =>
          digit !== ":" ? (
            <FlipDigit key={`digit_${idx}`} digit={digit} {...rest} />
          ) : (
            <NonFlipDigit key={`digit_${idx}`} digit={digit} className={nonFlipClass} />
          )
        )}
    </div>
  );
}
