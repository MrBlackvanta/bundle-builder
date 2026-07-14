import { cx } from '../lib/cx';
import { formatMoney } from '../lib/money';
import s from './Price.module.css';

interface PriceProps {
  /** Current price in cents; 0 renders as "FREE". */
  price: number;
  compareAt?: number;
  perMonth?: boolean;
  context: 'card' | 'review';
}

export function Price({ price, compareAt, perMonth, context }: PriceProps) {
  const suffix = perMonth ? '/mo' : '';
  return (
    <span className={cx(s.price, context === 'card' ? s.card : s.review)}>
      {compareAt != null && (
        <s className={s.compare}>
          {formatMoney(compareAt)}
          {suffix}
        </s>
      )}
      <span className={s.current}>
        {price === 0 ? 'FREE' : `${formatMoney(price)}${suffix}`}
      </span>
    </span>
  );
}
