'use client';

import { useState } from 'react';

import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, PlanPickerSection } from '@/lib/content/types';

/**
 * PlanPickerAlt — the "which plan" chooser as ruled option rows.
 *
 * Where `PlanPicker` sets radio cards in a grid, the alt lists the same
 * options as full-width ruled rows with a radio dot, label + hint inline,
 * and the audit ask pinned beneath. Client component like its base:
 * selection state needs `useState`, and the ask links with the chosen
 * plan as a query hint (`?plan=<value>`). Same fields, no new copy.
 */
export function PlanPickerAlt({ data, classes, className, id }: DataProps<PlanPickerSection, 'rows'>) {
  const options = data?.options ?? [];
  const [selected, setSelected] = useState<string>(options[0]?.value ?? '');
  const href = selected ? `${data?.ctaHref ?? '/digital-audit/'}?plan=${encodeURIComponent(selected)}` : data?.ctaHref;
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
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
          {options.length > 0 ? (
            <div
              role="radiogroup"
              aria-label={data?.headline}
              data-rise="2"
              className={['mt-12 border-t border-ink-950/10', classes?.rows, className]
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
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-ink-950/10 py-5 text-left sm:gap-6"
                  >
                    <span
                      aria-hidden
                      className={`grid h-6 w-6 place-items-center rounded-full ring-1 transition-colors duration-200 ${active ? 'bg-accent-500 text-paper-50 ring-accent-500' : 'bg-transparent text-transparent ring-ink-950/25'}`}
                    >
                      <MdiIcon name="check" size={0.6} />
                    </span>
                    <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                      <span className={`verb text-[clamp(1.1rem,1.8vw,1.35rem)] ${active ? 'text-ink-950' : 'text-ink-700'}`}>
                        {option.label}
                      </span>
                      {option.hint ? (
                        <span className="max-w-[52ch] text-[13px] leading-[1.75] text-ink-500">
                          {option.hint}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
          <div data-rise="2" className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={href || '#'}
              className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
            >
              {data?.cta}
              <MdiIcon name="arrowRight" size={0.8} />
            </a>
            {data?.note ? (
              <p className="font-mono text-[10px] capitalize text-ink-400">
                {data.note}
              </p>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
