'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Continuous smooth scroll.
 *
 * The sheet is one long printed surface, so scrolling is continuous: no
 * snap points, no wheel interception, no chapter stops. Lenis only
 * smooths the wheel and carries anchor links so they clear the running
 * head. `prefers-reduced-motion` visitors never get Lenis at all and read
 * the sheet with native scrolling and CSS `scroll-behavior: auto`.
 */

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      /* Pinned stages scroll their overflowing copy inside the pin (the
         About bridge and the process story). Let those containers consume
         the wheel while they can, then hand the page back at their edge. */
      allowNestedScroll: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ---- anchors route through lenis, clearing the running head ---- */
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const from = event.target instanceof Element ? event.target : null;
      const anchor = from?.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -84, duration: 1.2 });
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
