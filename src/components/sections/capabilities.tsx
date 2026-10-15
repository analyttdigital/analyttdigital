'use client';

import { useMemo, useState } from 'react';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { CapabilityReadout } from '@/components/sections/capability-readout';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — the engagement register as bak service cards.
 *
 * Follows `html.bak/analytt-services-section.html`: white cards with an
 * ember number + tag head, display title and body, the figure in a well,
 * and a sliding-pill reading-order toggle. Token map bak→site: white →
 * `bg-white`, mist wells → dark `bg-ink-950` (the shared `CapabilityReadout`
 * keeps its dark-plate styling, so a light well would wash it out), ember
 * → `accent-500/600`, primary/ink → same names.
 *
 * The order control re-reads the same cards as the engagement, where
 * measurement comes first; numbering stays positional in both modes (no
 * per-card phase field exists in the content model). Content, figures and
 * labels arrive from the content layer; only geometry lives here.
 */

type Row = { item: CapabilitiesSection['items'][number]; i: number };

export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const [order, setOrder] = useState<'services' | 'sequence'>('services');
  const items = capabilities?.items ?? [];

  const rows: Row[] = useMemo(() => {
    const list = items.map((item, i) => ({ item, i }));
    if (order !== 'sequence') return list;
    return [...list].sort(
      (a, b) => (a.item.depth ?? '').localeCompare(b.item.depth ?? '') || a.i - b.i,
    );
  }, [items, order]);

  return (
    <Band id="capabilities" ground="paper">
      <GsapReveal>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div data-rise>
            <p className="mb-5 flex items-center gap-2 text-[.78rem] font-medium text-primary-800">
              <i aria-hidden className="h-1.5 w-1.5 bg-accent-500" />
              {capabilities?.eyebrow ?? 'Our services'}
            </p>
            <InViewTitle
              text={(capabilities?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title max-w-[12em] font-display text-[clamp(2.4rem,5.2vw,4.4rem)] font-bold leading-[1.02] tracking-[-.035em] text-ink-950"
            />
          </div>

          <div data-rise="1" className="flex flex-col gap-5 lg:items-end">
            <p className="max-w-[22em] text-sm leading-relaxed text-ink-500 lg:text-right">
              {capabilities?.lede}
            </p>

            {items.length > 1 ? (
              <div className="flex items-center gap-3">
                <span className="whitespace-nowrap text-[.72rem] text-primary-800/70">
                  {capabilities?.orderLabel}
                </span>
                <div
                  role="tablist"
                  aria-label={capabilities?.orderLabel}
                  className="relative flex rounded-full bg-primary-100 p-1"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent-500 shadow-[0_6px_16px_-6px_rgb(var(--color-accent-500)/0.7)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
                      order === 'sequence' ? 'translate-x-full' : ''
                    }`}
                  />
                  {(
                    [
                      { value: 'services', label: capabilities?.orderServices },
                      { value: 'sequence', label: capabilities?.orderSequence },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.value}
                      role="tab"
                      type="button"
                      aria-selected={order === tab.value}
                      onClick={() => setOrder(tab.value)}
                      className={`relative z-10 flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.12em] transition-colors ${
                        order === tab.value ? 'text-paper-50' : 'text-primary-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16">
          {rows.map(({ item, i }) => (
            <li key={`${order}-${item.title}`} data-rise={Math.min(i + 1, 3)}>
              <article className="group relative h-full overflow-hidden rounded-[26px] border border-primary-800/15 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-accent-500/40 hover:shadow-[0_28px_56px_-32px_rgb(var(--color-primary-800)/0.55)] sm:p-9">
                {/* Positional watermark — one faint glyph per card. */}
                <MdiIcon
                  name={item.icon || capabilityIcons[i % capabilityIcons.length]}
                  size={10}
                  className="pointer-events-none absolute -bottom-6 -right-6 select-none text-primary-800/[0.06] transition duration-500 group-hover:-rotate-6 group-hover:scale-110"
                />
                <div className="flex items-center justify-between text-[11px] font-medium text-primary-800">
                  <span className="flex items-center gap-2">
                    <b className="text-accent-600">{String(i + 1).padStart(2, '0')}</b>
                    <i aria-hidden className="h-1 w-1 rounded-full bg-primary-800/40" />
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-6 max-w-[11em] font-display text-[1.7rem] font-bold leading-[1.1] tracking-[-.02em] text-ink-950 sm:text-[2rem]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[30em] text-sm leading-relaxed text-ink-500">
                  {item.body}
                </p>

                <div className="relative mt-7 rounded-2xl bg-ink-950 p-4 sm:p-5">
                  <CapabilityReadout readout={item.readout} />
                </div>
              </article>
            </li>
          ))}
        </ol>

        {capabilities?.illustrativeNote ? (
          <p
            data-rise="1"
            className="label label--plain mt-10 max-w-[70ch] leading-[1.9] text-ink-500"
          >
            {capabilities.illustrativeNote}
          </p>
        ) : null}
      </GsapReveal>
    </Band>
  );
}
