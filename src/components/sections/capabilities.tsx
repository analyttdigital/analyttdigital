'use client';

import { useMemo, useState } from 'react';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { CapabilityReadout } from '@/components/sections/capability-readout';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — the engagement register.
 *
 * The four services are not four cards. Each is a deep-field plate on
 * the warm paper ground (odd plates take the near-black alternate ground),
 * and the figure that proves what the service produces is read out *on* the plate, in light, with one ember series:
 * spend against attributed return, the unknown share of spend collapsing,
 * cost per lead on a target, organic sessions building. A hairline rail
 * routes down the paper gutter with a square node per plate; the hovered
 * plate wakes a step lighter and lights its own segment of the rail.
 *
 * The order control re-reads the same plates as the engagement, where
 * measurement comes first — the positioning stated as structure: if it
 * cannot be measured, it is not launched. Content, figures and labels
 * arrive from the content layer; only geometry lives here.
 */

type Row = { item: CapabilitiesSection['items'][number]; i: number };

export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const [order, setOrder] = useState<'services' | 'sequence'>('services');
  const [moved, setMoved] = useState(false);
  const items = capabilities?.items ?? [];

  const rows: Row[] = useMemo(() => {
    const list = items.map((item, i) => ({ item, i }));
    if (order !== 'sequence') return list;
    return [...list].sort(
      (a, b) => (a.item.depth ?? '').localeCompare(b.item.depth ?? '') || a.i - b.i,
    );
  }, [items, order]);

  const switchOrder = (next: 'services' | 'sequence') => {
    setOrder(next);
    setMoved(true);
  };

  return (
    <Band
      id="capabilities"
      ground="paper"
      // resolve={{ from: '--color-paper-DEFAULT', to: '--color-paper-100', height: 236, cell: 21 }}
    >
      <GsapReveal>
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-10">
          <div data-rise>
            <p className="label text-ink-500">{capabilities?.eyebrow ?? 'Our services'}</p>
            <InViewTitle
              text={(capabilities?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-7 max-w-[17ch] text-[clamp(2.4rem,5.4vw,3.7rem)] text-ink-950"
            />
          </div>

          <div data-rise="1" className="w-full max-w-[44ch]">
            <p className="text-[13.5px] leading-[1.85] text-ink-500">{capabilities?.lede}</p>

            {items.length > 1 ? (
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="label label--plain text-ink-500">{capabilities?.orderLabel}</span>
                <div role="group" aria-label={capabilities?.orderLabel} className="cap-order">
                  <button
                    type="button"
                    className="cap-order__btn"
                    aria-pressed={order === 'services'}
                    onClick={() => switchOrder('services')}
                  >
                    {capabilities?.orderServices}
                  </button>
                  <button
                    type="button"
                    className="cap-order__btn"
                    aria-pressed={order === 'sequence'}
                    onClick={() => switchOrder('sequence')}
                  >
                    {capabilities?.orderSequence}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <ol className="relative mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2 lg:pl-[4.5rem]">
          

          {rows.map(({ item, i }, row) => (
            <li
              key={`${order}-${item.title}`}
              style={moved ? { animationDelay: `${row * 45}ms` } : undefined}
              className={`cap-row group relative ${moved ? 'cap-swap' : ''}`}
            >
              

              <div
                className={`cap-plate flex h-full flex-col gap-9 p-7 md:p-8 lg:p-9 ${
                  i % 2 === 1 ? 'cap-plate--ink' : ''
                }`}
              >
                {/* Positional watermark — one faint glyph per plate, the way
                    the process chapter marks its positions. */}
                <MdiIcon
                  name={item.icon || capabilityIcons[i % capabilityIcons.length]}
                  size={10}
                  className="pointer-events-none absolute -bottom-5 -right-3 select-none text-primary-50/[0.05]"
                />

                <div data-rise={row + 1}>
                  <p className="flex items-center gap-3 font-mono text-[9.5px] font-medium capitalize tracking-[0.16em] text-primary-300">
                    <span className="num text-accent-300">
                      {(order === 'sequence' ? item.depth : '') || String(i + 1).padStart(2, '0')}
                    </span>
                    <span aria-hidden className="h-1 w-1 bg-primary-50/30" />
                    {item.tag}
                  </p>
                  <h3 className="verb mt-6 max-w-[20ch] text-[clamp(1.5rem,2.6vw,2.15rem)] text-primary-50">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-[54ch] text-[13.5px] leading-[1.8] text-primary-200">
                    {item.body}
                  </p>
                </div>

                <div data-rise={row + 1} className="mt-auto max-w-[28rem]">
                  <CapabilityReadout readout={item.readout} />
                </div>
              </div>
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
