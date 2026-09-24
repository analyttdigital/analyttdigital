import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { AnalyticsScreen } from '@/components/graphics/analytics-screen';
import { MdiIcon } from '@/components/motion/mdi-icon';
import { EASE_OUT } from '@/lib/motion/reveal';
import { Line3D } from '@/lib/motion/scroll-3d';
import type { HeroSection } from '@/lib/content/types';

/** Hero — dark ink band, flat bordered figure, minimal 3D fold on scroll. */
export function Hero({ hero }: { hero?: HeroSection }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const mediaRotate = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const marqueeX = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const marquee = hero?.marquee ?? [];
  const lines = (hero?.headline ?? '').split('\n');

  return (
    <section
      id="hero"
      data-snap
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950 pt-28 text-[#eceeee]"
    >
      <div className="relative mx-auto grid w-full max-w-[1320px] gap-12 px-6 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        {/* content — folds gently as you scroll on */}
        <motion.div
          style={reduce ? undefined : { y: contentY, rotateX: contentRotate, opacity: contentOpacity, transformOrigin: '50% 100%' }}
          className="preserve-3d"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
            className="mono-label text-[#eceeee]/60"
          >
            {hero?.eyebrow}
          </motion.p>

          <h1 className="display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] text-[#eceeee]">
            {lines.map((line, i) => (
              <Line3D key={i} delay={0.3 + i * 0.12}>
                {line || '\u00A0'}
              </Line3D>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
            className="prose-serif mt-8 max-w-xl text-[#eceeee]/75"
          >
            {hero?.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.65 }}
            className="mt-10 flex flex-wrap items-center gap-6 pb-20"
          >
            <a
              href={hero?.ctaHref ?? '#contact'}
              className="mono-btn border-[#eceeee]/30 text-[#eceeee] hover:border-ember hover:bg-ember hover:text-white"
            >
              {hero?.cta ?? 'Start with a free audit'} <MdiIcon name="arrowRight" size={0.75} />
            </a>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-monoSm text-[#eceeee]/50">
              <MdiIcon name="arrowDown" size={0.7} className="text-ember" />
              {hero?.scrollHint ?? 'Scroll'}
            </p>
          </motion.div>
        </motion.div>

        {/* figure — flat bordered panel, no glass, no float */}
        <motion.figure
          className="preserve-3d mb-20 hidden border border-[#eceeee]/15 bg-white/[0.03] p-4 lg:block"
          style={reduce ? undefined : { y: mediaY, rotateX: mediaRotate }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.7 }}
        >
          <div className="flex items-center justify-between border-b border-[#eceeee]/10 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-monoSm text-[#eceeee]/55">
              {hero?.dashboardTitle ?? 'Campaign / Live'}
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-monoSm text-ember">
              <span className="inline-block h-2 w-2 rounded-full bg-ember" />
              {hero?.dashboardMetric ?? 'ROAS 4.2×'}
            </span>
          </div>
          <div className="bg-white p-3">
            <AnalyticsScreen variant={0} />
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#eceeee]/10 pt-px">
            <div className="bg-ink-950 px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-monoSm text-[#eceeee]/50">{hero?.statA_label ?? 'CPL this month'}</p>
              <p className="font-display text-xl font-bold text-[#eceeee]">
                {hero?.statA_value ?? 'KES 280'} <span className="text-[11px] font-semibold text-ember">{hero?.statA_delta ?? '-84%'}</span>
              </p>
            </div>
            <div className="bg-ink-950 px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-monoSm text-[#eceeee]/50">{hero?.statB_label ?? 'Leads / month'}</p>
              <p className="font-display text-xl font-bold text-[#eceeee]">{hero?.statB_value ?? '1,200+'}</p>
            </div>
          </div>
        </motion.figure>
      </div>

      {/* channel index — hairline rule, flat mono items */}
      <div className="relative border-t border-[#eceeee]/15 py-5">
        <motion.div style={{ x: marqueeX }}>
          <Marquee items={marquee} />
        </motion.div>
      </div>

      <motion.div aria-hidden style={{ scaleX: progressScale, originX: 0 }} className="absolute bottom-0 left-0 h-[2px] w-full bg-ember" />
    </section>
  );
}

function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 items-center gap-12 pr-12"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center whitespace-nowrap font-mono text-[12px] uppercase tracking-monoSm text-[#eceeee]/55">
            {item}
            <MdiIcon name="asterisk" size={0.7} className="ml-12 text-ember" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
