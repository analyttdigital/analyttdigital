'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling with one-section-per-viewport snapping.
 *
 * The page is composed of full-height scenes ([data-snap] elements).
 * Each completed wheel gesture advances (or rewinds) exactly one scene and
 * lands its top edge flush with the top of the viewport. Touch swipes ride
 * momentum and settle on the nearest scene top. Anchor links route through
 * Lenis with an offset for the floating nav; reduced-motion visitors keep
 * native scrolling with CSS snap disabled.
 */

type SnapPoint = { el: HTMLElement; top: () => number };

function collectSnapPoints(): SnapPoint[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'))
    .map((el) => ({
      el,
      top: () => el.getBoundingClientRect().top + window.scrollY,
    }))
    .sort((a, b) => a.top() - b.top());
}

function nearestIndex(points: SnapPoint[], y: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < points.length; i += 1) {
    const dist = Math.abs(points[i].top() - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ---- one scene per gesture ------------------------------------ */
    let snapPoints: SnapPoint[] = [];
    const refresh = () => {
      snapPoints = collectSnapPoints();
    };
    refresh();
    const refreshTimer = window.setInterval(refresh, 1000);

    let locked = false;
    let wheelDelta = 0;
    let wheelTimer: number | undefined;

    const scrollToIndex = (index: number, duration = 1.1) => {
      if (snapPoints.length === 0) return;
      const clamped = Math.max(0, Math.min(snapPoints.length - 1, index));
      locked = true;
      lenis.scrollTo(snapPoints[clamped].top(), {
        duration,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          locked = false;
        },
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (snapPoints.length === 0) return;
      // Ignore wheels over scrollable sub-areas (keystatic admin etc.).
      const from = event.target instanceof Element ? event.target : null;
      if (from?.closest('[data-lenis-prevent]')) return;

      // Capture-phase interception: stop Lenis's own wheel handling and
      // native scroll — this component is the sole scroll driver, so the
      // per-gesture scrollTo never fights Lenis's internal wheel logic.
      event.preventDefault();
      event.stopImmediatePropagation();
      if (locked) return;

      wheelDelta += event.deltaY;
      if (wheelTimer) window.clearTimeout(wheelTimer);

      // Gesture ends after a short pause: commit to ±1 scene.
      wheelTimer = window.setTimeout(() => {
        if (Math.abs(wheelDelta) < 8) {
          wheelDelta = 0;
          return;
        }
        const direction = wheelDelta > 0 ? 1 : -1;
        wheelDelta = 0;
        const current = nearestIndex(snapPoints, window.scrollY);
        scrollToIndex(current + direction);
      }, 60);
    };

    window.addEventListener('wheel', onWheel, { capture: true, passive: false });

    /* ---- touch: settle on nearest scene top after momentum --------- */
    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      if (Math.abs(delta) > 48) {
        const current = nearestIndex(snapPoints, window.scrollY);
        // Direction-aware: continue travel, then settle to the nearest top.
        const direction = delta > 0 ? 1 : -1;
        const target = Math.abs(snapPoints[current].top() - window.scrollY) > 64
          ? current
          : current + direction;
        scrollToIndex(target, 0.9);
      } else {
        scrollToIndex(nearestIndex(snapPoints, window.scrollY), 0.7);
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    /* ---- anchors through lenis (offset clears the floating nav) ---- */
    const onClick = (event: MouseEvent) => {
      const from = event.target instanceof Element ? event.target : null;
      const anchor = from?.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      locked = true;
      lenis.scrollTo(target as HTMLElement, {
        offset: -96,
        duration: 1.3,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          locked = false;
        },
      });
    };

    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('click', onClick);
      window.clearInterval(refreshTimer);
      if (wheelTimer) window.clearTimeout(wheelTimer);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
