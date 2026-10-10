'use client';

import { useState } from 'react';

import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { useChrome } from '@/lib/content/chrome';
import type { DataProps, ProblemSection } from '@/lib/content/types';

/**
 * Problem — the spend interrogated on the dark ground.
 *
 * The charge is set huge in paper white with the paragraphs running beneath
 * it; the evidence sits in a violet ledger panel where every spend split is
 * a ledger row and a segment of one thin stacked bar. Touching a row (or
 * segment) lights it and splashes its share across the panel as a ghost
 * numeral; the losing split carries ember throughout. Entrances rise and
 * de-blur (GSAP). Content shape untouched.
 */

const DOT = ['bg-primary-300', 'bg-accent-500', 'bg-paper-50/25'];

function shareOf(value: string | undefined, total: number, fallback: number) {
  const parsed = Number.parseFloat((value ?? '').replace(/[^\d.]/g, ''));
  if (Number.isNaN(parsed) || total <= 0) return fallback;
  return (parsed / total) * 100;
}

export function Problem({ data, classes, className, id }: DataProps<ProblemSection, 'ledger'>) {
  const chrome = useChrome();
  const chips = data?.panelChips ?? [];
  const total = chips.reduce((sum, chip) => {
    const parsed = Number.parseFloat(chip.value.replace(/[^\d.]/g, ''));
    return sum + (Number.isNaN(parsed) ? 0 : parsed);
  }, 0);
  const [active, setActive] = useState<number | null>(null);
  const ghost =
    active != null && chips[active]
      ? `${Math.round(shareOf(chips[active].value, total, 0))}%`
      : null;

  return (
    <section id={id ?? 'problem'} className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
      {/* Ember glow behind the verdict, never information. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_70%_30%,rgb(var(--color-accent-500)/0.12),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          {/* ---- the charge -------------------------------------- */}
          <div data-rise>
            <InViewTitle
              text={(data?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title max-w-[16ch] text-[clamp(2.4rem,5.4vw,4rem)] text-paper-50"
            />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
            {data?.paragraphs?.map((paragraph, i) => (
              <p key={i} data-rise={i + 1} className="max-w-[56ch] text-sm leading-[1.85] text-primary-200">
                {paragraph}
              </p>
            ))}
          </div>
          {data?.closing ? (
            <p data-rise="3" className="label mt-8 text-accent-400">{data.closing}</p>
          ) : null}

          {/* ---- the ledger -------------------------------------- */}
          <div
            data-rise="2"
            className={[
              'relative mt-14 overflow-hidden rounded-[2rem] bg-primary-900 p-7 ring-1 ring-paper-50/10 md:p-10',
              classes?.ledger,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {ghost ? (
              <span
                aria-hidden
                className="num pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 select-none text-[11rem] leading-none text-paper-50/[0.06] md:block"
              >
                {ghost}
              </span>
            ) : null}

            <div className="relative flex items-start justify-between gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary-200">
                {data?.panelTitle ?? 'Account snapshot'}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-50/40">
                {chrome.everyHundred}
              </p>
            </div>

            <p className="num relative mt-5 text-[clamp(2.6rem,5.4vw,4.2rem)] leading-none text-accent-400">
              {data?.panelAlert ?? 'Wasting −38%'}
            </p>

            {/* every hundred shillings, one thin stacked bar */}
            <div className="relative mt-8 flex h-3 w-full gap-1" role="list" aria-label={data?.panelTitle}>
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
                    style={{ width: `${share}%` }}
                    className={`h-full min-w-2 rounded-full transition-all duration-300 ${DOT[i % DOT.length]} ${
                      active === null || live ? 'opacity-100' : 'opacity-25'
                    } ${live ? 'shadow-[0_0_20px_rgb(var(--color-accent-500)/0.5)]' : ''}`}
                  />
                );
              })}
            </div>

            {/* the ledger rows */}
            <ol className="relative mt-6 divide-y divide-paper-50/10">
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
                      className={`grid w-full grid-cols-[0.9rem_minmax(0,1fr)_auto_auto] items-center gap-x-4 px-3 py-4 text-left transition-colors duration-200 ${
                        live ? 'bg-paper-50/[0.05]' : ''
                      }`}
                    >
                      <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${DOT[i % DOT.length]}`} />
                      <span className={`text-sm font-medium tracking-tight transition-colors duration-200 ${live ? 'text-paper-50' : 'text-primary-200'}`}>
                        {chip.label}
                      </span>
                      <span className={`font-display text-base font-medium tracking-tight transition-colors duration-200 ${live ? 'text-accent-400' : 'text-paper-50'}`}>
                        {chip.value}
                      </span>
                      <span className="w-10 text-right font-mono text-[10px] tracking-[0.14em] text-paper-50/50">
                        {Math.round(share)}%
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="relative mt-6 text-[11px] leading-relaxed text-paper-50/40">{chrome.illustration}</p>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
