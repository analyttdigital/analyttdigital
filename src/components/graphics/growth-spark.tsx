/** Tiny sparkline card used as media in the stats band. */
export function GrowthSpark({ seed = 0 }: { seed?: number }) {
  const paths = [
    'M0 40 C 14 36, 22 28, 36 30 S 58 20, 72 16 S 92 10, 108 4',
    'M0 36 C 16 38, 24 30, 40 24 S 60 26, 74 18 S 94 14, 108 6',
    'M0 42 C 12 38, 24 34, 38 26 S 60 22, 76 14 S 96 12, 108 6',
  ];
  return (
    <svg viewBox="0 0 108 44" className="h-10 w-[108px]" aria-hidden>
      <path d={`${paths[seed % 3]} L108 44 L0 44 Z`} fill="#f04f26" opacity="0.08" />
      <path d={paths[seed % 3]} fill="none" stroke="#f04f26" strokeWidth="2" strokeLinecap="round" />
      <circle cx="108" cy="6" r="3" fill="#f04f26" />
    </svg>
  );
}
