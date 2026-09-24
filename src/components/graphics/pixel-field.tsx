'use client';

import { useEffect, useRef } from 'react';

/**
 * Dithered pixel-field motif — redesigned for the scroll-depth system.
 *
 * Two modes, same deterministic seed contract (SSR/CSR consistent):
 * - flat (default): even dither field, as before.
 * - floor: perspective mode — cells grow + fade toward the bottom edge so
 *   the strip reads as a tunnel floor receding to a horizon. Used by the
 *   belief strip and capability cards.
 */
export function PixelField({
  seed = 1,
  density = 0.4,
  depth = false,
  className,
}: {
  seed?: number;
  density?: number;
  depth?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple deterministic PRNG (mulberry32).
    let a = seed * 10000 + 12345;
    const rand = () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cell = Math.max(7, Math.round(w / 34));
      // Horizon sits ~38% down in floor mode; density swells past it.
      const horizon = h * 0.38;
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          const n = rand();
          const t = depth ? Math.min(1, Math.max(0, (y - horizon) / (h - horizon))) : 0.5;
          const localDensity = depth ? density * (0.25 + t * 1.1) : density;
          if (n < localDensity) {
            const growth = depth ? 1 + t * 1.6 : 1;
            const base = n < localDensity * 0.3 ? cell - 3 : cell - 6;
            const size = Math.max(2, base * growth * 0.62);
            const isEmber = n < localDensity * 0.12;
            // Fade far cells toward the horizon; warm near cells.
            const alpha = depth ? 0.25 + t * 0.65 : 0.85;
            ctx.fillStyle = isEmber
              ? `rgba(240,79,38,${Math.min(1, alpha + 0.1)})`
              : `rgba(79,75,99,${alpha})`;
            const cx = x + cell / 2 - size / 2;
            const cy = y + cell / 2 - size / 2;
            ctx.fillRect(cx, cy, size, size);
          }
        }
      }

      if (depth) {
        // Ember horizon glow — the tunnel's vanishing light.
        const glow = ctx.createRadialGradient(w / 2, horizon, 4, w / 2, horizon, w * 0.4);
        glow.addColorStop(0, 'rgba(240,79,38,0.22)');
        glow.addColorStop(1, 'rgba(240,79,38,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [seed, density, depth]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
