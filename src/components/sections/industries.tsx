'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';

import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector work as a directory index beside the globe.
 *
 * The sectors read as a ruled directory: mono indices, large display names,
 * hairline rules, and rows that invert to ink on hover with the arrow
 * warming to ember. Beside it the draggable three.js sector globe idles on
 * a soft paper plate (press and pull to spin, momentum kept); under reduced
 * motion (or before it loads) the plate holds a static gradient instead.
 * Content shape unchanged: the same list of sector names.
 */

const NodeSphere = dynamic(() => import('@/components/graphics/node-sphere'), { ssr: false });

export function Industries({ data, classes, className, id }: DataProps<IndustriesSection, 'index' | 'globe'>) {
  const items = data?.items ?? [];
  const reduce = useReducedMotion();

  return (
    <section id={id ?? 'industries'} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          {/* ---- the head ------------------------------------------ */}
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title max-w-[14ch] text-[clamp(2.1rem,4.4vw,3.2rem)] text-ink-950"
              />
            </div>
            <div data-rise="1" className="max-w-[42ch]">
              <p className="text-[13px] leading-[1.85] text-ink-500">{data?.body}</p>
              {data?.hint ? (
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                  {data.hint} — {String(items.length).padStart(2, '0')}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
            {/* ---- the directory ------------------------------------- */}
            <ol
              className={[
                'overflow-hidden rounded-3xl border border-ink-950/[0.08]',
                classes?.index,
                className,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {items.map((item, i) => (
                <li
                  key={item}
                  data-rise={Math.min(i + 1, 3)}
                  className="border-b border-ink-950/[0.08] last:border-b-0"
                >
                  <span className="group grid cursor-default grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-ink-950 md:px-7 md:py-[1.1rem]">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 transition-colors duration-200 group-hover:text-primary-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[clamp(1.15rem,2vw,1.5rem)] font-medium tracking-tight text-ink-950 transition-colors duration-200 group-hover:text-paper-50">
                      {item}
                    </span>
                    <MdiIcon
                      name="arrowTopRight"
                      size={0.9}
                      className="text-ink-300 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent-500 group-hover:opacity-100"
                    />
                  </span>
                </li>
              ))}
            </ol>

            {/* ---- the globe ------------------------------------------ */}
            <div data-rise="2" className={classes?.globe}>
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
      </div>
    </section>
  );
}
