import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Reveal } from '@/lib/motion/reveal';
import type { ProcessSection } from '@/lib/content/types';

/**
 * "HOW WE WORK" chapters — full-height dark panels in the reference rhythm.
 * Each chapter layers a sticky ghost numeral, a scroll-linked progress line
 * and depth shading for a subtle 3D feel.
 */
export function ProcessChapter({ process }: { process?: ProcessSection }) {
  const steps = process?.steps ?? [];
  return (
    <div id="process" className="relative">
      {steps.map((step, i) => (
        <ProcessStep key={step.title} index={i} total={steps.length} step={step} />
      ))}
    </div>
  );
}

function ProcessStep({ index, total, step }: { index: number; total: number; step: { title: string; body: string } }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // 3D depth: ghost numeral slides + fades, art line draws as you scroll.
  const ghostX = useTransform(scrollYProgress, [0, 1], ['6%', '-8%']);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.14, 0.05]);
  const line = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);
  const counter = String(index + 1).padStart(2, '0');

  return (
    <section ref={ref} className="depth-dark relative flex min-h-[100svh] items-center overflow-hidden text-[#eceeee]">
      {/* ghost numeral — parallax layer */}
      <motion.span
        aria-hidden
        style={{ x: ghostX, opacity: ghostOpacity }}
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[42vh] font-bold leading-none text-[#eceeee]"
      >
        {counter}
      </motion.span>

      {/* ember progress line */}
      <motion.div aria-hidden style={{ scaleX: line, originX: 0 }} className="absolute left-0 top-0 h-[2px] w-full bg-ember/80" />

      <div className="relative mx-auto grid w-full max-w-[1320px] gap-12 px-6 py-24 md:grid-cols-[1.2fr_1fr] md:px-10">
        <div>
          <p className="mono-label text-[#eceeee]/55">{index === 0 ? 'HOW WE WORK' : '\u00A0'}</p>
          <p className="mono-label mt-1 text-ember">{counter} / {String(total).padStart(2, '0')}</p>

          <Reveal>
            <h2 className="display mt-4 text-[clamp(3rem,8vw,6rem)] text-[#eceeee]">{step.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="prose-serif mt-6 max-w-md text-[#eceeee]/75">{step.body}</p>
          </Reveal>
        </div>

        <div className="hidden flex-col justify-center gap-3 md:flex" aria-hidden>
          {Array.from({ length: total }).map((_, j) => (
            <div key={j} className={`h-px w-full transition-all duration-500 ${j <= index ? 'bg-ember/70' : 'bg-[#eceeee]/15'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
