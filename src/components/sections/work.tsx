'use client';

import { DynamicImage, MediaSlot } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { CountUp } from '@/lib/motion/counter';
import { useChrome } from '@/lib/content/chrome';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, WorkCase, WorkSection } from '@/lib/content/types';

/**
 * Work — selected cases as light proof cards in a grid.
 *
 * Proof-card language (square-dot eyebrow, display head with ink pill CTA,
 * photo banner with overlaid pills, initial tile, industry/client/body,
 * ember proof figure) on mist cards (`bg-primary-100`) with ink text.
 * Token map: mist panels, `accent-600` metric, primary-800/ink-950 ink.
 * Same `WorkCase` content shape, no new fields.
 */

function ProofCard({ kase, index, total }: { kase: WorkCase; index: number; total: number }) {
  const chrome = useChrome();
  const photo = kase.image?.src?.trim() ? kase.image : null;
  return (
    <article
      aria-label={`${kase.depth || kase.client} — ${kase.headline}`}
      data-card
      className="group relative flex h-full min-h-[420px] flex-col rounded-[28px] border border-primary-800/10  p-6 transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgb(var(--color-primary-800)/0.45)]"
    >
      {/* Media banner — photo first, honest slot when artless. */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl">
        {photo ? (
          <DynamicImage image={photo} className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" sizes="360px" />
        ) : (
          <MediaSlot
            image={null}
            icon="document"
            label={chrome.mediaSlot}
            tone="paper"
            className="absolute inset-0 h-full w-full"
          />
        )}
        {/* <span className="absolute left-4 top-4 rounded-full bg-ink-950/55 px-2.5 py-1 font-mono text-[11px] font-medium text-paper-50 backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span> */}
        {kase.tag ? (
          <span className="absolute right-4 top-4 rounded-full bg-paper-50/90 px-2.5 py-1 font-mono text-[10px] capitalize text-accent-700 backdrop-blur-sm">
            {kase.tag}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 gap-3 pt-5">
        <span
          aria-hidden
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper-100 font-display text-lg font-bold text-primary-800`}
        >
          {kase.client?.charAt(0) ?? '?'}
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] capitalize text-primary-800">
            {kase.industry}
          </p>
          <h3 className="mt-1 font-mono text-[clamp(1.25rem,1.8vw,1.5rem)]  leading-[1.1] tracking-[-.02em] text-ink-950">
            {kase.client}
          </h3>
        </div>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{kase.body}</p>
      <div className="mt-auto pt-5">
        <div className="border-t border-primary-800/15 pt-5">
        
          <CountUp
            value={kase.metric}
            className="num block font-display text-[1.7rem] font-bold leading-none tracking-[-.04em] text-accent-600"
          />
          <span className="mt-2 block text-[11px] leading-snug text-ink-500">
            {kase.metricLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Work({ data, classes, className, id }: DataProps<WorkSection, 'panel' | 'intro' | 'grid' | 'card'>) {
  const cases = data?.cases ?? [];
  return (
    <section id={id ?? 'work'} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            className={[
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className={classes?.intro}>
                <div data-rise>
                  <p className="mb-5 flex items-center gap-2 text-[.78rem] font-medium text-primary-800">
                    <i aria-hidden className="h-1.5 w-1.5 bg-accent-500" />
                    {data?.eyebrow ?? ''}
                  </p>
                  <InViewTitle
                    text={(data?.headline ?? '').replace(/\n/g, ' ')}
                    variant="blur"
                    as="h2"
                    className="title max-w-[12em] font-display text-[clamp(2.4rem,5.2vw,2.4rem)] font-bold leading-[1.02] tracking-[-.035em] text-ink-950"
                  />
                </div>
                {data?.body ? (
                  <p data-rise="1" className="mt-6 max-w-[26em] text-[1.02rem] leading-relaxed text-ink-500">
                    {data.body}
                  </p>
                ) : null}
                <div data-rise="2" className="mt-9 flex flex-wrap items-center gap-6">
                  {data?.cta ? (
                    <a
                      href={data.ctaHref || '#'}
                      className="inline-flex items-center gap-3 rounded-full bg-ink-950 px-7 py-4 text-[.95rem] font-semibold text-paper-50 transition hover:bg-accent-600"
                    >
                      {data.cta}
                      <MdiIcon name="arrowRight" size={0.85} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <ol
              className={['mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3', classes?.grid].filter(Boolean).join(' ')}
            >
              {cases.map((kase, i) => (
                <li key={kase.client} data-rise={Math.min(i + 1, 3)} className={[classes?.card].filter(Boolean).join(' ') || undefined}>
                  <ProofCard kase={kase} index={i} total={cases.length} />
                </li>
              ))}
            </ol>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
