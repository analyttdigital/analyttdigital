import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { EASE_OUT } from '@/lib/motion/reveal';

/**
 * 3D scroll primitives — the core of the scroll-depth overhaul.
 *
 * Why this file exists: every scroll-linked 3D effect (tilt-in, rise-out,
 * stacked deck, parallax depth) funnels through here so easing, perspective
 * and reduced-motion handling stay consistent. Sections compose these instead
 * of hand-rolling useScroll transforms.
 *
 * Rules:
 * - All transforms are scroll-linked via useScroll/useTransform (no scroll
 *   listeners), so they compose with Lenis.
 * - Reduced-motion visitors get a plain fade (or nothing scroll-linked).
 * - Parents must provide perspective — use <Perspective> or the
 *   `.perspective-stage` utility. Children get preserve-3d automatically.
 */

/** Perspective stage: sets the 3D viewing distance for all descendants. */
export function Perspective({
  children,
  className,
  distance = 1200,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <div className={className} style={{ perspective: distance }}>
      {children}
    </div>
  );
}

/** Shared fade props for reduced-motion (mirrors Reveal's reduced path). */
function useFadeOnly(delay = 0) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.3, delay },
  };
}

/**
 * Cover3D — scroll entrance with real depth.
 * Rises out of the page: rotateX (12–24deg) + y + scale + de-blur.
 * Use for cards, panels, headers. Stagger via `delay`.
 */
export function Cover3D({
  children,
  className,
  delay = 0,
  tilt = 18,
  y = 64,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  tilt?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const fade = useFadeOnly(delay);
    return (
      <motion.div
        className={className}
        initial={fade.initial}
        whileInView={fade.whileInView}
        viewport={fade.viewport}
        transition={fade.transition}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y, rotateX: tilt, scale: 0.96, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollTilt — continuous scroll-linked 3D drift.
 * The element tilts back (rotateX), shifts (y) and recedes (scale) as it
 * travels through the viewport. Gives the "flying through layers" feel.
 * Wraps children in its own scroll-tracking div.
 */
export function ScrollTilt({
  children,
  className,
  tilt = 10,
  travel = 60,
  scaleTo = 0.94,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  travel?: number;
  scaleTo?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [tilt, 0, -tilt]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleTo, 1, scaleTo]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0.25]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div style={{ y, rotateX, scale, opacity, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * ZoomLayer — scroll-linked push toward / away from the camera.
 * Maps scroll progress to scale + translateZ for tunnel / portal moments
 * (hero media, CTA panel, full-bleed stats band).
 */
export function ZoomLayer({
  children,
  className,
  from = 0.9,
  to = 1.06,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const z = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className} style={{ perspective: 1100 }}>
      <motion.div style={{ scale, z, transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * StackDeck — sticky 3D card deck (used by Process + Work).
 * Each <StackCard> sticks; earlier cards tilt back, shrink and dim as the
 * next card slides over — a true depth stack, not a flat list.
 */
export function StackDeck({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} style={{ perspective: 1400 }}>
      {children}
    </div>
  );
}

export function StackCard({
  children,
  index,
  total,
  className,
  top = 88,
}: {
  children: ReactNode;
  index: number;
  total: number;
  className?: string;
  top?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Track the whole deck travel per card: card enters flat, then recedes as
  // the deck keeps scrolling beneath the sticky position.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const recede: MotionValue<number> = useTransform(scrollYProgress, [0.45, 1], [1, Math.max(0.86, 1 - 0.04 * (total - index))]);
  const tiltBack = useTransform(scrollYProgress, [0.45, 1], [0, -8]);
  const dim = useTransform(scrollYProgress, [0.45, 1], [1, 0.55]);
  const rise = useTransform(scrollYProgress, [0, 0.45], [80, 0]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <div className="sticky" style={{ top }}>
        <motion.div
          style={{
            y: rise,
            scale: recede,
            rotateX: tiltBack,
            opacity: dim,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center top',
            zIndex: index + 1,
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/** 3D headline line: masked rise with rotateX — used for hero / big titles. */
export function Line3D({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.span
        className={`block ${className ?? ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        {children}
      </motion.span>
    );
  }
  return (
    <span className={`block overflow-hidden ${className ?? ''}`} style={{ perspective: 900 }}>
      <motion.span
        className="block"
        style={{ transformOrigin: '50% 100%', transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: '110%', rotateX: -38 }}
        animate={{ opacity: 1, y: '0%', rotateX: 0 }}
        transition={{ duration: 1, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
