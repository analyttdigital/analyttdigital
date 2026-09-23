import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Parallax } from '@/lib/motion/parallax';
import { Reveal } from '@/lib/motion/reveal';
import type { CtaSection } from '@/lib/content/types';

/** Closing CTA — parallax glow washes that sink as you scroll through. */
export function Cta({ cta }: { cta?: CtaSection }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const glowY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.15]);

  return (
    <section id="audit" ref={ref} className="depth-dark relative overflow-hidden py-28 text-[#eceeee] md:py-36">
      <motion.div
        aria-hidden
        style={{ y: glowY, scale: glowScale }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(800px 400px at 85% 20%, rgba(240,79,38,0.16), transparent 60%), radial-gradient(600px 300px at 10% 90%, rgba(79,75,99,0.55), transparent 60%)',
          }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <Reveal>
          <p className="mono-label text-[#eceeee]/50">{cta?.eyebrow}</p>
          <h2 className="display mt-6 max-w-3xl text-4xl md:text-[54px] md:leading-[1.06]">{cta?.headline}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="prose-serif mt-8 max-w-xl text-[#eceeee]/75">{cta?.body}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <a
              href={cta?.ctaHref ?? '#contact'}
              className="depth-float inline-flex items-center gap-3 rounded bg-ember px-7 py-4 font-sans text-[15px] font-semibold text-white hover:bg-ember-600"
            >
              {cta?.cta} <span aria-hidden>→</span>
            </a>
            <p className="font-mono text-[12px] text-[#eceeee]/50">{cta?.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
