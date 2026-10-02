import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { MdiIcon } from '@/lib/icons/resolve-icon';
import { EASE_OUT } from '@/lib/motion/reveal';
import type { ProcessSection, ProcessStep as Step } from '@/lib/content/types';

/**
 * Process — screenshot 5 language: light stage, concentric aurora rings,
 * floating phone-mockup card with orbiting pill callouts. Each step is a
 * full-height chapter; the phone card persists while callouts swap.
 */
export function ProcessChapter({ process }: { process?: ProcessSection }) {
  const steps = process?.steps ?? [];
  return (
    <div id="process" data-scene="process" data-snap className="relative">
      {steps.map((step, i) => (
        <ProcessStep key={step.title} index={i} total={steps.length} step={step} stepCount={steps.length} eyebrow={process?.eyebrow} />
      ))}
    </div>
  );
}

function ProcessStep({
  index,
  total,
  step,
  eyebrow,
}: {
  index: number;
  total: number;
  step: Step;
  stepCount?: number;
  eyebrow?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Phone card rises and slightly rotates per chapter.
  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [4, -4]);
  // Callouts drift outward as chapter progresses.
  const calloutAx = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const calloutBx = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const counter = String(index + 1).padStart(2, '0');
  const callouts = [
    step.depth ?? `Step ${counter}`,
    index === 0 ? (eyebrow ?? 'How we work') : `Phase ${counter}`,
    index === total - 1 ? 'Scale with confidence' : 'Tracked weekly',
  ];

  return (
    <section
      data-snap
      ref={ref}
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage relative mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-[1320px] items-center overflow-hidden px-6 py-16 md:px-14 md:py-20">
        {/* concentric rings */}
        <div aria-hidden className="aurora pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-60" />

        {/* floating phone card */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { y: phoneY, rotate: phoneRotate }}
          className="absolute bottom-10 left-1/2 z-0 w-64 -translate-x-1/2 md:w-72"
        >
          <div className="card-float overflow-hidden rounded-[2rem] p-2">
            <div className="rounded-[1.6rem] bg-gradient-to-b from-accent-100 via-paper to-accent-50 p-4 pb-10">
              <div className="mx-auto mb-3 h-1.5 w-14 rounded-pill bg-ink-950/80" />
              <div className="rounded-2xl bg-paper p-3 shadow-button-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-ink-950">{counter} / {String(total).padStart(2, '0')}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-paper">
                    {index + 1}
                  </span>
                </div>
                <div className="mt-2.5 space-y-1.5">
                  <div className="h-1.5 w-3/4 rounded-pill bg-mist-300" />
                  <div className="h-1.5 w-1/2 rounded-pill bg-mist-200" />
                  <div className="h-1.5 w-2/3 rounded-pill bg-accent-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* orbiting callouts */}
        {!reduce ? (
          <>
            <motion.span style={{ x: calloutAx }} className="callout absolute left-[8%] top-[22%] z-10 hidden md:inline-flex">
              <span className="h-4 w-4 rounded-full border border-dashed border-ink-400" />
              {callouts[0]}
            </motion.span>
            <motion.span style={{ x: calloutBx }} className="callout absolute bottom-[20%] right-[8%] z-10 hidden md:inline-flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-paper">
                <MdiIcon name="rocket" size={0.6} />
              </span>
              {callouts[2]}
            </motion.span>
          </>
        ) : null}

        {/* content */}
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="text-[15px] text-ink-700"
          >
            {index === 0 ? (eyebrow ?? 'How we work') : `Step ${counter}`}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 44, scale: 0.97, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.85, ease: EASE_OUT }}
            className="display mt-4 text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.05] text-ink-950"
          >
            {step.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.12 }}
            className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-ink-700"
          >
            {step.body}
          </motion.p>

          {/* step progress */}
          <div className="mt-10 flex items-center justify-center gap-2" aria-hidden>
            {Array.from({ length: total }).map((_, j) => (
              <span
                key={j}
                className={`h-1.5 rounded-pill transition-all duration-500 ${j === index ? 'w-8 bg-ink-950' : 'w-1.5 bg-ink-950/20'}`}
              />
            ))}
          </div>

          {step.depth ? (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 rounded-pill bg-accent-50 px-4 py-2 text-[12px] font-semibold text-accent-600"
            >
              <MdiIcon name={index === total - 1 ? 'arrowTopRight' : 'arrowDown'} size={0.6} />
              {step.depth}
            </motion.p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
