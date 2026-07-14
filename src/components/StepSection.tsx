import type { Step } from '../types';
import { useBuilder } from '../state/BuilderContext';
import { getProductTotalQty, getStepSelectedCount } from '../state/selectors';
import { cx } from '../lib/cx';
import { Chevron, StepIcon } from './icons';
import { PlanCard, ProductCard } from './ProductCard';
import s from './StepSection.module.css';

export function StepSection({ step, index }: { step: Step; index: number }) {
  const { catalog, state, dispatch } = useBuilder();
  const open = state.openStepId === step.id;
  const count = getStepSelectedCount(catalog, state, step.id);
  const products = catalog.products.filter((p) => p.stepId === step.id);
  const nextStep = catalog.steps[index + 1];
  const bodyId = `step-body-${step.id}`;

  return (
    <section className={cx(s.section, open && s.open)}>
      <p className={s.kicker}>
        Step {index + 1} of {catalog.steps.length}
      </p>
      <div className={s.panel}>
        <h3 className={s.heading}>
          <button
            type="button"
            className={s.headerBtn}
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => dispatch({ type: 'toggleStep', stepId: step.id })}
          >
            <span className={s.icon}>
              <StepIcon name={step.icon} />
            </span>
            <span className={s.title}>{step.title}</span>
            <span className={s.stateIndicator}>
              <span className={cx(s.count, !open && s.countCollapsed)}>
                {count} selected
              </span>
              <Chevron up={open} className={s.chevron} />
            </span>
          </button>
        </h3>
        <div id={bodyId} className={cx(s.body, open && s.bodyOpen)}>
          <div className={s.bodyInner}>
            <div className={s.grid}>
              {products.map((product) =>
                step.selectionMode === 'single' ? (
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
              <div className={s.nextWrap}>
                <button
                  type="button"
                  className={s.nextBtn}
                  onClick={() => dispatch({ type: 'openStep', stepId: nextStep.id })}
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
