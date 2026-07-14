import type { Product } from '../types';
import { cx } from '../lib/cx';
import s from './VariantSelector.module.css';

interface VariantSelectorProps {
  product: Product;
  value: string;
  onChange: (variantId: string) => void;
}

export function VariantSelector({ product, value, onChange }: VariantSelectorProps) {
  return (
    <fieldset className={s.fieldset}>
      <legend className="sr-only">{product.name} color</legend>
      <div className={s.chips}>
        {product.variants!.map((variant) => (
          <label key={variant.id} className={cx(s.chip, variant.id === value && s.active)}>
            <input
              className="sr-only"
              type="radio"
              name={`variant-${product.id}`}
              value={variant.id}
              checked={variant.id === value}
              onChange={() => onChange(variant.id)}
            />
            <span
              className={s.swatch}
              style={{ backgroundColor: variant.swatch }}
              aria-hidden="true"
            />
            <span>{variant.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
