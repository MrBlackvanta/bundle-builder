import Price from "@/components/price";
import QuantityStepper from "@/components/quantity-stepper";
import VariantSelector from "@/components/variant-selector";
import type { Product } from "@/data/data.types";
import { cn } from "@/lib/utils";
import { useBuilder } from "@/state/builder-context";
import {
  getActiveVariantId,
  getProductTotalQty,
  getQty,
} from "@/state/selectors";
import Image from "next/image";

function cardShell(selected: boolean) {
  return cn(
    "relative flex flex-col items-center rounded-[0.625rem] border-2 bg-white p-2.75 xl:flex-row",
    selected ? "border-wyze-purple/70 gap-4.75" : "border-transparent gap-3.25",
  );
}

function CardMedia({ product }: { product: Product }) {
  return (
    <div className="relative flex h-38 w-full items-center justify-center xl:h-34.25 xl:w-25.25 xl:flex-none">
      {product.badge && (
        <span className="bg-wyze-purple absolute top-0 left-0 z-1 rounded-[0.625rem] px-1.5 py-0.5 text-xs leading-normal font-semibold text-white">
          {product.badge}
        </span>
      )}
      <Image
        src={product.image}
        alt=""
        width={280}
        height={280}
        sizes="(min-width: 1280px) 101px, 152px"
        className="h-full w-auto rounded-[0.3125rem] object-contain"
      />
    </div>
  );
}

function CardText({ product }: { product: Product }) {
  return (
    <div className="flex w-full flex-col gap-2 tracking-[0.6px]">
      <h4 className="text-charcoal text-base leading-none font-semibold">
        {product.name}
      </h4>
      <p className="text-charcoal/75 text-xs leading-[1.3] font-medium">
        {product.description}{" "}
        <a
          className="text-link-blue underline"
          href={product.learnMoreUrl ?? "#"}
        >
          Learn More
        </a>
      </p>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useBuilder();
  const variantId = getActiveVariantId(state, product);
  const qty = getQty(state, product.id, variantId);
  const selected = getProductTotalQty(state, product) > 0;

  return (
    <article className={cardShell(selected)}>
      <CardMedia product={product} />
      <div className="flex w-full min-w-0 flex-col gap-2.5 xl:w-auto xl:flex-1">
        <CardText product={product} />
        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            product={product}
            value={variantId}
            onChange={(id) =>
              dispatch({
                type: "selectVariant",
                productId: product.id,
                variantId: id,
              })
            }
          />
        )}
        <div className="mt-auto flex w-full items-end justify-between gap-2.5">
          <QuantityStepper
            value={qty}
            disabled={product.locked}
            label={`${product.name} quantity`}
            onDelta={(delta) =>
              dispatch({
                type: "adjustQty",
                productId: product.id,
                variantId,
                delta,
              })
            }
          />
          <Price
            price={product.price}
            compareAt={product.compareAtPrice}
            perMonth={product.perMonth}
            context="card"
          />
        </div>
      </div>
    </article>
  );
}

export function PlanCard({
  product,
  checked,
}: {
  product: Product;
  checked: boolean;
}) {
  const { dispatch } = useBuilder();
  return (
    <label
      className={cn(
        cardShell(checked),
        "has-[input:focus-visible]:outline-wyze-purple cursor-pointer has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2",
      )}
    >
      <input
        className="sr-only"
        type="radio"
        name={`step-${product.stepId}`}
        checked={checked}
        onChange={() =>
          dispatch({
            type: "selectSingle",
            stepId: product.stepId,
            productId: product.id,
          })
        }
      />
      <CardMedia product={product} />
      <div className="flex w-full min-w-0 flex-col gap-2.5 xl:w-auto xl:flex-1">
        <CardText product={product} />
        <div className="mt-auto flex w-full items-end justify-between gap-2.5">
          <span
            className={cn(
              "border-wyze-purple text-wyze-purple inline-flex items-center rounded-full border-[1.5px] px-3.5 py-1.5 text-[0.8125rem] font-semibold motion-safe:transition-colors",
              checked && "bg-wyze-purple text-white",
            )}
          >
            {checked ? "Selected" : "Select plan"}
          </span>
          <Price
            price={product.price}
            compareAt={product.compareAtPrice}
            perMonth={product.perMonth}
            context="card"
          />
        </div>
      </div>
    </label>
  );
}
