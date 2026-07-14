import type { ReactElement } from 'react';

interface IconProps {
  size?: number;
}

export function CameraIcon({ size = 28 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="3.5" width="15" height="13" rx="3.5" />
      <circle cx="12" cy="10" r="3.2" />
      <circle cx="12" cy="10" r="0.6" fill="currentColor" stroke="none" />
      <path d="M12 16.5v2.2M8.5 20.7h7" />
    </svg>
  );
}

export function ShieldIcon({ size = 28 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7.2 2.8v6.1c0 4.4-2.9 7.3-7.2 9.1-4.3-1.8-7.2-4.7-7.2-9.1V5.8L12 3z" />
    </svg>
  );
}

export function SensorIcon({ size = 28 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="8.5" y="3.5" width="7" height="5.6" rx="2" />
      <path d="M7.5 13.5a6.4 6.4 0 0 1 9 0" />
      <path d="M5.2 16.4a9.6 9.6 0 0 1 13.6 0" />
      <path d="M10 10.9a3.2 3.2 0 0 1 4 0" />
    </svg>
  );
}

export function GridIcon({ size = 28 }: IconProps) {
  const dots = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      dots.push(<circle key={`${row}-${col}`} cx={6 + col * 6} cy={6 + row * 6} r="1.7" />);
    }
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      {dots}
    </svg>
  );
}

const STEP_ICONS: Record<string, (props: IconProps) => ReactElement> = {
  camera: CameraIcon,
  shield: ShieldIcon,
  sensor: SensorIcon,
  grid: GridIcon,
};

export function StepIcon({ name, size }: { name: string; size?: number }) {
  const Icon = STEP_ICONS[name] ?? CameraIcon;
  return <Icon size={size} />;
}

export function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg
      viewBox="0 0 10 6"
      width="10"
      height="6"
      fill="currentColor"
      aria-hidden="true"
      style={up ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M0 0l5 6 5-6z" />
    </svg>
  );
}

export function TruckIcon({ size = 26 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="var(--green-600)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 5.5h11v11h-11z" />
      <path d="M13.5 9h4l3 3.2v4.3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
      <path d="M4.5 8.5h5M4.5 11h3.5" />
    </svg>
  );
}

/** Small Wyze plan brandmark placeholder (real asset comes from Figma). */
export function WyzeMark({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M12 2l8.4 3.2v7c0 5.1-3.4 8.5-8.4 10.6C7 20.7 3.6 17.3 3.6 12.2v-7L12 2z"
        fill="var(--brand-600)"
      />
      <text
        x="12"
        y="14.8"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fill="#fff"
        fontFamily="inherit"
      >
        wyze
      </text>
    </svg>
  );
}
