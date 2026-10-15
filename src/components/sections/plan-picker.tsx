'use client';

import { useState } from 'react';

import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, PlanPickerSection } from '@/lib/content/types';

/**
 * PlanPicker — the "which plan" chooser as radio cards.
 *
 * Client component: selection state needs `useState`. The ask links to
 * the audit CTA with the chosen plan as a query hint (`?plan=<value>`);
 * no backend, so the choice only pre-labels the conversation.
 */
export function PlanPicker({ data, classes, className, id }: DataProps<PlanPickerSection, 'grid'>) {
  const options = data?.options ?? [];
  const [selected, setSelected] = useState<string>(options[0]?.value ?? '');
  const href = selected ? `${data?.ctaHref ?? '/digital-audit/'}?plan=${encodeURIComponent(selected)}` : data?.ctaHref;
  return (
    <section id={id} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
              />
            </div>
            {data?.body ? (
              <p data-rise="1" className="max-w-[52ch] text-sm leading-[1.85] text-ink-500">
                {data.body}
              </p>
            ) : null}
          </div>
          <div
            role="radiogroup"
            aria-label={data?.headline}
            data-rise="2"
            className={['mt-12 grid gap-4 sm:grid-cols-2', classes?.grid, className]
              .filter(Boolean)
              .join(' ')}
          >
            {options.map((option) => {
              const active = selected === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelected(option.value)}
                  className={[
                    'rounded-3xl p-6 text-left ring-1 transition-colors duration-200',
                    active ? 'bg-ink-950 text-paper-50 ring-paper-50/10' : 'bg-paper-50 text-ink-950 ring-ink-950/10 hover:ring-ink-950/25',
                  ].join(' ')}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="verb text-[clamp(1.1rem,1.8vw,1.35rem)]">{option.label}</span>
                    <span
                      aria-hidden
                      className={`grid h-6 w-6 place-items-center rounded-full ${active ? 'bg-accent-500 text-paper-50' : 'bg-ink-950/10 text-ink-500'}`}
                    >
                      {active ? <MdiIcon name="check" size={0.6} /> : null}
                    </span>
                  </span>
                  {option.hint ? (
                    <span className={`mt-2 block text-[13px] leading-[1.75] ${active ? 'text-primary-200' : 'text-ink-500'}`}>
                      {option.hint}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div data-rise="2" className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={href || '#'}
              className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
            >
              {data?.cta}
              <MdiIcon name="arrowRight" size={0.8} />
            </a>
            {data?.note ? (
              <p className="font-mono text-[10px] capitalize  text-ink-400">
                {data.note}
              </p>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
