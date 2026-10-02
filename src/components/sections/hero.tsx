import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { IconPanel } from '@/components/graphics/icon-panel';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { EASE_OUT } from '@/lib/motion/reveal';
import type { HeroSection } from '@/lib/content/types';

/**
 * Hero — screenshot 2 composition: light stage, giant navy display headline,
 * floating dashboard card flanked by avatar bubbles, pill callouts and a
 * partner logo strip. Subtle 3D: bubbles drift at different parallax rates,
 * the dashboard tilts in, the whole stage folds away on scroll.
 */
export function Hero({ hero }: { hero?: HeroSection }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Stage fold: content rises, stage tilts back and fades as you leave.
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const stageRotate = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  // Bubble parallax rates (px drift per scroll progress)
  const bubbleA = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const bubbleB = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const bubbleC = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const dashY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const lines = (hero?.headline ?? '').split('\n');
  const marquee = hero?.marquee ?? [];

  const bubbles = [
    { style: { y: reduce ? 0 : bubbleA }, className: 'left-[4%] top-[16%] h-20 w-20 md:h-28 md:w-28', tint: 'bg-accent-200', label: 'A' },
    { style: { y: reduce ? 0 : bubbleB }, className: 'right-[6%] top-[10%] h-16 w-16 md:h-24 md:w-24', tint: 'bg-accent-300', label: 'B' },
    { style: { y: reduce ? 0 : bubbleC }, className: 'right-[14%] bottom-[18%] h-24 w-24 md:h-32 md:w-32', tint: 'bg-accent-100', label: 'C' },
  ];

  return (
    <section
      id="hero"
      data-snap
      ref={ref}
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-6 pt-24 md:px-6 md:pt-28"
    >
      <motion.div
        style={reduce ? undefined : { y: stageY, rotateX: stageRotate, opacity: stageOpacity, transformOrigin: '50% 0%' }}
        className="stage preserve-3d mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-[1320px] flex-col"
      >
        {/* floating avatar bubbles */}
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.label}
            aria-hidden
            style={bubble.style}
            className={`absolute z-0 hidden rounded-full lg:block ${bubble.className}`}
          >
            <div className={`h-full w-full rounded-full ${bubble.tint} shadow-float`} />
          </motion.div>
        ))}

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-16 text-center md:pt-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
            className="text-[15px] text-ink-700"
          >
            {hero?.eyebrow}
          </motion.p>

          <h1 className="display mt-6 text-[clamp(2.8rem,6.5vw,5.4rem)] leading-[1.05] tracking-[-0.03em] text-ink-950">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 + i * 0.12 }}
                >
                  {line || '\u00A0'}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.55 }}
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-700"
          >
            {hero?.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a href={hero?.ctaHref ?? '#contact'} className="btn-pill btn-pill--ink">
              {hero?.cta ?? 'Start with a free audit'} <MdiIcon name="arrowTopRight" size={0.65} />
            </a>
            <a href="#process" className="btn-pill btn-pill--ghost">
              {hero?.scrollHint ?? 'See how we work'} <MdiIcon name="arrowDown" size={0.65} />
            </a>
          </motion.div>
        </div>

        {/* dashboard cluster */}
        <div className="relative z-10 mx-auto mt-12 w-full max-w-4xl flex-1 px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 14 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.8 }}
            style={reduce ? undefined : { y: dashY }}
            className="relative mx-auto max-w-2xl preserve-3d"
          >
            {/* dashboard card */}
            <div className="card-float overflow-hidden p-2.5">
              <div className="overflow-hidden rounded-2xl bg-paper">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-[12px] font-semibold text-ink-900">{hero?.dashboardTitle ?? 'Campaign / Live'}</span>
                  <span className="flex items-center gap-2 text-[12px] font-semibold text-accent-600">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-500" />
                    {hero?.dashboardMetric ?? 'ROAS 4.2×'}
                  </span>
                </div>
                <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gradient-to-b from-accent-50 via-paper to-mist-100">
                  <div aria-hidden className="aurora absolute inset-0 opacity-40" />
                  <IconPanel icon="chart" size="lg" />
                </div>
              </div>
            </div>

            {/* pill callouts */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.15 }}
              className="absolute -left-8 top-1/3 hidden md:block"
            >
              <span className="callout callout-tail">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ember/15 text-ember-600">
                  <MdiIcon name="chart" size={0.7} />
                </span>
                {hero?.statA_label ?? 'CPL this month'} · <strong>{hero?.statA_value ?? 'KES 280'}</strong>
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.3 }}
              className="absolute -right-6 bottom-10 hidden md:block"
            >
              <span className="callout">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <MdiIcon name="rocket" size={0.7} />
                </span>
                {hero?.statB_label ?? 'Leads / month'} · <strong>{hero?.statB_value ?? '1,200+'}</strong>
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* logo strip */}
        <div className="relative z-10 border-t border-ink-950/8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6">
            {marquee.map((item) => (
              <span key={item} className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
