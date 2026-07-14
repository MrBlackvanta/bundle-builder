import s from './GuaranteeSeal.module.css';

/** "100% Wyze satisfaction guarantee" stamp, exported from Figma. */
export function GuaranteeSeal() {
  return (
    <img
      className={s.seal}
      src="/images/guarantee-seal.webp"
      alt="100% Wyze satisfaction guarantee — try worry-free for 30 days"
      width="104"
      height="104"
      loading="lazy"
    />
  );
}
