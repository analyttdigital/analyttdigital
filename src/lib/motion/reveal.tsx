import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Fluid scroll reveal: fade + rise + de-blur + micro-scale. The blur makes
 * sections feel like they condense out of the page as you scroll.
 */
export function useRevealVariants(delay = 0) {
  const reduce = useReducedMotion();
  if (reduce) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, margin: '-10% 0px' },
      transition: { duration: 0.3, delay },
    };
  }
  return {
    initial: { opacity: 0, y: 42, filter: 'blur(10px)', scale: 0.985 },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  };
}

/** Standard scroll-reveal wrapper used across all sections. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const props = useRevealVariants(delay);
  return (
    <motion.div
      className={className}
      initial={props.initial}
      whileInView={props.whileInView}
      viewport={props.viewport}
      transition={props.transition}
    >
      {children}
    </motion.div>
  );
}
