'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Band, BandHead } from '@/components/layout/band';
import { NodeIn } from '@/lib/motion/reveal';
import type { ProcessSection, ProcessStep } from '@/lib/content/types';

/**
 * Process — the route, walked one node at a time.
 *
 * The engagement is five stages, and the section draws them as five nodes on
 * one routed line: a square pad on the rail per stage, its panel hanging off
 * to the right. The stage currently crossing the middle of the viewport is the
 * live one — its pad and its title take ember, which is the only state
 * feedback in the page's grammar. The masthead column stays put and reports
 * where the reader is on the route.
 *
 * No background net here: this section already draws a literal route with
 * literal pads on it, and a second network behind it would compete with the
 * one thing on this band that is carrying state.
 */
export function ProcessChapter({ process }: { process?: ProcessSection }) {
  const steps = process?.steps ?? [];
  const [active, setActive] = useState(0);
  const current = steps[active] ?? steps[0];

  return (
    <Band id="process" ground="field">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        {/* ---- the masthead column, reporting the live node ---------- */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <BandHead>{process?.eyebrow}</BandHead>
          <h2 className="display mt-9 text-[clamp(2.6rem,7vw,5.4rem)] text-primary-50">
            {process?.chapterTitle ?? 'Process'}
          </h2>

          <div aria-live="polite" className="mt-10 border-t border-primary-50/14 pt-6">
            <p className="label">{current?.depth}</p>
            <p className="verb mt-3 text-[clamp(1.7rem,3.2vw,2.5rem)] text-primary-50">
              {current?.title}
            </p>
          </div>

          {/* how far down the route the reader is */}
          <div className="mt-8 flex items-center gap-2" aria-hidden>
            {steps.map((step, i) => (
              <span
                key={step.title}
                className={`h-2.5 w-8 transition-colors duration-300 ${
                  i === active
                    ? 'bg-accent-500'
                    : i < active
                      ? 'bg-primary-100/55'
                      : 'bg-primary-50/18'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ---- the route -------------------------------------------- */}
        <ol className="relative">
          <span aria-hidden className="absolute bottom-8 left-[5px] top-8 w-px bg-primary-50/14" />
          {steps.map((step, i) => (
            <RouteNode
              key={step.title}
              step={step}
              index={i}
              total={steps.length}
              active={i === active}
              onActive={setActive}
            />
          ))}
        </ol>
      </div>
    </Band>
  );
}

function RouteNode({
  step,
  index,
  total,
  active,
  onActive,
}: {
  step: ProcessStep;
  index: number;
  total: number;
  active: boolean;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Only the node crossing the middle of the viewport claims the masthead.
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="relative pb-8 pl-8 last:pb-0">
      {/* the pad on the rail */}
      <span
        aria-hidden
        className={`absolute left-0 top-8 z-10 h-[11px] w-[11px] transition-colors duration-300 ${
          active ? 'bg-accent-500' : 'bg-primary-800 ring-1 ring-primary-50/30'
        }`}
      />
      <NodeIn delay={index * 0.05}>
        <article
          className={`panel p-7 transition-colors duration-500 md:p-9 ${
            active ? 'bg-primary-500' : ''
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center text-[13px] font-medium transition-colors duration-300 ${
                active ? 'bg-accent-600 text-white' : 'bg-primary-900 text-primary-100'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="label">{step.depth ?? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}</span>
          </div>

          <h3
            className={`verb mt-7 text-[clamp(1.5rem,2.8vw,2.1rem)] transition-colors duration-300 ${
              active ? 'text-accent-400' : 'text-primary-50'
            }`}
          >
            {step.title}
          </h3>
          <p className="body body--sm mt-4 max-w-[56ch]">{step.body}</p>
        </article>
      </NodeIn>
    </li>
  );
}