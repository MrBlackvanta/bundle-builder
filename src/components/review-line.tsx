import Image from "next/image";
import type { LineItem } from "@/state/selectors";
import { DEFAULT_VARIANT } from "@/state/selectors";
import { useBuilder } from "@/state/builder-context";
import QuantityStepper from "@/components/quantity-stepper";
import Price from "@/components/price";
import { PlanLogoIcon } from "@/components/icons";

export const reviewLineClass =
  "grid grid-cols-[2.5625rem_minmax(0,1fr)_4.5rem_auto] items-center gap-x-3 [&>:last-child]:ml-1";
export const reviewThumbClass =
  "flex size-10.25 items-center justify-center overflow-hidden rounded-[0.3125rem] bg-white";
export const reviewNameClass =
  "text-xs leading-4 font-medium tracking-[0.06px] text-obsidian sm:text-sm sm:tracking-[0.07px]";

interface ReviewLineProps {
  item: LineItem;
  showVariant: boolean;
}

export default function ReviewLine({ item, showVariant }: ReviewLineProps) {
  const { dispatch } = useBuilder();
  const { product, variant, qty } = item;

  if (product.reviewCategory === "Plan") {
    return (
      <li className="flex items-start justify-between">
        <BrandName name={product.name} />
        <Price
          context="review"
          price={item.lineTotal}
          compareAt={item.lineCompareAt}
          perMonth={product.perMonth}
        />
      </li>
    );
  }

  const stepperLabel = `${product.name}${variant ? ` (${variant.label})` : ""} quantity`;
  return (
    <li className={reviewLineClass}>
      <span className={reviewThumbClass}>
        <Image
          src={product.image}
          alt=""
          width={41}
          height={41}
          sizes="41px"
          className="size-full object-contain"
        />
      </span>
      <span className={reviewNameClass}>
        {product.name}
        {showVariant && variant && (
          <span className="block text-[0.6875rem] text-gray-600">
            {variant.label}
          </span>
        )}
      </span>
      <QuantityStepper
        size="sm"
        value={qty}
        disabled={product.locked}
        label={stepperLabel}
        onDelta={(delta) =>
          dispatch({
            type: "adjustQty",
            productId: product.id,
            variantId: variant?.id ?? DEFAULT_VARIANT,
            delta,
          })
        }
      />
      <Price
        context="review"
        price={item.lineTotal}
        compareAt={item.lineCompareAt}
      />
    </li>
  );
}

export function BrandName({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span className="inline-flex items-center gap-0.75 text-sm leading-none font-bold tracking-[-0.028px] sm:text-base sm:tracking-[-0.032px]">
      <PlanLogoIcon className="h-4.25 w-3.5 sm:h-[1.48125rem] sm:w-5" />
      <span className="text-black">{first}&nbsp;</span>
      {rest.length > 0 && (
        <span className="text-wyze-purple">{rest.join(" ")}</span>
      )}
    </span>
  );
}
