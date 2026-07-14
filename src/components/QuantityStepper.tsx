import { cx } from '../lib/cx';
import { MAX_QTY } from '../state/reducer';
import s from './QuantityStepper.module.css';

interface QuantityStepperProps {
  value: number;
  /** Called with +1 / -1; the reducer applies the delta to current state. */
  onDelta: (delta: 1 | -1) => void;
  /** Accessible name, e.g. "Wyze Cam v4 quantity". */
  label: string;
  disabled?: boolean;
  size?: 'md' | 'sm';
}

export function QuantityStepper({
  value,
  onDelta,
  label,
  disabled = false,
  size = 'md',
}: QuantityStepperProps) {
  return (
    <span className={cx(s.stepper, size === 'sm' && s.sm)} role="group" aria-label={label}>
      <button
        type="button"
        className={s.btn}
        aria-label={`Decrease ${label}`}
        disabled={disabled || value <= 0}
        onClick={() => onDelta(-1)}
      >
        <span aria-hidden="true">&minus;</span>
      </button>
      <span className={s.value} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className={s.btn}
        aria-label={`Increase ${label}`}
        disabled={disabled || value >= MAX_QTY}
        onClick={() => onDelta(1)}
      >
        <span aria-hidden="true">+</span>
      </button>
    </span>
  );
}
