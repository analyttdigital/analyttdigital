'use client';

import { GlowButton } from '@/components/layout/glow-button';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { CtaSection, DataProps } from '@/lib/content/types';

/**
 * CtaSplit — the pre-close ask as a split ink panel.
 *
 * The case for acting on the left (headline, body, small print), the
 * action isolated on its own violet card on the right with its live
 * label and the ember button. Shares the CTA content shape, so editors
 * reuse the same fields in Keystatic.
 */
export function CtaSplit({ data, classes, className, id }: DataProps<CtaSection, 'panel' | 'card'>) {
  return (
    <section id={id} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            className={[
              'grid gap-10 rounded-[2rem] bg-ink-950 p-8 shadow-[0_40px_100px_-40px_rgb(var(--color-primary-950)/0.6)] md:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div data-rise>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-paper-50">
                {data?.headline}
              </h2>
              <p className="mt-5 max-w-[52ch] text-sm leading-[1.85] text-primary-200 md:text-base">
                {data?.body}
              </p>
              {data?.note ? (
                <p className="mt-6 font-mono text-[10px] capitalize  text-paper-50/50">
                  {data.note}
                </p>
              ) : null}
            </div>
            <div
              data-rise="1"
              className={[
                'flex flex-col justify-center gap-5 rounded-3xl bg-primary-900 p-7 ring-1 ring-paper-50/10 md:p-8',
                classes?.card,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {data?.portalLabel ? (
                <p className="font-mono text-[10px] capitalize  text-accent-300">
                  {data.portalLabel}
                </p>
              ) : null}
              <GlowButton
                data={{ label: data?.cta ?? '', href: data?.ctaHref }}
                className="w-full"
                tone="ember"
              />
              {data?.eyebrow ? (
                <p className="font-mono text-[10px] capitalize  text-paper-50/40">
                  {data.eyebrow}
                </p>
              ) : null}
            </div>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
