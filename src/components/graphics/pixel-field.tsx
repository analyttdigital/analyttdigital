'use client';

import { useEffect, useRef } from 'react';

/**
 * Dithered pixel-field motif (Oxigen-style dot graphics). Deterministic per
 * seed so SSR/CSR stay consistent — canvas only paints client-side.
 */
export function PixelField({
  seed = 1,
  density = 0.4,
  className,
}: {
  seed?: number;
  density?: number;
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
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          const n = rand();
          if (n < density) {
            const size = n < density * 0.3 ? cell - 3 : cell - 6;
            ctx.fillStyle = n < density * 0.12 ? '#f04f26' : 'rgba(79,75,99,0.85)';
            ctx.fillRect(x, y, size, size);
          }
        }
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [seed, density]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
