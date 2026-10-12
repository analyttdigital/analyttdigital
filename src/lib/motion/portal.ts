/** Shared hero-portal timeline — the single source of truth for the
 *  reveal choreography.
 *
 *  The renderer pins the hero for `PORTAL_RUNWAY_SVH` extra viewport-heights
 *  and opens the flood circle over `PORTAL_RANGE` (fractions of the runway's
 *  scroll progress `p`); the About bridge copy rides in over
 *  `PORTAL_BRIDGE_RANGE`. The gather scene, the hero stage fades and the
 *  header's solid-toggle all key off these windows — read them from here
 *  instead of duplicating literals.
 */

export const PORTAL_RUNWAY_SVH = 300;

/** Progress window in which the flood circle opens (finishes before the
 *  process cover starts). */
export const PORTAL_RANGE: [number, number] = [0.35, 0.6];

/** Progress window in which the About bridge copy rides in. */
export const PORTAL_BRIDGE_RANGE: [number, number] = [0.42, 0.57];

/** Clip origin = the mark's final on-screen position (desktop / mobile). */
export const PORTAL_ORIGIN = '67% 51%';
export const PORTAL_ORIGIN_MOBILE = '50% 26%';

/** Scroll distance (px) from the page top at which the About bridge starts
 *  to reveal: the hero portal's top plus the bridge-start share of its
 *  scrollable runway length. Null when no hero portal is on the page
 *  (the header then keeps its default solid-toggle distance). */
export function aboutRevealDistance(heroId = 'hero'): number | null {
  if (typeof window === 'undefined') return null;
  const el = document.getElementById(heroId);
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const scrollable = el.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return null;
  return top + PORTAL_BRIDGE_RANGE[0] * scrollable;
}
