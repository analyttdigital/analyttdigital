import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Section header — screenshot language: light eyebrow, giant navy display,
 * thin navy progress hairline that fills as the heading arrives.
 */
export function SectionHeader({
  eyebrow,
  title,
  progress = true,
  dark = false,
  align = 'left',
  className,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  progress?: boolean;
  dark?: boolean;
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className ?? ''}`}
    >
      <p className={`text-[15px] ${dark ? 'text-ink-700/80' : 'text-ink-700'}`}>{eyebrow}</p>
      <motion.h2
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.97, filter: 'blur(6px)' }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className={`display mt-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.08] ${dark ? 'text-paper' : 'text-ink-950'}`}
      >
        {title}
      </motion.h2>
      {progress ? (
        <motion.div
          aria-hidden
          style={{ scaleX, originX: 0 }}
          className={`mt-8 h-[2px] w-36 bg-ink-950/70 ${align === 'center' ? 'mx-auto' : ''}`}
        />
      ) : null}
      {children}
    </div>
  );
}
