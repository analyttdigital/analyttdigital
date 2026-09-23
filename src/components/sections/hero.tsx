import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { AnalyticsScreen } from '@/components/graphics/analytics-screen';
import { TiltCard } from '@/components/motion/tilt-card';
import { EASE_OUT } from '@/lib/motion/reveal';
import type { HeroSection } from '@/lib/content/types';

/** Full-height hero: depth-layered ink scene, floating dashboard, marquee. */
export function Hero({ hero }: { hero?: HeroSection }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Layered parallax: content drifts up slower than the backdrop; media tilts.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const marqueeX = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const marquee = hero?.marquee ?? [];

  return (
    <section id="hero" ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32 text-[#eceeee]">
      {/* depth layer 1 — breathing glow (base colors come from ScrollCanvas) */}
      <motion.div aria-hidden className="absolute inset-0" style={{ opacity: glowOpacity }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 560px at 76% 28%, rgba(79,75,99,0.35), transparent 62%), radial-gradient(820px 460px at 14% 82%, rgba(240,79,38,0.10), transparent 58%)',
          }}
        />
      </motion.div>

      {/* depth layer 2 — drifting pixel grid */}
      <motion.div aria-hidden className="absolute inset-0 opacity-[0.16]" style={{ y: useTransform(scrollYProgress, [0, 1], [0, 80]) }}>
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(236,238,238,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(236,238,238,0.35) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(900px 520px at 70% 40%, black, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(900px 520px at 70% 40%, black, transparent 75%)',
          }}
        />
      </motion.div>

      {/* depth layer 3 — floating dashboard card */}
      <motion.div
        className="pointer-events-none absolute right-[7%] top-[22%] hidden w-[330px] lg:block xl:w-[380px]"
        style={{ y: mediaY }}
        initial={{ opacity: 0, y: 60, rotateY: -12 }}
        animate={{ opacity: 1, y: 0, rotateY: -6 }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.7 }}
      >
        <TiltCard max={7}>
          <div className="depth-panel rounded-lg border border-ink/10 p-4">
            <div className="flex items-center justify-between pb-3">
              <span className="font-mono text-[10px] uppercase tracking-monoSm text-ink/50">Campaign / Live</span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-monoSm text-ember">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ember" /> ROAS 4.2×
              </span>
            </div>
            <div className="depth-inset rounded-md bg-mist p-3">
              <AnalyticsScreen variant={0} />
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* content layer */}
      <motion.div style={{ y: contentY }} className="relative mx-auto w-full max-w-[1320px] px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
          className="mono-label text-[#eceeee]/60"
        >
          {hero?.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
          className="display mt-6 max-w-4xl whitespace-pre-line text-[clamp(2.6rem,7vw,5.5rem)] text-[#eceeee]"
        >
          {hero?.headline}
        </motion.h1>

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
          className="mt-10 pb-20"
        >
          <a
            href={hero?.ctaHref ?? '#contact'}
            className="mono-btn border-[#eceeee]/30 text-[#eceeee] hover:border-ember hover:bg-ember hover:text-white"
          >
            {hero?.cta ?? 'Start with a free audit'} <span aria-hidden>→</span>
          </a>
        </motion.div>
      </motion.div>

      {/* channel marquee, drifts with scroll */}
      <div className="relative border-t border-[#eceeee]/15 py-5">
        <motion.div style={{ x: marqueeX }}>
          <Marquee items={marquee} />
        </motion.div>
      </div>

      {/* scroll progress hairline at the very bottom of the hero */}
      <motion.div aria-hidden style={{ scaleX: progressScale, originX: 0 }} className="absolute bottom-0 left-0 h-[2px] w-full bg-ember/70" />
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
          <span key={`${item}-${i}`} className="whitespace-nowrap font-mono text-[12px] uppercase tracking-monoSm text-[#eceeee]/55">
            {item}
            <span className="ml-12 text-ember">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
