'use client';

import type { MotionValue } from 'framer-motion';
import { motion, useMotionValue, useTransform } from 'framer-motion';

import { smooth } from '@/lib/motion/smooth';

/**
 * HeroGatherLite — the mobile-first alternative to the WebGL gather scene.
 *
 * Zero WebGL, zero three.js, zero gsap, zero per-frame JS: a single static
 * collage image (`/img/logo-marketing-collage.svg`), drifting only through
 * compositor-friendly `transform` / `opacity` keyed off the hero's single
 * scroll-progress source. `useTransform` writes straight to the element's
 * style with zero React re-renders.
 *
 * Rendered only on mobile / low-compute (see `useLiteScene`); capable
 * desktops keep the full `HeroGather` canvas. `aria-hidden` — pure
 * decoration, never information.
 */
export function HeroGatherLite({ progress }: { progress?: MotionValue<number> }) {
  // Mirrors the hero's `src = p ?? fallback` pattern: hooks stay
  // unconditional and static readers get identity transforms.
  const fallback = useMotionValue(0);
  const src = progress ?? fallback;
  // Idle drift: GPU-only transforms on the wrapper, eased through the same
  // `smooth` windows the full scene uses so both variants park together.
  const driftY = useTransform(src, (v) => -smooth(0.15, 0.45, v) * 48);
  const driftScale = useTransform(src, (v) => 1 + smooth(0.15, 0.45, v) * 0.1);
  const fade = useTransform(src, (v) => 1 - smooth(0.22, 0.38, v) * 0.55);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ y: driftY, scale: driftScale, opacity: fade }}
    >
      {/* Static glows — plain CSS gradients, no blur filter (fill-rate safe). */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_22%,rgba(240,79,38,.14),transparent_70%),radial-gradient(50%_40%_at_50%_30%,rgba(79,75,99,.18),transparent_70%)]" />
      {/* The collage — static asset, no animation at all under
          `motion-reduce` (the float carries `motion-safe:`). */}
      <img
        src="/img/logo-marketing-collage.svg"
        alt=""
        draggable={false}
        className="absolute left-1/2 top-[86px] w-[min(72vw,340px)] -translate-x-1/2 motion-safe:animate-[hero-lite-float_7s_ease-in-out_infinite]"
      />
    </motion.div>
  );
}
