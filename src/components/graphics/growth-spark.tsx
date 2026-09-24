/** Minimal flat sparkline: hairline grid, ember trajectory, square tip. */
export function GrowthSpark({ seed = 0 }: { seed?: number }) {
  const paths = [
    'M0 40 C 14 36, 22 28, 36 30 S 58 20, 72 16 S 92 10, 108 4',
    'M0 36 C 16 38, 24 30, 40 24 S 60 26, 74 18 S 94 14, 108 6',
    'M0 42 C 12 38, 24 34, 38 26 S 60 22, 76 14 S 96 12, 108 6',
  ];
  const d = paths[seed % 3];
  return (
    <svg viewBox="0 0 108 44" className="h-10 w-[108px]" aria-hidden>
      <g stroke="#eceeee" strokeOpacity="0.15" strokeWidth="1">
        <line x1="0" y1="14" x2="108" y2="14" />
        <line x1="0" y1="28" x2="108" y2="28" />
      </g>
      <path d={d} fill="none" stroke="#f04f26" strokeWidth="2" strokeLinecap="square" />
      <rect x="104" y="2" width="8" height="8" fill="#f04f26" />
      <rect x="106" y="4" width="4" height="4" fill="#fff" />
    </svg>
  );
}
