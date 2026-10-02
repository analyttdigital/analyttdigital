import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, margin: '-12% 0px' } as const;

/**
 * The sheet's motion vocabulary.
 *
 * A printed sheet does not bounce. Everything here is one idea in different
 * guises: material arriving on press — a line rises out of its rule, a rule
 * draws itself, a plate wipes into place, a figure rises from its baseline.
 * All of it is scroll-linked through Framer's `whileInView` (never a scroll
 * listener), all of it runs on one exponential ease-out, and every variant
 * degrades to a plain fade under `prefers-reduced-motion`.
 *
 * Sections compose these instead of hand-rolling transforms, so timing,
 * easing and the reduced path stay in one file.
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
    initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: VIEWPORT,
    transition: { duration: 0.85, ease: EASE_OUT, delay },
  };
}

/** Text arriving on press: rise + de-blur, the sheet's default entrance. */
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
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.85, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}

/** A line rising out of its own rule, masked — headlines and the masthead. */
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
 * A hairline rule drawing itself from the left, as a print pass pulls it.
 * `children` is the rule itself (weight and colour live in the call site).
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
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A plate wiping into place along the sheet — data blocks and coupons. */
export function Impression({
  children,
  className,
  delay = 0,
  from = 'left',
  distance = 6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: 'left' | 'center';
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const inset = from === 'left' ? `inset(0 ${distance}% 0 0 round 2px)` : `inset(0 ${distance}% 0 ${distance}% round 2px)`;
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
      style={{ clipPath: inset }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0 round 2px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A row of a table or ledger pressing into place, staggered down the sheet. */
export function RowPress({
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
      initial={{ opacity: 0, y: 14, clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A figure rising from its own baseline, the way type sits on a rule. */
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
      initial={{ opacity: 0, scaleY: 0.72, y: 8 }}
      whileInView={{ opacity: 1, scaleY: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.95, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** The coupon tearing into the sheet along its perforated edge. */
export function CouponTear({
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
      initial={{ opacity: 0, y: 42, clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.05, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container for the repeated rows of a ledger or an index. */
export const rowStagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
