import GuaranteeSeal from "@/components/guarantee-seal";
import { DeliveryIcon } from "@/components/icons";
import Price from "@/components/price";
import ReviewLine, {
  reviewNameClass,
  reviewThumbClass,
} from "@/components/review-line";
import type { ReviewCategory } from "@/data/data.types";
import { formatMoney } from "@/lib/money";
import { useBuilder } from "@/state/builder-context";
import { getLineItems, getReviewGroups, getTotals } from "@/state/selectors";
import { useEffect, useRef, useState } from "react";

const GROUP_LABELS: Record<
  ReviewCategory,
  { label: string; mobileLabel?: string }
> = {
  Cameras: { label: "Cameras" },
  Sensors: { label: "Sensors" },
  Accessories: { label: "Accessories" },
  Plan: { label: "Plan", mobileLabel: "Home Monitoring Plan" },
};

const groupClass = "flex flex-col gap-2 border-t border-gray-400 pt-3.75";
const groupLabelClass =
  "text-xs leading-4 font-normal tracking-[0.36px] uppercase text-gray-500";

export default function ReviewPanel() {
  const { catalog, state, save } = useBuilder();
  const groups = getReviewGroups(catalog, state);
  const totals = getTotals(catalog, state);
  const { meta } = catalog;

  const linesPerProduct = new Map<string, number>();
  for (const item of getLineItems(catalog, state)) {
    linesPerProduct.set(
      item.product.id,
      (linesPerProduct.get(item.product.id) ?? 0) + 1,
    );
  }

  const [toast, setToast] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    [],
  );

  const flash = (apply: () => void, revert: () => void, ms: number) => {
    apply();
    timers.current.push(window.setTimeout(revert, ms));
  };

  const monthly = Math.round(totals.total * meta.asLowAsRate);

  return (
    <aside
      aria-labelledby="review-title"
      className="bg-surface-blue -mx-(--page-pad) pt-3.75 sm:mx-0 sm:rounded-[0.625rem]"
    >
      <p className="v-kicker px-3.75 pb-1.25 sm:hidden xl:block xl:text-xs">
        Review
      </p>
      <div className="px-5 pt-5 pb-7.75">
        <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-[552fr_486fr] sm:items-start sm:gap-x-13 sm:gap-y-2 xl:flex xl:flex-col">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1.25 tracking-[0.6px]">
              <h2
                id="review-title"
                className="text-review-title text-charcoal font-semibold"
              >
                Your security system
              </h2>
              <p className="text-charcoal/75 text-xs leading-[1.3] font-medium sm:text-sm">
                Review your personalized protection system designed to keep what
                matters most safe.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {groups.map((group) => {
                const labels = GROUP_LABELS[group.category];
                return (
                  <section
                    key={group.category}
                    className={groupClass}
                    aria-label={labels.label}
                  >
                    <h3 className={groupLabelClass}>
                      {labels.mobileLabel ? (
                        <>
                          <span className="sm:hidden">
                            {labels.mobileLabel}
                          </span>
                          <span className="hidden sm:inline">
                            {labels.label}
                          </span>
                        </>
                      ) : (
                        labels.label
                      )}
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {group.items.map((item) => (
                        <ReviewLine
                          key={`${item.product.id}-${item.variant?.id ?? "default"}`}
                          item={item}
                          showVariant={
                            (linesPerProduct.get(item.product.id) ?? 0) > 1
                          }
                        />
                      ))}
                    </ul>
                  </section>
                );
              })}
              <div className={groupClass}>
                <div className="grid grid-cols-[2.5625rem_minmax(0,1fr)_auto] items-center gap-x-3 *:last:ml-1">
                  <span className={reviewThumbClass}>
                    <DeliveryIcon className="size-7.25" />
                  </span>
                  <span className={reviewNameClass}>{meta.shipping.label}</span>
                  <Price
                    context="review"
                    price={meta.shipping.price}
                    compareAt={meta.shipping.compareAtPrice}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="v-summary">
            <div className="[grid-area:seal]">
              <GuaranteeSeal />
            </div>
            <div className="hidden tracking-[0.6px] [grid-area:returns] sm:block xl:hidden">
              <h3 className="text-charcoal mb-2 text-lg leading-[1.1] font-semibold">
                {meta.guarantee.headline}
              </h3>
              <p className="text-charcoal text-lg leading-[1.1] font-normal">
                {meta.guarantee.body}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 [grid-area:totals] sm:w-full sm:flex-row sm:items-center sm:justify-between xl:w-auto xl:flex-col xl:items-end">
              <span className="bg-wyze-purple rounded-[0.1875rem] px-2 py-1.25 text-xs font-medium tracking-[-0.6px] whitespace-nowrap text-white">
                as low as {formatMoney(monthly)}/mo
              </span>
              <p className="flex items-baseline gap-2 whitespace-nowrap">
                <s className="text-lg leading-5 font-medium tracking-[0.045px] text-gray-600">
                  {formatMoney(totals.compareAt)}
                </s>{" "}
                <strong className="text-wyze-purple text-2xl leading-8 font-bold tracking-[-0.03px]">
                  {formatMoney(totals.total)}
                </strong>
              </p>
            </div>
            <p
              aria-live="polite"
              className="text-jade pt-2.5 text-center text-xs leading-none font-semibold tracking-[-0.056px] [grid-area:savings] sm:text-sm"
            >
              Congrats! You&rsquo;re saving {formatMoney(totals.savings)} on
              your security bundle!
            </p>
            <button
              type="button"
              className="bg-wyze-purple font-checkout text-cta hover:bg-purple-hover w-full rounded px-4 py-3.25 font-bold text-white [grid-area:checkout] motion-safe:transition-colors"
              onClick={() =>
                flash(
                  () =>
                    setToast(
                      "This is a prototype — checkout is not connected yet.",
                    ),
                  () => setToast(null),
                  4000,
                )
              }
            >
              Checkout
            </button>
            <p
              role="status"
              className="text-ink-muted min-h-[1em] text-center text-xs [grid-area:toast]"
            >
              {toast}
            </p>
            <button
              type="button"
              className="text-ink-muted mt-1 justify-self-center text-xs leading-[1.2] tracking-[-0.016px] italic underline [grid-area:save] sm:text-sm"
              onClick={() =>
                flash(
                  () => setSavedFlash(save()),
                  () => setSavedFlash(false),
                  2500,
                )
              }
            >
              {savedFlash ? "System saved ✓" : "Save my system for later"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
