'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * SignalTrace — the demonstration the whole page is arranged around.
 *
 * A chart recorder raster: needles standing on the time axis. It starts as an
 * untriggered signal — needles jittering around nothing — and when tracking
 * goes live the trigger fires, the jitter is cut dead and the trace locks
 * perfectly still. That is what measurement looks like: not a claim that the
 * numbers are good, the signal ceasing to lie.
 *
 * Why a raster of needles rather than an SVG polyline: one rAF writing 96
 * transforms beats 96 motion components, it stays sharp at any device pixel
 * ratio, and it costs nothing once the animation ends. Deterministic noise
 * (seeded) so the server and client render the same first frame.
 */

const BARS = 72;
const LOCK_AT = 0.46; // where the trigger fires along the time axis
const DURATION = 2100;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The steady signal once it is tracked: two conversion steps and a plateau. */
function steady(x: number) {
  const spike = (at: number, width: number, height: number) =>
    height * Math.exp(-Math.pow((x - at) / width, 2));
  return 0.24 + spike(0.16, 0.075, 0.6) + spike(0.63, 0.13, 0.44) + spike(0.86, 0.05, 0.2);
}

export function SignalTrace({
  className,
  height = 132,
  seed = 7,
  label,
}: {
  className?: string;
  height?: number;
  seed?: number;
  label?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const bars = Array.from(host.querySelectorAll<HTMLElement>('[data-needle]'));
    const random = mulberry32(seed);

    // Fixed noise offsets per needle: the untriggered signal is the same every
    // visit, so the page does not reshuffle under the reader.
    const jitter = Array.from({ length: BARS }, () => random() * 2 - 1);
    const steadyHeights = Array.from({ length: BARS }, (_, i) => steady(i / (BARS - 1)));

    if (reduce) {
      bars.forEach((bar, i) => {
        bar.style.transform = `translateY(-${steadyHeights[i] * 100}%)`;
      });
      setLocked(true);
      return;
    }

    let raf = 0;
    let announced = false;
    const start = performance.now();

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);

      // Before the trigger the signal only settles a little. After it the
      // jitter is cut dead, with a brief overshoot at the lock so the eye
      // catches the moment it happened.
      let amp: number;
      if (t < LOCK_AT) {
        const k = t / LOCK_AT;
        amp = 1 - 0.22 * k;
      } else {
        const k = (t - LOCK_AT) / (1 - LOCK_AT);
        const eased = 1 - Math.pow(1 - k, 3);
        amp = 0.78 * (1 - eased) - 0.12 * Math.sin(Math.PI * k) * (1 - k);
      }

      for (let i = 0; i < bars.length; i += 1) {
        const h = steadyHeights[i] + jitter[i] * 0.3 * amp;
        bars[i].style.transform = `translateY(-${Math.max(0.02, Math.min(1, h)) * 100}%)`;
      }

      if (!announced && t >= LOCK_AT) {
        announced = true;
        setLocked(true);
      }

      if (t < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduce, seed]);

  return (
    <div ref={hostRef} className={className}>
      <div
        className="relative flex h-full w-full items-end gap-px overflow-hidden"
        role="img"
        aria-label={
          label ?? 'Signal trace: untriggered, then locked and steady once tracking is live'
        }
      >
        {Array.from({ length: BARS }).map((_, i) => {
          const atLock = Math.abs(i / (BARS - 1) - LOCK_AT) < 0.006;
          return (
            <span
              key={i}
              data-needle
              className={`min-w-px flex-1 origin-bottom transition-colors duration-500 ${
                atLock && locked ? 'bg-accent-500' : 'bg-primary-100/55'
              }`}
              style={{ height: '100%', transform: 'translateY(0%)' }}
            />
          );
        })}
      </div>
    </div>
  );
}