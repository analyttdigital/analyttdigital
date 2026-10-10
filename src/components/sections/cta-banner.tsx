'use client';

import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { CtaSection, DataProps } from '@/lib/content/types';

/**
 * CtaBanner — the mid-page ask as a full-bleed ember band.
 *
 * One line of proof-adjacent ask: headline and body in paper white on the
 * brand ember, the action as a paper pill, the small print beneath it.
 * No eyebrow, no ornament — the colour is the event. Shares the CTA
 * content shape, so editors reuse the same fields in Keystatic.
 */
export function CtaBanner({ data, classes, className, id }: DataProps<CtaSection, 'band'>) {
  return (
    <section id={id} className="relative overflow-hidden bg-accent-500">
      {/* Heat across the band, never information. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_120%_at_50%_120%,rgb(0_0_0/0.22),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-14 md:px-8 md:py-16">
        <GsapReveal>
          <div
            className={['flex flex-wrap items-center justify-between gap-x-12 gap-y-8', classes?.band, className]
              .filter(Boolean)
              .join(' ')}
          >
            <div data-rise className="max-w-[34ch]">
              <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold leading-[1.08] tracking-tight text-paper-50">
                {data?.headline}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper-50/85">{data?.body}</p>
            </div>
            <div data-rise="1" className="shrink-0">
              <a
                href={data?.ctaHref || '#'}
                className="inline-flex items-center gap-2.5 rounded-full bg-paper-50 px-7 py-4 text-[0.95rem] font-semibold text-ink-950 shadow-[0_14px_36px_-14px_rgb(0_0_0/0.5)] transition hover:scale-[1.02] hover:bg-paper-100 active:scale-[0.98]"
              >
                {data?.cta}
                <MdiIcon name="arrowRight" size={0.85} />
              </a>
              {data?.note ? (
                <p className="mt-3 font-mono text-[10px] capitalize tracking-[0.14em] text-paper-50/70">
                  {data.note}
                </p>
              ) : null}
            </div>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
