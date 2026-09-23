'use client';

import { useEffect, useRef } from 'react';

/**
 * Canvas "dither" wordmark: text rendered to an offscreen canvas, sampled on
 * a grid and re-drawn as dot-matrix squares — the Oxigen footer treatment.
 */
export function DitherWordmark({ text = 'analytt' }: { text?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // 1. Draw the text into an offscreen canvas at high resolution.
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const offCtx = off.getContext('2d');
      if (!offCtx) return;
      offCtx.fillStyle = '#fff';
      offCtx.textBaseline = 'middle';
      let size = h * 0.9;
      offCtx.font = `700 ${size}px Manrope, sans-serif`;
      // Shrink until it fits the width.
      while (offCtx.measureText(text).width > w * 0.98 && size > 10) {
        size -= 2;
        offCtx.font = `700 ${size}px Manrope, sans-serif`;
      }
      offCtx.fillText(text, (w - offCtx.measureText(text).width) / 2, h / 2);

      // 2. Sample it on a grid and draw dot-matrix squares.
      const cell = Math.max(4, Math.round(w / 130));
      const data = offCtx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += cell) {
        for (let x = 0; x < w; x += cell) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 128) {
            ctx.fillStyle = 'rgba(236,238,238,0.92)';
            ctx.fillRect(x, y, cell - 1, cell - 1);
          }
        }
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [text]);

  return <canvas ref={ref} className="h-[26vw] max-h-[320px] w-full" aria-hidden />;
}
