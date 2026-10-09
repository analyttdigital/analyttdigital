'use client';

import { useState } from 'react';

import { Band } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { useChrome } from '@/lib/content/chrome';
import type { ProblemSection } from '@/lib/content/types';

/**
 * Problem — where the money actually went, as a soft leak meter.
 *
 * The argument is argued on the light band now: a pill-shaped stacked bar
 * where every segment is one spend split sized by its share, and rounded
 * ledger lines beneath it. Touching a segment lights its ledger line and
 * vice-versa; the losing split carries ember and a soft ember glow.
 * Entrances are GSAP rise + de-blur. Content shape untouched.
 */

const FILL = ['bg-ink-300', 'bg-accent-500', 'bg-ink-950/10'];

function shareOf(value: string | undefined, total: number, fallback: number) {
  const parsed = Number.parseFloat((value ?? '').replace(/[^\d.]/g, ''));
  if (Number.isNaN(parsed) || total <= 0) return fallback;
  return (parsed / total) * 100;
}

export function Problem({ problem }: { problem?: ProblemSection }) {
  const chrome = useChrome();
  const chips = problem?.panelChips ?? [];
  const total = chips.reduce((sum, chip) => {
    const parsed = Number.parseFloat(chip.value.replace(/[^\d.]/g, ''));
    return sum + (Number.isNaN(parsed) ? 0 : parsed);
  }, 0);
  const [active, setActive] = useState<number | null>(null);

  return (
    <Band id="problem" ground="paper">
      <GsapReveal>
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* ---- the charge -------------------------------------- */}
          <div>
            <p data-rise className="label text-ink-500">{problem?.eyebrow}</p>
            <InViewTitle
              text={(problem?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title mt-6 max-w-[14ch] text-[clamp(2.1rem,4.4vw,3rem)] text-ink-950"
            />
            <div className="mt-7 space-y-5">
              {problem?.paragraphs?.map((paragraph, i) => (
                <p key={i} data-rise={i + 1} className="max-w-[52ch] text-[13px] leading-[1.85] text-ink-500">
                  {paragraph}
                </p>
              ))}
            </div>
            {problem?.closing ? (
              <p data-rise="4" className="label mt-9 text-accent-600">{problem.closing}</p>
            ) : null}
          </div>

          {/* ---- the leak meter ----------------------------------- */}
          <div
            data-rise="2"
            className="rounded-[2rem] border border-ink-950/[0.07] bg-paper-50 p-7 shadow-[0_30px_80px_-36px_rgb(var(--color-primary-600)/0.35)] md:p-9"
          >
            <div className="flex items-start justify-between gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
                {problem?.panelTitle ?? 'Account snapshot'}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                {chrome.everyHundred}
              </p>
            </div>

            <p
              className="num mt-6 text-[clamp(2.6rem,5.4vw,4.2rem)] leading-none text-accent-600"
              style={{ textShadow: '0 0 44px rgb(var(--color-accent-500) / 0.3)' }}
            >
              {problem?.panelAlert ?? 'Wasting −38%'}
            </p>

            {/* every hundred shillings, one pill bar */}
            <div className="mt-8 flex h-16 w-full gap-1 rounded-full border border-ink-950/10 bg-paper-200/60 p-1.5" role="list" aria-label={problem?.panelTitle}>
              {chips.map((chip, i) => {
                const share = shareOf(chip.value, total, 100 / Math.max(chips.length, 1));
                const live = active === i;
                return (
                  <button
                    key={`${chip.label}-${i}`}
                    type="button"
                    role="listitem"
                    aria-label={`${chip.label} — ${chip.value}, ${Math.round(share)}%`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onBlur={() => setActive(null)}
                    className={`relative h-full rounded-full transition-all duration-300 ${FILL[i % FILL.length]} ${
                      active === null || live ? 'opacity-100' : 'opacity-30'
                    } ${live ? 'shadow-[0_0_24px_rgb(var(--color-accent-500)/0.35)]' : ''}`}
                    style={{ width: `${share}%` }}
                  >
                    <span
                      className={`absolute inset-x-0 -bottom-6 mx-auto w-max font-mono text-[9px] tracking-[0.1em] text-ink-500 transition-opacity duration-300 ${
                        live ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {Math.round(share)}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* the ledger — rounded lines keyed to the segments */}
            <ol className="mt-12 space-y-2">
              {chips.map((chip, i) => {
                const share = shareOf(chip.value, total, 100 / Math.max(chips.length, 1));
                const live = active === i;
                return (
                  <li key={`${chip.label}-${i}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                      onBlur={() => setActive(null)}
                      className={`grid w-full grid-cols-[0.9rem_minmax(0,1fr)_auto_auto] items-center gap-x-4 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 ${
                        live ? 'bg-ink-950/[0.05]' : 'hover:bg-ink-950/[0.03]'
                      }`}
                    >
                      <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${FILL[i % FILL.length]}`} />
                      <span className={`text-[13.5px] font-medium tracking-tight transition-colors duration-200 ${live ? 'text-ink-950' : 'text-ink-500'}`}>
                        {chip.label}
                      </span>
                      <span className={`font-display text-[16px] font-medium tracking-tight transition-colors duration-200 ${live ? 'text-accent-600' : 'text-ink-900'}`}>
                        {chip.value}
                      </span>
                      <span className="w-10 text-right font-mono text-[10px] tracking-[0.14em] text-ink-400">
                        {Math.round(share)}%
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 text-[11px] leading-relaxed text-ink-400">{chrome.illustration}</p>
          </div>
        </div>
      </GsapReveal>
    </Band>
  );
}
