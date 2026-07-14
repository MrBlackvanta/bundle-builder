import s from './GuaranteeSeal.module.css';

/**
 * Placeholder rendering of the "100% Wyze satisfaction guarantee" stamp.
 * TODO(figma): replace with the exported asset for pixel parity.
 */
export function GuaranteeSeal() {
  return (
    <svg
      className={s.seal}
      viewBox="0 0 120 120"
      width="104"
      height="104"
      role="img"
      aria-label="100% Wyze satisfaction guarantee — try worry-free for 30 days"
    >
      <defs>
        <path id="seal-arc" d="M60 13a47 47 0 1 1-0.01 0z" fill="none" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="var(--brand-600)" strokeWidth="5" strokeDasharray="2.5 7.4" />
      <circle cx="60" cy="60" r="52" fill="var(--brand-600)" />
      <text fontSize="7" fill="#fff" opacity="0.85" letterSpacing="1.4">
        <textPath href="#seal-arc" startOffset="2%">
          TRY WORRY-FREE FOR 30 DAYS · TRY WORRY-FREE FOR 30 DAYS ·
        </textPath>
      </text>
      <text x="60" y="53" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
        100%
      </text>
      <text x="60" y="67" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
        Wyze
      </text>
      <text x="60" y="79" textAnchor="middle" fontSize="9.5" fill="#fff">
        satisfaction
      </text>
      <text x="60" y="90" textAnchor="middle" fontSize="9.5" fill="#fff">
        guarantee
      </text>
    </svg>
  );
}
