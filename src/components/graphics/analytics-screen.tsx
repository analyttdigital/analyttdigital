/** Self-contained SVG media: faux analytics dashboard in brand colors. */
export function AnalyticsScreen({ variant = 0 }: { variant?: number }) {
  const bars = [
    [34, 52, 44, 68, 58, 84, 72, 96],
    [48, 38, 62, 50, 78, 60, 88, 70],
    [28, 46, 40, 58, 52, 66, 60, 78],
    [40, 58, 48, 74, 64, 90, 80, 100],
  ][variant % 4];

  const line = [
    'M0 86 C 24 78, 40 84, 62 64 S 104 70, 126 50 S 168 56, 190 32 S 226 40, 250 12',
    'M0 70 C 26 74, 44 58, 66 62 S 108 44, 130 52 S 172 30, 194 38 S 228 22, 250 26',
    'M0 90 C 30 84, 46 66, 70 70 S 112 54, 134 58 S 176 40, 198 44 S 232 24, 250 30',
  ][variant % 3];

  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" role="img" aria-label="Campaign performance dashboard">
      <defs>
        <linearGradient id={`ag-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f04f26" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f04f26" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* header row */}
      <rect x="0" y="0" width="280" height="26" fill="#4f4b63" opacity="0.08" />
      <circle cx="14" cy="13" r="3" fill="#f04f26" />
      <rect x="26" y="10" width="60" height="6" rx="3" fill="#4f4b63" opacity="0.35" />
      <rect x="222" y="8" width="44" height="10" rx="5" fill="#4f4b63" opacity="0.18" />

      {/* KPI chips */}
      <rect x="12" y="36" width="78" height="30" rx="4" fill="#fff" stroke="#4f4b63" strokeOpacity="0.14" />
      <rect x="20" y="44" width="26" height="5" rx="2.5" fill="#4f4b63" opacity="0.4" />
      <rect x="20" y="53" width="40" height="7" rx="3" fill="#f04f26" opacity="0.85" />
      <rect x="100" y="36" width="78" height="30" rx="4" fill="#fff" stroke="#4f4b63" strokeOpacity="0.14" />
      <rect x="108" y="44" width="22" height="5" rx="2.5" fill="#4f4b63" opacity="0.4" />
      <rect x="108" y="53" width="34" height="7" rx="3" fill="#4f4b63" opacity="0.75" />
      <rect x="188" y="36" width="80" height="30" rx="4" fill="#fff" stroke="#4f4b63" strokeOpacity="0.14" />
      <rect x="196" y="44" width="24" height="5" rx="2.5" fill="#4f4b63" opacity="0.4" />
      <rect x="196" y="53" width="44" height="7" rx="3" fill="#4f4b63" opacity="0.75" />

      {/* bar chart */}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={16 + i * 32}
          y={160 - h}
          width="18"
          height={h}
          rx="2"
          fill={i === bars.length - 1 ? '#f04f26' : '#4f4b63'}
          opacity={i === bars.length - 1 ? 0.9 : 0.28 + i * 0.06}
        />
      ))}

      {/* line overlay + area */}
      <path d={`${line} L250 160 L0 160 Z`} fill={`url(#ag-${variant})`} />
      <path d={line} fill="none" stroke="#f04f26" strokeWidth="2.5" strokeLinecap="round" />

      {/* baseline */}
      <line x1="0" y1="160" x2="280" y2="160" stroke="#4f4b63" strokeOpacity="0.2" strokeWidth="1" />
      <rect x="12" y="172" width="50" height="5" rx="2.5" fill="#4f4b63" opacity="0.3" />
      <rect x="70" y="172" width="34" height="5" rx="2.5" fill="#4f4b63" opacity="0.2" />
    </svg>
  );
}
