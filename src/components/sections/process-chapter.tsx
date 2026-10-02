'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { SheetBlock } from '@/components/layout/sheet-block';
import { RowPress } from '@/lib/motion/reveal';
import type { ProcessSection, ProcessStep } from '@/lib/content/types';

/**
 * Process — the fixture list.
 *
 * The engagement is a five-match fixture, and the page prints it as one: the
 * date/venue slot from the content sits in its own column, the verb is set
 * large, and the masthead column stays pinned while the reader works down
 * the list, reporting the fixture currently in play. The active fixture
 * debosses its slot into the stock rather than merely changing colour — the
 * press-mark this world uses for every selected state.
 */
export function ProcessChapter({ process }: { process?: ProcessSection }) {
  const steps = process?.steps ?? [];
  const [active, setActive] = useState(0);
  const current = steps[active] ?? steps[0];

  return (
    <SheetBlock id="process" folio="04" head={process?.eyebrow} tone="b">
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* ---- pinned masthead column ------------------------------ */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="masthead text-[clamp(2.4rem,5.4vw,4.2rem)] text-ink-950">
            {process?.chapterTitle ?? 'Process'}
          </h2>

          <div aria-hidden className="mt-8 h-0.5 w-full bg-ink-950/85" />

          <div className="mt-9" aria-live="polite">
            <p className="folio w-narrow">{current?.depth}</p>
            <p className="sheet-verb mt-2 text-[clamp(1.8rem,3.4vw,2.7rem)] text-ink-950">
              {current?.title}
            </p>
          </div>

          {/* fixture ticks: how far down the list the reader is */}
          <div className="mt-8 flex items-end gap-1.5" aria-hidden>
            {steps.map((step, i) => (
              <span
                key={step.title}
                className={`h-2.5 w-9 transition-colors duration-300 ${
                  i === active ? 'bg-accent-500' : i < active ? 'bg-ink-950/55' : 'bg-ink-950/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ---- the fixture list ------------------------------------- */}
        <ol className="border-t border-ink-950/20">
          {steps.map((step, i) => (
            <FixtureRow
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
    </SheetBlock>
  );
}

function FixtureRow({
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
  // Only the row crossing the middle of the viewport claims the masthead.
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="border-b border-ink-950/20">
      <RowPress delay={index * 0.06}>
        <article
          className={`grid gap-x-8 gap-y-4 py-9 transition-colors duration-500 lg:grid-cols-[10.5rem_minmax(0,1fr)] ${
            active ? 'bg-paper/80' : ''
          }`}
        >
          {/* the fixture slot — date and venue, debossed when in play */}
          <div className="flex items-start">
            <span
              className={`inline-flex w-full max-w-[9.5rem] items-center justify-center rounded-[2px] px-2.5 py-1.5 text-center text-[10.5px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                active ? 'press-mark text-accent-700' : 'bg-ink-950/[0.05] text-ink-600'
              }`}
            >
              {step.depth ?? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
            </span>
          </div>

          <div>
            <h3
              className={`sheet-verb text-[clamp(1.55rem,3vw,2.3rem)] transition-colors duration-300 ${
                active ? 'text-accent-600' : 'text-ink-950'
              }`}
            >
              {step.title}
            </h3>
            <p className="body-copy mt-4 max-w-[58ch]">{step.body}</p>
          </div>
        </article>
      </RowPress>
    </li>
  );
}
