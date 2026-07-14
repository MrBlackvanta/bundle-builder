import type { Product } from "@/data/data.types";
import { cn } from "@/lib/utils";
import { useBuilder } from "@/state/builder-context";
import { getQty } from "@/state/selectors";
import Image from "next/image";

interface VariantSelectorProps {
  product: Product;
  value: string;
  onChange: (variantId: string) => void;
}

export default function VariantSelector({
  product,
  value,
  onChange,
}: VariantSelectorProps) {
  const { state } = useBuilder();
  return (
    <fieldset>
      <legend className="sr-only">{product.name} color</legend>
      <div className="flex flex-wrap items-end gap-1.5">
        {product.variants!.map((variant) => {
          const inSystem = getQty(state, product.id, variant.id) > 0;
          return (
            <label
              key={variant.id}
              className={cn(
                "flex h-6.5 w-16.25 cursor-pointer items-center justify-center rounded-xs border-[0.5px] py-px",
                "has-[input:focus-visible]:outline-wyze-purple has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2",
                inSystem
                  ? "border-jade bg-[rgba(29,240,187,0.04)] px-0.75"
                  : "border-silver bg-white px-1.25",
              )}
            >
              <input
                className="sr-only"
                type="radio"
                name={`variant-${product.id}`}
                value={variant.id}
                checked={variant.id === value}
                onChange={() => onChange(variant.id)}
              />
              <Image
                src={variant.swatch}
                alt=""
                width={22}
                height={22}
                sizes="22px"
                className="size-5.5 rounded-[0.3125rem] object-contain"
              />
              <span className="text-charcoal text-[0.625rem] leading-none font-medium tracking-[0.6px]">
                {variant.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
