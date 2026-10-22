'use client';

import { useState } from 'react';

import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, FaqSection } from '@/lib/content/types';

/**
 * FaqAlt — questions as disclosure cards beside a sticky head.
 *
 * Where `Faq` runs one full-width divided list, the alt docks the head in
 * a sticky left column and stacks the same questions as rounded cards on
 * the right. Client component like its base: disclosure state needs
 * `useState`. Same fields, no new copy.
 */
export function FaqAlt({ data, classes, className, id }: DataProps<FaqSection, 'list'>) {
  const items = data?.items ?? [];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div data-rise>
                <p className="label text-ink-500">{data?.eyebrow}</p>
                <InViewTitle
                  text={(data?.headline ?? '').replace(/\n/g, ' ')}
                  variant="blur"
                  as="h2"
                  className="title mt-7 max-w-[14ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
                />
              </div>
              {data?.body ? (
                <p data-rise="1" className="mt-6 max-w-[44ch] text-sm leading-[1.85] text-ink-500">
                  {data.body}
                </p>
              ) : null}
            </div>
            <ol
              className={['grid content-start gap-4', classes?.list, className]
                .filter(Boolean)
                .join(' ')}
            >
              {items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <li
                    key={`${item.question}-${i}`}
                    data-rise={Math.min(i + 1, 3)}
                    className={`rounded-3xl px-6 transition-colors duration-200 ${isOpen ? 'bg-paper-50 ring-1 ring-ink-950/10' : 'bg-paper-50/60 ring-1 ring-ink-950/[0.06]'}`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 text-left"
                    >
                      <span className={`text-[15px] font-medium tracking-tight ${isOpen ? 'text-ink-950' : 'text-ink-700'}`}>
                        {item.question}
                      </span>
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 ${isOpen ? 'bg-ink-950 text-paper-50' : 'bg-ink-950/5 text-ink-700'}`}
                      >
                        <MdiIcon name={isOpen ? 'close' : 'chevronDown'} size={0.8} />
                      </span>
                    </button>
                    {isOpen ? (
                      <p className="max-w-[64ch] pb-6 text-sm leading-[1.85] text-ink-500">{item.answer}</p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
