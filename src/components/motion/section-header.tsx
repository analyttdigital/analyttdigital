import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Section header with a scroll-progress underline that fills as the heading
 * travels through the viewport, plus a soft parallax lift.
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <p className={`mono-label ${dark ? 'text-[#eceeee]/50' : 'text-ink/45'}`}>{eyebrow}</p>
      <h2 className={`display mt-6 max-w-3xl text-4xl md:text-[52px] md:leading-[1.05] ${dark ? 'text-[#eceeee]' : 'text-ink-950'}`}>
        {title}
      </h2>
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
