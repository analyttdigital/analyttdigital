'use client';

import { useEffect, useState } from 'react';

/**
 * Lite-scene eligibility — mobile-first + low-compute guard.
 *
 * Returns true when the heavy WebGL gather should stay unloaded:
 * - small viewport / coarse pointer (phones, portrait tablets), OR
 * - `Save-Data` on, OR
 * - very low compute (`deviceMemory <= 4` / `hardwareConcurrency <= 4`), OR
 * - `prefers-reduced-motion` (static readable state wins anyway).
 *
 * SSR defaults to `true` (mobile-first): the first paint is always the
 * featherweight static mark, and capable desktops upgrade to WebGL after
 * hydration. This keeps LCP free of three.js/gsap on phones and avoids a
 * hydration flash on desktop (upgrade only, never downgrade flicker).
 */
export function useLiteScene(): boolean {
  const [lite, setLite] = useState(true);

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 760px)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const conn = nav.connection;

    const compute = () => {
      const smallScreen = mqMobile.matches;
      // Portrait tablets behave like phones for the hero (copy bottom,
      // mark top) — matches the `isMobile` rule already in `hero.tsx`.
      const portraitTablet =
        window.innerHeight > window.innerWidth && window.innerWidth < 1024;
      const saveData = conn?.saveData === true;
      const slowNet =
        conn?.effectiveType === 'slow-2g' ||
        conn?.effectiveType === '2g' ||
        conn?.effectiveType === '3g';
      const lowMem =
        typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
      const lowCpu =
        typeof navigator.hardwareConcurrency === 'number' &&
        navigator.hardwareConcurrency <= 4;
      setLite(
        smallScreen ||
          (mqCoarse.matches && portraitTablet) ||
          portraitTablet ||
          mqReduce.matches ||
          saveData ||
          slowNet ||
          lowMem ||
          lowCpu,
      );
    };

    compute();
    mqMobile.addEventListener?.('change', compute);
    mqReduce.addEventListener?.('change', compute);
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      mqMobile.removeEventListener?.('change', compute);
      mqReduce.removeEventListener?.('change', compute);
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, []);

  return lite;
}
