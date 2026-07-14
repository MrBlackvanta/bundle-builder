import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface PriceProps {
  price: number;
  compareAt?: number;
  perMonth?: boolean;
  context: "card" | "review";
}

export default function Price({
  price,
  compareAt,
  perMonth,
  context,
}: PriceProps) {
  const suffix = perMonth ? "/mo" : "";
  const review = context === "review";
  return (
    <span
      className={cn(
        "flex flex-col items-end whitespace-nowrap",
        review
          ? "tracking-[0.06px] sm:tracking-[0.07px]"
          : "gap-0.75 text-base leading-none tracking-[0.6px]",
      )}
    >
      {compareAt != null && (
        <s
          className={cn(
            "font-medium",
            review
              ? "text-xs leading-4 text-gray-600 sm:text-sm"
              : "text-strike-red font-normal",
          )}
        >
          {formatMoney(compareAt)}
          {suffix}
        </s>
      )}
      <span
        className={cn(
          review
            ? "text-wyze-purple text-xs leading-4 font-semibold sm:text-sm"
            : "font-normal text-gray-700",
        )}
      >
        {price === 0 ? "FREE" : `${formatMoney(price)}${suffix}`}
      </span>
    </span>
  );
}
