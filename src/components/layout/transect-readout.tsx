'use client';

import { useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

import { useChrome } from '@/lib/content/chrome';

/**
 * TransectReadout — the instrument strip under the sheet.
 *
 * The survey's own readout: the cut line the reader is dragging down the
 * page is drawn by the background field, and counted here. It replaces the
 * old scroll hairline with something that means something — station,
 * bearing, distance surveyed — and it retreats while the reader scrolls
 * down so it never sits on top of what they are reading.
 */
const STATIONS = 10;

export function TransectReadout() {
  const chrome = useChrome();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 34, mass: 0.5 });

  const [station, setStation] = useState(1);
  const [percent, setPercent] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [retreat, setRetreat] = useState(false);
  const last = useRef(0);

  useMotionValueEvent(progress, 'change', (value) => {
    const next = Math.min(STATIONS, Math.max(1, Math.round(value * STATIONS) || 1));
    if (next !== station) setStation(next);
    const pct = Math.round(value * 100);
    if (pct !== percent) setPercent(pct);
    const deg = Math.round(value * 359);
    if (deg !== bearing) setBearing(deg);
  });

  useMotionValueEvent(scrollY, 'change', (value) => {
    const delta = value - last.current;
    // Ignore the jitter of momentum settling at the end of a fling.
    if (Math.abs(delta) > 2) setRetreat(delta > 0);
    last.current = value;
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-out"
      style={{ transform: retreat ? 'translateY(105%)' : 'translateY(0)' }}
    >
      <div className="border-t border-ink-950/15 bg-paper/92 backdrop-blur-sm">
        <div className="mx-auto flex h-8 w-full max-w-[1320px] items-center gap-4 px-4 md:px-6">
          <p className="folio w-narrow shrink-0">{chrome.transect}</p>

          {/* Contents ruler: one tick per block on the sheet, filled as the
              reader surveys it, the current station in the spot colour. */}
          <div className="hidden flex-1 items-end gap-[3px] sm:flex">
            {Array.from({ length: STATIONS }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 ${
                  i + 1 === station
                    ? 'bg-accent-500'
                    : i + 1 < station
                      ? 'bg-ink-950/55'
                      : 'bg-ink-950/15'
                }`}
              />
            ))}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-5">
            <p className="folio w-narrow">
              {chrome.station} <span className="tnum text-ink-900">{String(station).padStart(2, '0')}</span>/{STATIONS}
            </p>
            <p className="folio w-narrow hidden sm:block">
              {chrome.bearing} <span className="tnum text-ink-900">{String(bearing).padStart(3, '0')}°</span>
            </p>
            <p className="folio w-narrow">
              Surveyed <span className="tnum text-ink-900">{String(percent).padStart(3, '0')}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
