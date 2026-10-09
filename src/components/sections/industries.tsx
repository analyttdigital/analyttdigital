'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector index beside a draggable sector globe.
 *
 * A three.js wireframe sphere with an ember node ring idles on a soft paper
 * plate; press and pull to spin it, and it keeps the momentum you give it.
 * The index itself stays honest DOM: rounded chips you can touch, warming
 * to ember on hover. The globe is ambient and client-only — under reduced
 * motion (or before it loads) the plate holds a static gradient instead.
 * Content shape unchanged: the same list of sector names.
 */

const NodeSphere = dynamic(() => import('@/components/graphics/node-sphere'), { ssr: false });

export function Industries({ industries }: { industries?: IndustriesSection }) {
  const items = industries?.items ?? [];
  const reduce = useReducedMotion();

  return (
    <Band id="industries" ground="paper">
      <GsapReveal>
        <div className="grid items-center gap-x-14 gap-y-12 lg:grid-cols-2">
          {/* ---- the copy + the index ------------------------------ */}
          <div>
            <p data-rise className="label text-ink-500">{industries?.eyebrow}</p>
            <InViewTitle
              text={(industries?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-6 max-w-[12ch] text-[clamp(2.1rem,4.4vw,3.2rem)] text-ink-950"
            />
            <p data-rise="1" className="mt-6 max-w-[38ch] text-[13px] leading-[1.85] text-ink-500">
              {industries?.body}
            </p>
            {industries?.hint ? (
              <p data-rise="2" className="group mt-6 inline-flex cursor-default items-center gap-3 text-[13.5px] font-semibold text-ink-900">
                {industries.hint}
                <span className="text-accent-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <MdiIcon name="arrowTopRight" size={0.85} />
                </span>
              </p>
            ) : null}
            <ul data-rise="3" className="mt-8 flex flex-wrap gap-2.5">
              {items.map((item, i) => (
                <li key={item}>
                  <span className="inline-flex cursor-default items-center gap-2.5 rounded-full border border-ink-950/15 bg-paper-50 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-ink-700 shadow-[0_8px_20px_-12px_rgb(var(--color-primary-600)/0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-600/60 hover:text-accent-600">
                    <span className="text-ink-400">{String(i + 1).padStart(2, '0')}</span>
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- the globe ------------------------------------------ */}
          <div data-rise="2" data-drift="30">
            <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[2.5rem] border border-ink-950/[0.07] bg-gradient-to-br from-paper-50 to-paper-200 shadow-[0_34px_80px_-36px_rgb(var(--color-primary-600)/0.35)]">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgb(var(--color-accent-500)/0.08),transparent_70%)]"
              />
              {reduce ? (
                <div aria-hidden className="absolute inset-0 grid place-items-center">
                  <span className="h-40 w-40 rounded-full border border-ink-950/10 bg-[radial-gradient(circle,rgb(var(--color-primary-500)/0.12),transparent_70%)]" />
                </div>
              ) : (
                <NodeSphere className="absolute inset-0" />
              )}
              <p className="label label--plain absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-ink-400">
                Drag to spin
              </p>
            </div>
          </div>
        </div>
      </GsapReveal>
    </Band>
  );
}
