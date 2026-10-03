'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * PixelDither — the resolve band, and the site's signature interaction.
 *
 * In this world a ground never *cuts* into the next one. It resolves: the
 * incoming ground rises into the outgoing one as a coarse field of squares —
 * solid at the new ground's edge, thinning upward, with a rare ember pixel in
 * the field because a pixel that arrives carrying signal is a live pixel.
 *
 * The square is deliberately huge: 25 columns across the viewport and six rows,
 * so at 1440 one pixel is roughly 56px. It has to read as a printed threshold
 * block, not as noise, or the effect is just a gradient with extra steps.
 *
 * One 2d canvas, redrawn only while the resolve is running and on resize, so
 * an idle page costs nothing. Under `prefers-reduced-motion` it paints its
 * final frame immediately. If there is no 2d context the container keeps a hard
 * two-colour gradient, so the band still separates the grounds.
 */

/** Classic 8×8 ordered-dither threshold matrix, values 0…63. */
const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
];

/** Rows the resolve aims for; the pixel side follows from the band's width. */
const ROWS = 6;
/** Columns the resolve aims for — the reference's figure, and the reason the
 *  square is large: at 1440 this is a ~58px pixel, not a 13px one. */
const COLS = 25;

function hash(x: number, y: number, seed: number) {
  let h = Math.imul(x + seed * 7, 374761393) ^ Math.imul(y, 668265263) ^ 0x5f3759df;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function channels(raw: string, fallback: [number, number, number]) {
  const parts = raw
    .trim()
    .split(/[\s,]+/)
    .map(Number.parseFloat);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return fallback;
  return [parts[0], parts[1], parts[2]] as [number, number, number];
}

export type ResolveProps = {
  /** CSS custom property holding the ground the reader is leaving. */
  from: string;
  /** …and the ground they are entering. */
  to: string;
  /** Floor for the band's height, in CSS px. */
  height?: number;
  /** Where the boundary sits across the band, 0 = top, 1 = bottom. */
  cut?: number;
  /** Invert: the incoming ground eats downward instead of upward. */
  flip?: boolean;
  /** Amplitude of the density falloff above the boundary. */
  spread?: number;
  /** Side of the authored pixel, in CSS px — a floor, not a fixed size. */
  cell?: number;
  /** Delay before the resolve runs, in ms. */
  delay?: number;
  seed?: number;
  className?: string;
};

export function PixelDither({
  from,
  to,
  height = 232,
  cut = 0.5,
  flip = false,
  spread = 0.8,
  cell = 21,
  delay = 0,
  seed = 11,
  className,
}: ResolveProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(hostRef, { once: true, margin: '-6% 0px' });
  const [painted, setPainted] = useState(false);

  const draw = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      const host = hostRef.current;
      if (!canvas || !host) return false;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return false;

      const bw = Math.round(w * dpr);
      const bh = Math.round(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const styles = getComputedStyle(document.documentElement);
      const ground = channels(styles.getPropertyValue(from), [16, 13, 26]);
      const incoming = channels(styles.getPropertyValue(to), [57, 49, 84]);
      const ember = channels(styles.getPropertyValue('--color-accent-500'), [240, 79, 38]);

      // The pixel is square and large: never smaller than the authored floor,
      // never so small that the band holds more than about 25 columns.
      const side = Math.max(cell, Math.ceil(w / COLS));
      const rows = Math.max(3, Math.min(ROWS * 2, Math.round(h / side)));
      const pitch = h / rows;
      const cols = Math.ceil(w / pitch) + 1;
      // Centre the grid when it is narrower than the band.
      const offsetX = Math.min(0, (w - cols * pitch) / 2);

      // `flip` swaps which ground the band stands on, so the resolve still
      // runs the same way when the join reads downward. `cut` says where the
      // incoming ground's solid edge sits across the band.
      const base = flip ? incoming : ground;
      const edge = flip ? ground : incoming;
      const baseFill = `rgb(${base[0]} ${base[1]} ${base[2]})`;
      const incomingFill = `rgb(${edge[0]} ${edge[1]} ${edge[2]})`;
      const emberFill = `rgb(${ember[0]} ${ember[1]} ${ember[2]})`;

      // `up` is 0 at the row the incoming ground is solid on and grows away
      // from it, so density falls off with height above that edge.
      const solidRow = Math.round((flip ? 1 - cut : cut) * (rows - 1));
      ctx.fillStyle = baseFill;
      ctx.fillRect(0, 0, w, h);

      for (let r = 0; r < rows; r += 1) {
        const up = Math.abs(r - solidRow) / rows;
        const density = up * spread >= 0.34 ? 1 : 0.2 + up * spread * 2.4;

        for (let c = 0; c < cols; c += 1) {
          // The threshold matrix orders the field, but on its own at this
          // pixel size it reads as diagonal banding. Noise on top of it keeps
          // the order and loses the stripes.
          const jitter = hash(c, r, seed ^ 0x51ed) - 0.5;
          const order = BAYER8[(r % 8) * 8 + (c % 8)] / 64 + jitter * 0.62;
          if (order >= density) continue;

          const pick = hash(c, r, seed);
          // Reveal from the solid edge outward, with jitter, so the ground
          // arrives rather than simply fading in.
          const at = (up + (1 - pick) * 0.42) / (rows + 0.5);
          if (progress < at) continue;

          // Mostly the incoming ground; the odd square left behind in the old
          // one keeps the field from reading as a gradient; a rarer ember
          // square is a pixel that arrived carrying signal.
          ctx.fillStyle =
            pick < 0.64 ? incomingFill : pick < 0.975 ? baseFill : emberFill;
          ctx.fillRect(offsetX + c * pitch, r * pitch, pitch + 0.6, pitch + 0.6);
        }
      }
      return true;
    },
    [cell, cut, flip, from, seed, spread, to],
  );

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      if (draw(1)) setPainted(true);
      return;
    }

    let raf = 0;
    let started = 0;
    let last = -1;
    const DURATION = 1000;

    const frame = (now: number) => {
      if (!started) started = now;
      const t = Math.min(1, Math.max(0, now - started - delay) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      if (eased !== last) {
        last = eased;
        if (draw(eased)) setPainted(true);
      }
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const resize = () => draw(last < 0 ? 0 : last);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [delay, draw, inView, reduce]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`resolve ${className ?? ''}`}
      // Sized from the viewport so the square stays a fixed fraction of the
      // width on every screen, with no layout shift once the canvas measures
      // itself. `height` is the floor; `cell` keeps a small screen legible.
      style={{ height: `clamp(${Math.max(Math.round(cell * 4), Math.min(height, 260))}px, 22vw, 300px)` }}
    >
      {/* The fallback is a real ground change in CSS, so it survives a missing
          2d context, a blocked GPU, or reduced motion. It is hidden only once
          the canvas has actually painted over it. */}
      <div
        className="resolve__fallback"
        style={{
          background: `linear-gradient(to bottom, rgb(var(${from})) 0 50%, rgb(var(${to})) 50% 100%)`,
          opacity: painted ? 0 : 1,
        }}
      />
      <canvas ref={canvasRef} style={{ opacity: painted ? 1 : 0 }} />
    </div>
  );
}