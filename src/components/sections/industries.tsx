'use client';

import { useState } from 'react';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { PixelMark } from '@/components/graphics/pixel-mark';
import { Reveal } from '@/lib/motion/reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector index as Otto's "integrations" network.
 *
 * Copy on the left (mono eyebrow, display statement, body, the hint as a
 * text-link), the network plate on the right: ink rings, an ember core tile
 * carrying the pixel mark, and every sector orbiting it as a small keyed
 * tile. Hovering or focusing a tile lifts it, warms it to ember and names
 * the sector in the caption line — the connection is made by touching it.
 * Paper band, plate one tone up. Content shape unchanged: the same index
 * of sector names.
 */
export function Industries({ industries }: { industries?: IndustriesSection }) {
  const items = industries?.items ?? [];
  const [active, setActive] = useState<string | null>(null);

  return (
    <Band id="industries" ground="paper">
      <div className="grid items-center gap-x-14 gap-y-12 lg:grid-cols-2">
        {/* ---- the copy ------------------------------------------ */}
        <div>
          <p className="label text-ink-500">{industries?.eyebrow}</p>
          <InViewTitle
            text={(industries?.headline ?? '').replace(/\n/g, ' ')}
            variant="blur"
            as="h2"
            className="title mt-6 max-w-[12ch] text-[clamp(2.1rem,4.4vw,3.2rem)] text-ink-950"
          />
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-[38ch] text-[13px] leading-[1.85] text-ink-500">{industries?.body}</p>
          </Reveal>
          {industries?.hint ? (
            <Reveal delay={0.22}>
              <p className="group mt-7 inline-flex cursor-default items-center gap-3 text-[13.5px] font-semibold text-ink-900">
                {industries.hint}
                <span className="text-accent-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <MdiIcon name="arrowTopRight" size={0.85} />
                </span>
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* ---- the network ---------------------------------------- */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-[540px] bg-paper-200">
            {/* rings */}
            <span aria-hidden className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-950/10" />
            <span aria-hidden className="absolute left-1/2 top-1/2 h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-950/[0.14]" />
            <span aria-hidden className="absolute left-1/2 top-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-950/10" />

            {/* the core */}
            <div className="absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] place-items-center bg-accent-500 text-paper-50 md:h-24 md:w-24">
              <PixelMark className="h-7 w-10" />
            </div>

            {/* the sectors, keyed tiles on the outer ring */}
            {items.map((item, i) => {
              const angle = (i / Math.max(items.length, 1)) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + 44 * Math.cos(angle);
              const y = 50 + 44 * Math.sin(angle);
              const live = active === item;
              return (
                <span
                  key={item}
                  className="absolute z-20"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <button
                    type="button"
                    aria-pressed={live}
                    onMouseEnter={() => setActive(item)}
                    onFocus={() => setActive(item)}
                    onMouseLeave={() => setActive(null)}
                    onBlur={() => setActive(null)}
                    className={`whitespace-nowrap border px-2.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] transition-all duration-300 md:px-3 md:py-2 md:text-[10px] ${
                      live
                        ? '-translate-y-1 rotate-[-4deg] border-accent-500 bg-accent-500 text-paper-50'
                        : 'border-ink-950/15 bg-paper-50 text-ink-700 hover:border-accent-600/50'
                    }`}
                  >
                    {item}
                  </button>
                </span>
              );
            })}

            {/* the caption — names the connection being made */}
            <p className="label label--plain absolute bottom-4 left-1/2 z-10 w-max -translate-x-1/2 text-center text-ink-500">
              {active ?? industries?.hint ?? industries?.eyebrow}
            </p>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}
