'use client';

import { useId, useLayoutEffect, useRef } from 'react';

/**
 * LogoWireframe — the Analytt monogram as a traced signal path.
 *
 * Path data is traced from `public/img/logo-light.svg` (the two strokes of
 * the mark). The strokes sit faintly drawn in paper as the track; while
 * `active` holds, a single accent comet sweeps each stroke in an endless
 * loop (sweep, brief hold, sweep again), staggering the two strokes. The
 * comet is one locked unit — wide glow, mid body, bright core and round head cap all
 * share the same tip position from the same dash offset, so the head is
 * literally part of the trail path and can never separate from it — and
 * its tail vanishes in steps: each layer is shorter than the last, so only
 * the faintest wisp reaches the tail end (same fake-fading-tail layering
 * as the flow trails). One rAF writes dash offsets straight to the DOM
 * (zero re-renders, no path measuring at all). Strokes are 1px non-scaling
 * hairlines, fills stay off: construction lines, never the mark itself.
 * Decorative only (`aria-hidden`).
 */

const VIEW_BOX = '0 0 360 360';

const LOGO_PATHS = [
  'm143.08 211.84h29.63v79.03h-58.87q-35.09 0-54.97-20.98-19.88-20.98-19.88-57.64v-72.92h-38.98v-22.41l104.87-116.92h18.71v70.88h47.95v68.44h-45.22v55q0 7.74 4.48 12.63 4.49 4.89 12.28 4.89z',
  'm214.95 148.93h-30.04v-78.75h59.68q35.57 0 55.73 20.91 20.16 20.9 20.15 57.43v72.66h39.53v22.32l-106.32 116.5h-18.97v-70.62h-48.62v-68.19h45.85v-54.8q0-7.71-4.55-12.58-4.54-4.87-12.44-4.88z',
];

/** Comet length as a fraction of the path, sweep timing, and hold between loops. */
const TRAIL = 0.16;
const SWEEP_MS = 1400;
const STAGGER_MS = 220;
const LOOP_PAUSE_MS = 10000;

/** One locked comet: longest/faindest tail first, shortest/brightest last,
 *  capped by a round head that is part of the trail path itself. Every
 *  layer shares the tip, so light and trail never separate. */
const COMET = [
  { k: 1, w: 5, o: 0.3, glow: true, cap: false },
  { k: 0.55, w: 2.6, o: 0.55, glow: false, cap: false },
  { k: 0.28, w: 1.6, o: 1, glow: false, cap: false },
  { k: 0.035, w: 7, o: 1, glow: true, cap: true },
];

export function LogoWireframe({ active, className }: { active?: boolean; className?: string }) {
  const layers = useRef<(SVGPathElement | null)[][]>([]);
  const filterId = useId().replace(/:/g, '');

  useLayoutEffect(() => {
    /* Parked state: every layer held before the path start (nothing drawn).
     * The server renders this same state, so entry is the only motion. */
    const park = () => {
      layers.current.forEach((set) => {
        set?.forEach((el, li) => {
          if (el) el.style.strokeDashoffset = String(TRAIL * COMET[li].k);
        });
      });
    };
    park();
    if (!active) return;

    const paths = LOGO_PATHS.map((_, i) => i);
    let raf = 0;
    const start = performance.now();
    const paint = (i: number, hp: number) => {
      layers.current[i]?.forEach((el, li) => {
        if (el) el.style.strokeDashoffset = String(TRAIL * COMET[li].k - hp);
      });
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      /* Hidden tab holds its frame — the loop is time-based, so it resumes
       * in phase instead of jumping. */
      if (document.hidden) return;
      paths.forEach((i) => {
        const elapsed = now - start - i * STAGGER_MS;
        if (elapsed < 0) return;
        const local = elapsed % (SWEEP_MS + LOOP_PAUSE_MS);
        /* Sweeping, else parked: the hold between loops shows only the track. */
        paint(i, local < SWEEP_MS ? (local / SWEEP_MS) * (1 + TRAIL) : 0);
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 left-0 flex items-center justify-start pl-5 sm:pl-[clamp(20px,6vw,96px)] ${className ?? ''}`}
    >
      <svg viewBox={VIEW_BOX} className="h-1/2 w-auto" fill="none" aria-hidden="true">
        <defs>
          <filter id={`${filterId}-glow`} filterUnits="userSpaceOnUse" x={-360} y={-360} width={1080} height={1080}>
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        {LOGO_PATHS.map((d, i) => (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke="rgb(var(--color-accent-500))"
              strokeOpacity={0.2}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            {COMET.map((layer, li) => (
              <path
                key={li}
                ref={(el) => {
                  if (!layers.current[i]) layers.current[i] = [];
                  layers.current[i][li] = el;
                }}
                d={d}
                fill="none"
                stroke={li === COMET.length - 1 ? 'rgb(var(--color-accent-400))' : 'rgb(var(--color-accent-500))'}
                strokeOpacity={layer.o}
                strokeWidth={layer.w}
                strokeLinecap={layer.cap ? 'round' : 'butt'}
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray={`${TRAIL * layer.k} 2`}
                strokeDashoffset={TRAIL * layer.k}
                filter={layer.glow ? `url(#${filterId}-glow)` : undefined}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
