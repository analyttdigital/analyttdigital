'use client';

import { useState } from 'react';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { Reveal } from '@/lib/motion/reveal';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — the services as Otto's "possibilities" split.
 *
 * A section head (statement left, mono eyebrow right) over a two-column
 * feature grid: a scene plate on the left that swaps with the hovered
 * service — ghost icon at plate scale, title, tag plate — and the ruled
 * feature list on the right, one row per service with lot number, summary,
 * meta line and an arrow that only appears on the live row. Rows are
 * buttons: hover, focus or tap drives the scene, so the catalogue is read
 * by touching it. Field ground, paper type, ember reserved for the active
 * row. Content shape unchanged: tag / depth / title / body / icon per item.
 */

export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];
  const [active, setActive] = useState(0);
  const current = items[Math.min(active, items.length - 1)];
  const currentIcon = current?.icon || capabilityIcons[active % capabilityIcons.length];

  return (
    <Band id="capabilities" ground="field">
      {/* section head — statement left, eyebrow right */}
      <div className="flex items-start justify-between gap-8">
        <InViewTitle
          text={(capabilities?.headline ?? '').replace(/\n/g, ' ')}
          variant="blur"
          as="h2"
          className="title max-w-[16ch] text-[clamp(2rem,4vw,2.6rem)] text-paper"
        />
        <p className="label hidden max-w-[220px] pt-2 text-right text-paper/60 sm:block">
          {capabilities?.eyebrow ?? 'Our services'}
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_1fr]">
        {/* the scene — swaps with the live row */}
        <Reveal className="h-full">
          <div className="group relative flex h-full min-h-[380px] flex-col justify-between overflow-hidden bg-primary-800 p-8 md:min-h-[460px] md:p-10">
            {current ? (
              <MdiIcon
                key={`ghost-${current.title}`}
                name={currentIcon}
                size={15}
                className="pointer-events-none absolute -bottom-10 -right-10 rotate-[-12deg] text-paper-50/5 transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.04]"
              />
            ) : null}
            <p className="label relative text-paper/50">{current?.tag}</p>
            <div>
              {current ? (
                <h3
                  key={current.title}
                  className="verb relative max-w-[14ch] text-[clamp(1.8rem,3vw,2.6rem)] text-paper"
                  style={{ animation: 'fade .5s ease both, rise .6s var(--ease-enter) both' }}
                >
                  {current.title}
                </h3>
              ) : null}
              <span className="relative mt-8 inline-flex items-center gap-2 bg-paper-50 px-3.5 py-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-primary-900">
                <span aria-hidden className="h-1.5 w-1.5 bg-accent-500" />
                {current?.depth ?? `Grade ${String(active + 1).padStart(2, '0')}`}
              </span>
            </div>
          </div>
        </Reveal>

        {/* the list — one ruled row per service */}
        <ol className="grid content-start border-t border-paper-50/15">
          {items.map((item, i) => {
            const live = i === active;
            return (
              <li key={item.title} className="border-b border-paper-50/15">
                <button
                  type="button"
                  aria-pressed={live}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`grid w-full grid-cols-[2.6rem_minmax(0,1fr)_1.5rem] items-start gap-4 py-6 pl-1 pr-2 text-left transition-all duration-300 hover:pl-4 ${
                    live ? 'bg-primary-800 pl-4' : ''
                  }`}
                >
                  <span
                    className={`pt-1.5 font-mono text-[10.5px] tracking-[0.14em] ${
                      live ? 'text-accent-400' : 'text-paper/40'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')} /
                  </span>
                  <span>
                    <span className={`block text-[clamp(1.15rem,1.8vw,1.5rem)] font-medium tracking-tight ${live ? 'text-paper' : 'text-paper/80'}`}>
                      {item.title}
                    </span>
                    <span className="mt-2 block max-w-[46ch] text-[12.5px] leading-[1.75] text-paper/55">
                      {item.body}
                    </span>
                    <span className="mt-4 block font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">
                      {item.tag}
                      {item.depth ? ` · ${item.depth}` : ''}
                    </span>
                  </span>
                  <span
                    className={`pt-1 transition-all duration-300 ${
                      live ? 'translate-x-0 text-accent-400 opacity-100' : '-translate-x-1 text-paper/40 opacity-0'
                    }`}
                  >
                    <MdiIcon name="arrowTopRight" size={0.9} />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </Band>
  );
}
