"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // if you're using Tailwind className utility
import { Minus, Plus } from "lucide-react";

interface NumberInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = ({
  label,
  value,
  onChange,
  className,
  min = -9999,
  max = 9999,
  step = 1,
}: NumberInputProps) => {
  const handleIncrement = () => {
    if (value + step <= max) onChange(value + step);
  };

  const handleDecrement = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue <= max && newValue >= min) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button size="sm" variant="outline" onClick={handleDecrement}>
        <Minus className="w-4 h-4" />
      </Button>
      <input
        placeholder="0"
        type="number"
        value={value}
        onChange={handleChange}
        className="w-20 text-center p-2 border rounded"
      />
      <Button size="sm" variant="outline" onClick={handleIncrement}>
        <Plus className="w-4 h-4" />
      </Button>
      {label && <span className="ml-2 text-sm text-gray-600">{label}</span>}
    </div>
  );
};
