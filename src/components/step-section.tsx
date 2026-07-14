import {
  CameraIcon,
  CarrotIcon,
  ExtrasIcon,
  PlanIcon,
  SensorsIcon,
} from "@/components/icons";
import ProductCard, { PlanCard } from "@/components/product-card";
import type { Step } from "@/data/data.types";
import { cn } from "@/lib/utils";
import { useBuilder } from "@/state/builder-context";
import { getProductTotalQty, getStepSelectedCount } from "@/state/selectors";
import type { ComponentType, SVGProps } from "react";

const STEP_ICONS: Record<
  string,
  { Icon: ComponentType<SVGProps<SVGSVGElement>>; className: string }
> = {
  camera: { Icon: CameraIcon, className: "w-5 sm:w-6.5" },
  shield: { Icon: PlanIcon, className: "w-6 sm:w-6.5" },
  sensor: { Icon: SensorsIcon, className: "w-[1.34375rem] sm:w-6.5" },
  grid: { Icon: ExtrasIcon, className: "w-[1.21875rem] sm:w-4.5" },
};

export default function StepSection({
  step,
  index,
}: {
  step: Step;
  index: number;
}) {
  const { catalog, state, dispatch } = useBuilder();
  const open = state.openStepId === step.id;
  const count = getStepSelectedCount(catalog, state, step.id);
  const products = catalog.products.filter((p) => p.stepId === step.id);
  const nextStep = catalog.steps[index + 1];
  const bodyId = `step-body-${step.id}`;
  const { Icon, className: iconClass } =
    STEP_ICONS[step.icon] ?? STEP_ICONS.camera;

  return (
    <section
      className={cn(
        "duration-300 motion-safe:transition-colors",
        open && "bg-surface-blue rounded-[0.625rem] pt-3.75",
      )}
    >
      <p className="v-kicker px-3.75 pb-1.25 sm:text-xs">
        Step {index + 1} of {catalog.steps.length}
      </p>
      <div
        className={cn(
          "duration-300 motion-safe:transition-[padding]",
          open &&
            "border-charcoal flex flex-col gap-3.75 border-t-[0.5px] px-3.75 py-5",
        )}
      >
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => dispatch({ type: "toggleStep", stepId: step.id })}
            className={cn(
              "flex w-full items-center gap-2 text-left",
              !open && "border-charcoal border-y-[0.5px] px-3.75 py-5",
            )}
          >
            <span className="flex w-6 justify-center sm:w-6.5">
              <Icon className={cn("h-auto", iconClass)} />
            </span>
            <span className="text-obsidian sm:text-review-title min-w-0 flex-1 text-lg leading-none font-semibold">
              {step.title}
            </span>
            <span className="text-wyze-purple flex items-center gap-1 text-sm leading-4 font-medium whitespace-nowrap">
              <span className={cn(!open && "sm:hidden")}>{count} selected</span>
              <CarrotIcon
                className={cn(
                  "size-3 duration-300 motion-safe:transition-transform",
                  !open && "rotate-180",
                )}
              />
            </span>
          </button>
        </h3>
        <div
          id={bodyId}
          className={cn("v-disclosure", open && "v-disclosure-open")}
        >
          <div className="flex min-h-0 flex-col gap-3.75 overflow-hidden">
            <div
              className={cn(
                "grid grid-cols-1 gap-3.75",
                "sm:grid-cols-[repeat(auto-fill,minmax(14.375rem,1fr))]",
                "xl:v-center-odd-last xl:grid-cols-2",
              )}
            >
              {products.map((product) =>
                step.selectionMode === "single" ? (
                  <PlanCard
                    key={product.id}
                    product={product}
                    checked={getProductTotalQty(state, product) > 0}
                  />
                ) : (
                  <ProductCard key={product.id} product={product} />
                ),
              )}
            </div>
            {step.nextLabel && nextStep && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "openStep", stepId: nextStep.id })
                  }
                  className="border-wyze-purple text-wyze-purple h-9.75 rounded-[0.4375rem] border px-6 py-1.25 text-lg leading-6 font-semibold hover:bg-white motion-safe:transition-colors"
                >
                  {step.nextLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
