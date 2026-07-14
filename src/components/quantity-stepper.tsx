import { cn } from "@/lib/utils";
import { MAX_QTY } from "@/state/reducer";
import { AddIcon, MinusIcon } from "@/components/icons";

interface QuantityStepperProps {
  value: number;
  onDelta: (delta: 1 | -1) => void;
  label: string;
  disabled?: boolean;
  size?: "md" | "sm";
}

export default function QuantityStepper({
  value,
  onDelta,
  label,
  disabled = false,
  size = "md",
}: QuantityStepperProps) {
  const sm = size === "sm";
  const buttonBase =
    "flex size-5 items-center justify-center rounded disabled:*:opacity-40";
  const minusClass = cn(
    buttonBase,
    sm
      ? "border border-transparent bg-white disabled:border-gray-400 disabled:bg-porcelain disabled:*:opacity-100"
      : "border-2 border-gray-300 bg-white",
  );
  const plusClass = cn(
    buttonBase,
    sm
      ? "border border-transparent bg-white disabled:border-gray-400 disabled:bg-porcelain disabled:*:opacity-100"
      : "border-2 border-transparent bg-gray-200",
  );

  return (
    <span
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center py-1",
        sm ? "w-18 justify-between" : "w-20 justify-center gap-2.5",
      )}
    >
      <button
        type="button"
        className={minusClass}
        aria-label={`Decrease ${label}`}
        disabled={disabled || value <= 0}
        onClick={() => onDelta(-1)}
      >
        <MinusIcon className="h-[0.1rem] w-2" />
      </button>
      <span
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "text-obsidian text-center tabular-nums",
          sm
            ? "min-w-2 text-sm leading-4 font-semibold"
            : "min-w-2.5 text-base leading-5 font-medium",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        className={plusClass}
        aria-label={`Increase ${label}`}
        disabled={disabled || value >= MAX_QTY}
        onClick={() => onDelta(1)}
      >
        <AddIcon className="size-2" />
      </button>
    </span>
  );
}
