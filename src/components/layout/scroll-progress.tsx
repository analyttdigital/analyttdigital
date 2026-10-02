'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Continuous scroll-progress treatment (M4).
 *
 * A single slim gradient hairline (accent → primary) tracking overall page
 * progress. The chaptered rail — ticks, percentage readout, active-chapter
 * label — was retired with the snap engine: progress here is one fluid
 * surface, not a table of contents. Scroll-linked (no auto-animation), so
 * it stays calm under `prefers-reduced-motion`.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-accent to-primary"
      style={{ scaleX: progress }}
    />
  );
}
