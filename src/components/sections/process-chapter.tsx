import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { MdiIcon } from '@/components/motion/mdi-icon';
import { Reveal } from '@/lib/motion/reveal';
import { StackCard, StackDeck } from '@/lib/motion/scroll-3d';
import type { ProcessSection, ProcessStep as Step } from '@/lib/content/types';

/**
 * Process — dark ink chapters in a sticky stack. Flat bordered panels,
 * square counter, hairline progress rule. Motion stays; chrome is minimal.
 */
export function ProcessChapter({ process }: { process?: ProcessSection }) {
  const steps = process?.steps ?? [];
  return (
    <div id="process" data-scene="process" data-snap className="deck-3d relative bg-ink-950">
      <StackDeck>
        {steps.map((step, i) => (
          <ProcessStep key={step.title} index={i} total={steps.length} step={step} eyebrow={process?.eyebrow} />
        ))}
      </StackDeck>
    </div>
  );
}

function ProcessStep({ index, total, step, eyebrow }: { index: number; total: number; step: Step; eyebrow?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const ghostOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]);
  const line = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);
  const counter = String(index + 1).padStart(2, '0');

  return (
    <StackCard index={index} total={total} top={72 + Math.min(index, 3) * 14}>
      <section
        data-snap
        ref={ref}
        className="relative flex min-h-[100svh] items-center overflow-hidden border-t border-[#eceeee]/10 bg-ink-950 text-[#eceeee]"
      >
        {/* ghost numeral — flat, no glow */}
        <motion.span
          aria-hidden
          style={{ opacity: ghostOpacity }}
          className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[42vh] font-bold leading-none text-[#eceeee]"
        >
          {counter}
        </motion.span>

        {/* hairline progress rule */}
        <motion.div aria-hidden style={{ scaleX: line, originX: 0 }} className="absolute left-0 top-0 h-[2px] w-full bg-ember" />

        <div className="relative mx-auto grid w-full max-w-[1320px] gap-12 px-6 py-24 md:grid-cols-[1.25fr_1fr] md:px-10">
          <div className="border border-[#eceeee]/15 bg-white/[0.02] p-8 md:p-10">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center border border-ember/50 font-mono text-[12px] font-semibold text-ember">
                {counter}
              </span>
              <div>
                <p className="mono-label text-[#eceeee]/50">{index === 0 ? (eyebrow ?? 'How we work') : '\u00A0'}</p>
                {step.depth ? (
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-monoSm text-ember">
                    <MdiIcon name={index === total - 1 ? 'arrowTopRight' : 'arrowDown'} size={0.6} />
                    {step.depth}
                  </p>
                ) : null}
              </div>
            </div>

            <Reveal>
              <h2 className="display mt-8 text-[clamp(2.4rem,6vw,4.6rem)] text-[#eceeee]">{step.title}</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="prose-serif mt-6 max-w-md text-[#eceeee]/75">{step.body}</p>
            </Reveal>
          </div>

          {/* step ticks */}
          <div className="hidden flex-col justify-center gap-3 md:flex" aria-hidden>
            {Array.from({ length: total }).map((_, j) => (
              <div
                key={j}
                className={`h-px w-full transition-all duration-500 ${j <= index ? 'bg-ember' : 'bg-[#eceeee]/15'}`}
              />
            ))}
          </div>
        </div>
      </section>
    </StackCard>
  );
}
