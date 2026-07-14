import { useEffect, useRef, useState } from 'react';
import { useBuilder } from '../state/BuilderContext';
import { getLineItems, getReviewGroups, getTotals } from '../state/selectors';
import type { ReviewCategory } from '../types';
import { formatMoney } from '../lib/money';
import { ReviewLine } from './ReviewLine';
import { GuaranteeSeal } from './GuaranteeSeal';
import { TruckIcon } from './icons';
import { Price } from './Price';
import s from './ReviewPanel.module.css';

const GROUP_LABELS: Record<ReviewCategory, { label: string; mobileLabel?: string }> = {
  Cameras: { label: 'Cameras' },
  Sensors: { label: 'Sensors' },
  Accessories: { label: 'Accessories' },
  Plan: { label: 'Plan', mobileLabel: 'Home Monitoring Plan' },
};

export function ReviewPanel() {
  const { catalog, state, save } = useBuilder();
  const groups = getReviewGroups(catalog, state);
  const totals = getTotals(catalog, state);
  const { meta } = catalog;

  // How many lines each product contributes — variant labels are shown only
  // when a product appears more than once (keeps the seeded view identical to the design).
  const linesPerProduct = new Map<string, number>();
  for (const item of getLineItems(catalog, state)) {
    linesPerProduct.set(item.product.id, (linesPerProduct.get(item.product.id) ?? 0) + 1);
  }

  const [toast, setToast] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const flash = (fn: () => void, revert: () => void, ms: number) => {
    fn();
    timers.current.push(window.setTimeout(revert, ms));
  };

  const monthly = Math.round(totals.total * meta.asLowAsRate);

  return (
    <aside className={s.panel} aria-labelledby="review-title">
      <p className={s.eyebrow}>Review</p>
      <div className={s.columns}>
        <div className={s.items}>
          <h2 id="review-title" className={s.title}>
            Your security system
          </h2>
          <p className={s.desc}>
            Review your personalized protection system designed to keep what matters most
            safe.
          </p>
          {groups.map((group) => {
            const labels = GROUP_LABELS[group.category];
            return (
              <section key={group.category} className={s.group} aria-label={labels.label}>
                <h3 className={s.groupLabel}>
                  {labels.mobileLabel ? (
                    <>
                      <span className={s.desktopLabel}>{labels.label}</span>
                      <span className={s.mobileLabel}>{labels.mobileLabel}</span>
                    </>
                  ) : (
                    labels.label
                  )}
                </h3>
                <ul className={s.lines}>
                  {group.items.map((item) => (
                    <ReviewLine
                      key={`${item.product.id}-${item.variant?.id ?? 'default'}`}
                      item={item}
                      showVariant={(linesPerProduct.get(item.product.id) ?? 0) > 1}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
          <div className={s.shippingRow}>
            <span className={s.shipIcon}>
              <TruckIcon />
            </span>
            <span className={s.shipLabel}>{meta.shipping.label}</span>
            <Price
              context="review"
              price={meta.shipping.price}
              compareAt={meta.shipping.compareAtPrice}
            />
          </div>
        </div>

        <div className={s.summary}>
          <div className={s.sealArea}>
            <GuaranteeSeal />
          </div>
          <div className={s.returns}>
            <h3 className={s.returnsHeadline}>{meta.guarantee.headline}</h3>
            <p className={s.returnsBody}>{meta.guarantee.body}</p>
          </div>
          <div className={s.totals}>
            <span className={s.financeChip}>as low as {formatMoney(monthly)}/mo</span>
            <p className={s.totalRow}>
              <s className={s.totalCompare}>{formatMoney(totals.compareAt)}</s>{' '}
              <strong className={s.totalNow}>{formatMoney(totals.total)}</strong>
            </p>
          </div>
          <p className={s.savings} aria-live="polite">
            Congrats! You&rsquo;re saving {formatMoney(totals.savings)} on your security
            bundle!
          </p>
          <button
            type="button"
            className={s.checkout}
            onClick={() =>
              flash(
                () => setToast('This is a prototype — checkout is not connected yet.'),
                () => setToast(null),
                4000,
              )
            }
          >
            Checkout
          </button>
          <p className={s.toast} role="status">
            {toast}
          </p>
          <button
            type="button"
            className={s.saveLink}
            onClick={() =>
              flash(
                () => setSavedFlash(save()),
                () => setSavedFlash(false),
                2500,
              )
            }
          >
            {savedFlash ? 'System saved ✓' : 'Save my system for later'}
          </button>
        </div>
      </div>
    </aside>
  );
}
