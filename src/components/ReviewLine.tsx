import type { LineItem } from '../state/selectors';
import { useBuilder } from '../state/BuilderContext';
import { DEFAULT_VARIANT } from '../state/selectors';
import { cx } from '../lib/cx';
import { QuantityStepper } from './QuantityStepper';
import { Price } from './Price';
import { WyzeMark } from './icons';
import s from './ReviewLine.module.css';

interface ReviewLineProps {
  item: LineItem;
  /** Show the variant label (only when several variants of the product are in the system). */
  showVariant: boolean;
}

export function ReviewLine({ item, showVariant }: ReviewLineProps) {
  const { dispatch } = useBuilder();
  const { product, variant, qty } = item;
  const isPlan = product.reviewCategory === 'Plan';

  if (isPlan) {
    return (
      <li className={cx(s.line, s.planLine)}>
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

  const stepperLabel = `${product.name}${variant ? ` (${variant.label})` : ''} quantity`;
  return (
    <li className={s.line}>
      <span className={s.thumb}>
        <img src={product.image} alt="" width="40" height="40" loading="lazy" />
      </span>
      <span className={s.name}>
        {product.name}
        {showVariant && variant && <span className={s.variantTag}>{variant.label}</span>}
      </span>
      <QuantityStepper
        size="sm"
        value={qty}
        disabled={product.locked}
        label={stepperLabel}
        onDelta={(delta) =>
          dispatch({
            type: 'adjustQty',
            productId: product.id,
            variantId: variant?.id ?? DEFAULT_VARIANT,
            delta,
          })
        }
      />
      <Price context="review" price={item.lineTotal} compareAt={item.lineCompareAt} />
    </li>
  );
}

/** Plan brandmark lockup, e.g. [mark] Cam Unlimited. */
export function BrandName({ name }: { name: string }) {
  const [first, ...rest] = name.split(' ');
  return (
    <span className={s.brand}>
      <WyzeMark />
      <span className={s.brandFirst}>{first}</span>
      {rest.length > 0 && <span className={s.brandAccent}>{rest.join(' ')}</span>}
    </span>
  );
}
