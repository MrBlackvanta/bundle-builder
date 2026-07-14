const KEY_POSITIONS = [
  [0.75, 6.40217],
  [7.70652, 6.40217],
  [14.663, 6.40217],
  [0.75, 12.0543],
  [7.70652, 12.0543],
  [14.663, 12.0543],
  [0.75, 17.7065],
  [7.70652, 17.7065],
  [14.663, 17.7065],
] as const;

export default function ExtrasIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 19.4704 21.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M13.2135 4.22826L9.73522 0.75L6.25696 4.22826"
        stroke="#6F7882"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {KEY_POSITIONS.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="4.05739"
          height="3.04348"
          rx="1.52174"
          stroke="#6F7882"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
