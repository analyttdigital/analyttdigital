/** Shared scroll-scrub math for the hero portal (and any future scrubbed effect).
 *
 *  Everything here is a pure function of scroll position: fully reversible,
 *  frame for frame, with no timers. `smooth` is the smoothstep used as the
 *  easing everywhere in the portal timeline.
 */

/** Clamp `x` into [0, 1]. */
export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** Smoothstep easing: maps t in [0,1] to t*t*(3-2*t). Doubles as the
 *  `ease` function passed to framer-motion transforms. */
export function smoothstepEase(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/** Remap `x` through the window [a, b] with smoothstep easing:
 *  0 below `a`, 1 above `b`, an S-curve between. */
export function smooth(a: number, b: number, x: number): number {
  if (b <= a) return x >= b ? 1 : 0;
  return smoothstepEase((x - a) / (b - a));
}
