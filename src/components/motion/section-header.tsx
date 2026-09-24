import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Section header with 3D title rise + scroll-progress underline.
 * Title folds up out of the page (rotateX) on entrance, underline fills
 * as the heading travels through the viewport.
 */
export function SectionHeader({
  eyebrow,
  title,
  progress = true,
  dark = false,
  className,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  progress?: boolean;
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`perspective-stage ${className ?? ''}`}>
      <p className={`mono-label ${dark ? 'text-[#eceeee]/50' : 'text-ink/45'}`}>{eyebrow}</p>
      <motion.h2
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 44, rotateX: 22 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 100%' }}
        className={`display mt-6 max-w-3xl text-4xl md:text-[52px] md:leading-[1.05] ${dark ? 'text-[#eceeee]' : 'text-ink-950'}`}
      >
        {title}
      </motion.h2>
      {progress ? (
        <motion.div
          aria-hidden
          style={{ scaleX, originX: 0 }}
          className={`mt-8 h-[3px] w-40 ${dark ? 'bg-ember' : 'bg-ember'}`}
        />
      ) : null}
      {children}
    </div>
  );
}
