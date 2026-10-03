import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, margin: '0px 0px -6% 0px' } as const;

/**
 * The mesh's motion vocabulary.
 *
 * Nothing here bounces and nothing loops. The world is a routed signal, so a
 * section arrives the way a signal resolves: a panel wipes in along one edge,
 * a row lands and settles, a figure rises off its own baseline, a rule draws
 * itself across. Every entrance is scroll-linked through Framer's
 * `whileInView` (never a scroll listener), every one runs on the same
 * exponential ease-out, and every one degrades to a plain fade under
 * `prefers-reduced-motion`.
 *
 * The two *loops* on the page — the packets travelling the traces and the
 * pixel resolve — are authored once, in `src/components/graphics`, and are
 * not repeated here. One authored moment, not an effect on every section.
 */

export function useRevealVariants(delay = 0) {
  const reduce = useReducedMotion();
  if (reduce) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: VIEWPORT,
      transition: { duration: 0.3, delay },
    };
  }
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  };
}

/** Content arriving: rise + fade, the mesh's default entrance. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'p';
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  if (reduce) {
    return (
      <Component
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.3, delay }}
      >
        {children}
      </Component>
    );
  }
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}

/** A line of display type rising out of its own mask. */
export function MaskedLine({
  children,
  delay = 0,
  className,
  duration = 1,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span className={`block ${className ?? ''}`}>
        <motion.span
          className="block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay }}
        >
          {children}
        </motion.span>
      </span>
    );
  }
  return (
    <span className={`block overflow-hidden ${className ?? ''}`}>
      <motion.span
        className="block"
        initial={{ y: '108%' }}
        animate={{ y: '0%' }}
        transition={{ duration, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * A hairline drawing itself from the left, as a signal pulls across the wire.
 * `children` is the rule itself — weight and colour live at the call site.
 */
export function RuleDraw({
  children,
  className,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div aria-hidden className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ originX: 0, transformOrigin: '0% 50%' }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A panel resolving into place along one edge. Square corners, no radius —
 * the wipe is the same gesture as the resolve band, at panel scale.
 */
export function PanelIn({
  children,
  className,
  delay = 0,
  from = 'left',
  distance = 6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: 'left' | 'bottom' | 'center';
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const closed: Record<string, string> = {
    left: `inset(0 ${distance}% 0 0)`,
    bottom: `inset(0 0 ${distance}% 0)`,
    center: `inset(${distance}% ${distance}% ${distance}% ${distance}%)`,
  };
  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.3, delay }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      style={{ clipPath: closed[from] }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.95, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A row of a readout or a grid landing in place, staggered down the page. */
export function NodeIn({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'article';
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  if (reduce) {
    return (
      <Component
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.3, delay }}
      >
        {children}
      </Component>
    );
  }
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}

/** A figure rising off its own baseline — how every number arrives here. */
export function TallyRise({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.3, delay }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: '50% 100%' }}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.95, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container for the repeated rows of a readout or a grid. */
export const rowStagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};