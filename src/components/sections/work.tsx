'use client';

import { useState } from 'react';

import { DynamicImage } from '@/components/media/dynamic-image';
import { SheetBlock, SheetTitle } from '@/components/layout/sheet-block';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { CountUp } from '@/lib/motion/counter';
import { Impression, Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { WorkCase, WorkSection } from '@/lib/content/types';

/**
 * Work — the results table, in two impositions.
 *
 * Proof prints as a table: client and sector in the first column, the result
 * in the second, the figure set large in the third, and nothing but rules
 * between rows. The imposition switch sets the same four engagements either
 * way, so the reader can move between the print that argues and the print
 * that shows. Client names are withheld pending permission, so the caption
 * says exactly that rather than implying these are cleared case studies.
 */
export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];
  const chrome = useChrome();
  const [imposition, setImposition] = useState<'table' | 'plates'>('table');

  return (
    <SheetBlock id="work" folio="06" head={work?.eyebrow} tone="a">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <SheetTitle lines={work?.headline ?? ''} delay={0.1} />
        <Reveal delay={0.18}>
          <div className="switch" role="group">
            <button
              type="button"
              className="switch__option"
              aria-pressed={imposition === 'table'}
              onClick={() => setImposition('table')}
            >
              {chrome.imposition[0]}
            </button>
            <button
              type="button"
              className="switch__option"
              aria-pressed={imposition === 'plates'}
              onClick={() => setImposition('plates')}
            >
              {chrome.imposition[1]}
            </button>
          </div>
        </Reveal>
      </div>

      {imposition === 'table' ? (
        <ResultsTable cases={cases} />
      ) : (
        <ResultPlates cases={cases} />
      )}

      <Reveal delay={0.2}>
        <p className="mt-10 border-t border-ink-950/12 pt-5 text-[12px] leading-relaxed text-ink-500">
          {chrome.workNote}
        </p>
      </Reveal>
    </SheetBlock>
  );
}

function ResultsTable({ cases }: { cases: WorkCase[] }) {
  return (
    <div className="mt-12">
      <div aria-hidden className="h-0.5 w-full bg-ink-950/85" />
      {cases.map((kase, i) => (
        <Impression key={kase.client} delay={0.08 + i * 0.07} distance={4}>
          <article className="group border-b border-ink-950/15 transition-colors duration-300 hover:bg-paper/70">
            <div className="grid gap-x-10 gap-y-5 py-9 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)_minmax(0,0.58fr)] lg:py-10">
              {/* the engagement */}
              <div>
                <p className="folio w-narrow">{kase.depth ?? `Case ${String(i + 1).padStart(2, '0')}`}</p>
                <p className="mt-3 w-narrow text-[15px] font-bold text-ink-950">{kase.client}</p>
                <p className="mt-1 text-[13px] text-ink-500">{kase.industry}</p>
              </div>

              {/* the result, in words */}
              <div>
                <h3 className="sheet-verb text-[clamp(1.25rem,2.1vw,1.7rem)] text-ink-950">
                  {kase.headline}
                </h3>
                <p className="body-copy mt-4 max-w-[60ch] text-[14.5px]">{kase.body}</p>
              </div>

              {/* the figure */}
              <div className="lg:border-l lg:border-ink-950/12 lg:pl-8">
                <CountUp
                  value={kase.metric}
                  className="figure block text-[clamp(2.4rem,4.6vw,3.6rem)] text-ink-950 transition-colors duration-300 group-hover:text-accent-600"
                />
                <p className="mt-3 w-narrow text-[11.5px] font-semibold uppercase tracking-[0.12em] text-accent-600">
                  {kase.metricLabel}
                </p>
              </div>
            </div>
          </article>
        </Impression>
      ))}
    </div>
  );
}

function ResultPlates({ cases }: { cases: WorkCase[] }) {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {cases.map((kase, i) => (
        <Impression key={kase.client} delay={0.08 + i * 0.07} distance={5}>
          <article className="plate group relative flex h-full flex-col overflow-hidden rounded-[2px]">
            <div className="flex items-start justify-between gap-5 px-7 pb-5 pt-6">
              <div>
                <p className="folio w-narrow">{kase.depth ?? `Case ${String(i + 1).padStart(2, '0')}`}</p>
                <p className="mt-2.5 w-narrow text-[15px] font-bold text-ink-950">{kase.client}</p>
                <p className="mt-0.5 text-[13px] text-ink-500">{kase.industry}</p>
              </div>
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-ink-950 text-paper transition-transform duration-300 group-hover:rotate-45"
              >
                <MdiIcon name="arrowTopRight" size={0.7} />
              </span>
            </div>

            <figure className="relative min-h-[150px] border-y border-ink-950/10 bg-mist-100">
              {kase.image?.src?.trim() ? (
                <DynamicImage
                  image={kase.image}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div aria-hidden className="absolute inset-0 flex items-end p-6">
                  <span className="figure text-[clamp(2.2rem,4vw,3.1rem)] text-ink-950/10">
                    {kase.metric}
                  </span>
                </div>
              )}
            </figure>

            <div className="flex flex-1 flex-col px-7 py-6">
              <h3 className="sheet-verb text-[19px] text-ink-950">{kase.headline}</h3>
              <p className="body-copy mt-3 text-[14px]">{kase.body}</p>
              <div className="mt-auto flex items-baseline gap-3 border-t border-ink-950/12 pt-5">
                <CountUp value={kase.metric} className="figure text-[26px] text-ink-950" />
                <span className="w-narrow text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">
                  {kase.metricLabel}
                </span>
              </div>
            </div>
          </article>
        </Impression>
      ))}
    </div>
  );
}
