'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling + section snapping.
 *
 * Each wheel gesture advances exactly one `[data-snap]` section, gliding the
 * next section's top edge to the top of the viewport (fullpage-style, but
 * proximity-free and fully eased). Trackpad flicks accumulate into a single
 * gesture; anchor links route through Lenis; reduced-motion visitors keep
 * native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ---- snap: one section per gesture ---- */

    const getSnapPoints = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'))
        .map((el) => el.getBoundingClientRect().top + window.scrollY)
        .sort((a, b) => a - b);

    let accum = 0;
    let gestureTimer: number | undefined;
    let snapping = false;

    const nearestIndex = (points: number[], y: number) => {
      let idx = 0;
      let best = Number.POSITIVE_INFINITY;
      points.forEach((p, i) => {
        const d = Math.abs(p - y);
        if (d < best) {
          best = d;
          idx = i;
        }
      });
      return idx;
    };

    const settle = () => {
      const points = getSnapPoints();
      if (points.length === 0 || snapping) return;

      const direction = accum > 0 ? 1 : -1;
      accum = 0;

      // Ignore tiny accidental gestures.
      const current = window.scrollY;
      const idx = nearestIndex(points, current);
      // Already aligned and no real intent → nothing to do.
      if (Math.abs(points[idx] - current) < 8 && Math.abs(direction) === 1) {
        // still advance/retreat on explicit gesture below
      }

      const targetIdx = Math.min(points.length - 1, Math.max(0, idx + (direction as number)));
      const target = points[targetIdx];
      if (Math.abs(target - current) < 8) return;

      snapping = true;
      lenis.scrollTo(target, {
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          snapping = false;
        },
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0 || snapping) return;
      accum += event.deltaY;
      window.clearTimeout(gestureTimer);
      // Trackpad streams small deltas; treat 150ms of stillness as gesture end.
      gestureTimer = window.setTimeout(settle, 150);
      // Cut runaway accumulation from very long flicks.
      accum = Math.max(-900, Math.min(900, accum));
    };

    /* ---- anchors through lenis ---- */
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      snapping = true;
      lenis.scrollTo(target as HTMLElement, {
        offset: -64,
        onComplete: () => {
          snapping = false;
        },
      });
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('click', onClick);
      window.clearTimeout(gestureTimer);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
