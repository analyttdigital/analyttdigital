'use client';

import { DynamicImage } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { ContentImage, CtaSection, DataProps } from '@/lib/content/types';

/**
 * CtaBanner — the mid-page ask as a centered ember panel.
 *
 * A rounded ember panel inset on the paper stage: giant centered statement,
 * one large paper pill, the small print beneath it. A ghost ring and a
 * held shade give it depth without ornament. Shares the CTA content shape,
 * so editors reuse the same fields in Keystatic. An optional `background`
 * image ref covers the panel (resolved through the shared media resolver)
 * under a dark gradient — used when the banner rides as the process
 * bridge. `bare` drops the outer stage wrapper so the banner can sit
 * inside a pinned bridge.
 */
export function CtaBanner({
  data,
  classes,
  className,
  id,
  background,
  bare,
}: DataProps<CtaSection, 'band'> & { background?: ContentImage | null; bare?: boolean }) {
  const panel = (
    <div
      className={[
        'relative overflow-hidden rounded-[2.5rem] bg-accent-500 px-6 py-16 text-center shadow-[0_40px_100px_-40px_rgb(var(--color-accent-600)/0.6)] md:py-20',
        classes?.band,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {background?.src?.trim() ? (
        <>
          <DynamicImage image={background} className="absolute inset-0 h-full w-full object-cover" sizes="960px" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
        </>
      ) : null}
            {/* Depth, never information. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_100%_at_50%_115%,rgb(0_0_0/0.25),transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full ring-[28px] ring-paper-50/15"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full ring-[36px] ring-ink-950/10"
            />

            <div data-rise className="relative mx-auto max-w-[28ch]">
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="font-display text-[clamp(2.2rem,4.6vw,3.4rem)] font-bold leading-[1.05] tracking-tight text-paper-50"
              />
            </div>
            {data?.body ? (
              <p data-rise="1" className="relative mx-auto mt-5 max-w-[52ch] text-sm leading-relaxed text-paper-50/85 md:text-base">
                {data.body}
              </p>
            ) : null}
            <div data-rise="2" className="relative mt-9 flex flex-col items-center gap-4">
              <a
                href={data?.ctaHref || '#'}
                className="inline-flex items-center gap-2.5 rounded-full bg-paper-50 px-8 py-4 text-base font-semibold text-ink-950 shadow-[0_14px_36px_-14px_rgb(0_0_0/0.5)] transition hover:scale-[1.02] hover:bg-paper-100 active:scale-[0.98]"
              >
                {data?.cta}
                <MdiIcon name="arrowRight" size={0.85} />
              </a>
              {data?.note ? (
                <p className="font-mono text-[10px] capitalize  text-paper-50/70">
                  {data.note}
                </p>
              ) : null}
            </div>
    </div>
  );

  if (bare) return panel;

  return (
    <section id={id} className="relative overflow-hidden bg-paper py-20 md:py-24">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>{panel}</GsapReveal>
      </div>
    </section>
  );
}
