import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { CtaSection, DataProps } from '@/lib/content/types';

/**
 * CtaAlt — the close as a split ember panel.
 *
 * The `cta` family already has the orb statement (centered, light) and
 * `cta-banner` (centered ember panel) plus `cta-split` (split ink panel);
 * the alt is the split on ember: portal eyebrow, display headline + body
 * left, the paper ask card with the audit pill and small print right.
 * Static server component. Content shape unchanged.
 */
export function CtaAlt({ data, classes, className, id }: DataProps<CtaSection, 'panel'>) {
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            data-rise
            className={[
              'relative grid gap-10 overflow-hidden rounded-[2rem] bg-accent-500 px-6 py-12 shadow-[0_40px_100px_-40px_rgb(var(--color-accent-600)/0.6)] md:p-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full ring-[28px] ring-paper-50/15"
            />
            <div className="relative">
              <p className="label text-paper-50/80">{data?.portalLabel ?? data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-6 max-w-[18ch] text-[clamp(2rem,4.4vw,3.2rem)] text-paper-50"
              />
              {data?.body ? (
                <p className="mt-6 max-w-[52ch] text-sm leading-[1.85] text-paper-50/85 md:text-base">
                  {data.body}
                </p>
              ) : null}
            </div>
            <div className="relative flex flex-col justify-center rounded-3xl bg-paper-50 p-7 md:p-8">
              <p className="font-mono text-[10px] capitalize tracking-[0.16em] text-ink-400">
                {data?.eyebrow}
              </p>
              <p className="mt-6">
                <a
                  href={data?.ctaHref || '#'}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
                >
                  {data?.cta}
                  <MdiIcon name="arrowRight" size={0.8} />
                </a>
              </p>
              {data?.note ? (
                <p className="mt-5 text-[12.5px] leading-[1.8] text-ink-500">
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
