'use client';

import { useState } from 'react';

import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, FaqSection } from '@/lib/content/types';

/**
 * Faq — plain questions with disclosure answers.
 *
 * Client component: disclosure state needs `useState`. Native buttons +
 * `aria-expanded`; motion stays on `GsapReveal` entrances only.
 */
export function Faq({ data, classes, className, id }: DataProps<FaqSection, 'list'>) {
  const items = data?.items ?? [];
  const [open, setOpen] = useState<number | null>(0);
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
          <ol
            className={['mt-12 divide-y divide-ink-950/10 border-y border-ink-950/10', classes?.list, className]
              .filter(Boolean)
              .join(' ')}
          >
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={`${item.question}-${i}`} data-rise={Math.min(i + 1, 3)}>
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
        </GsapReveal>
      </div>
    </section>
  );
}
