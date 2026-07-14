import type { Product } from '../types';
import { useBuilder } from '../state/BuilderContext';
import { getActiveVariantId, getProductTotalQty, getQty } from '../state/selectors';
import { cx } from '../lib/cx';
import { QuantityStepper } from './QuantityStepper';
import { VariantSelector } from './VariantSelector';
import { Price } from './Price';
import s from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useBuilder();
  const variantId = getActiveVariantId(state, product);
  const qty = getQty(state, product.id, variantId);
  const selected = getProductTotalQty(state, product) > 0;

  return (
    <article className={cx(s.card, selected && s.selected)}>
      {product.badge && <span className={s.badge}>{product.badge}</span>}
      <div className={s.media}>
        <img src={product.image} alt="" width="280" height="280" loading="lazy" />
      </div>
      <div className={s.body}>
        <h4 className={s.title}>{product.name}</h4>
        <p className={s.desc}>
          {product.description}{' '}
          <a className={s.learnMore} href={product.learnMoreUrl ?? '#'}>
            Learn More
          </a>
        </p>
        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            product={product}
            value={variantId}
            onChange={(id) =>
              dispatch({ type: 'selectVariant', productId: product.id, variantId: id })
            }
          />
        )}
        <div className={s.controls}>
          <QuantityStepper
            value={qty}
            disabled={product.locked}
            label={`${product.name} quantity`}
            onDelta={(delta) =>
              dispatch({ type: 'adjustQty', productId: product.id, variantId, delta })
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

/** Card used for single-select steps (the monitoring plan). */
export function PlanCard({ product, checked }: { product: Product; checked: boolean }) {
  const { dispatch } = useBuilder();
  return (
    <label className={cx(s.card, s.planCard, checked && s.selected)}>
      <input
        className="sr-only"
        type="radio"
        name={`step-${product.stepId}`}
        checked={checked}
        onChange={() =>
          dispatch({ type: 'selectSingle', stepId: product.stepId, productId: product.id })
        }
      />
      <div className={s.media}>
        <img src={product.image} alt="" width="280" height="280" loading="lazy" />
      </div>
      <div className={s.body}>
        <h4 className={s.title}>{product.name}</h4>
        <p className={s.desc}>{product.description}</p>
        <div className={s.controls}>
          <span className={cx(s.selectPill, checked && s.selectPillActive)}>
            {checked ? 'Selected' : 'Select plan'}
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
