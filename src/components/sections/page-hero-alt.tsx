import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, PageHeroSection } from '@/lib/content/types';

/**
 * PageHeroAlt — the page head as a centered dark statement.
 *
 * Where `PageHero` splits the statement across the light ground (headline
 * left, lede right, quote and pills beneath), the alt centers everything on
 * one near-black panel: eyebrow, display headline, lede, pull-quote and the
 * one or two asks. Same fields, no new copy.
 */
export function PageHeroAlt({ data, classes, className, id }: DataProps<PageHeroSection, 'panel'>) {
  return (
    <section id={id} className={`relative overflow-hidden bg-paper pb-16 pt-28 md:pb-20 md:pt-36 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            data-rise
            className={[
              'rounded-[2rem] bg-ink-950 px-6 py-14 text-center shadow-[0_40px_100px_-40px_rgb(var(--color-primary-600)/0.45)] md:px-12 md:py-16',
              classes?.panel,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <p className="label text-primary-300">{data?.eyebrow}</p>
            <InViewTitle
              text={(data?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h1"
              className="title mx-auto mt-6 max-w-[20ch] text-[clamp(2.2rem,5vw,3.6rem)] text-paper-50"
            />
            {data?.lede ? (
              <p className="mx-auto mt-6 max-w-[58ch] text-sm leading-[1.85] text-primary-200 md:text-base">
                {data.lede}
              </p>
            ) : null}
            {data?.quote ? (
              <blockquote className="mx-auto mt-8 max-w-[52ch] text-sm italic leading-[1.85] text-primary-200">
                {data.quote}
              </blockquote>
            ) : null}
            {data?.cta || data?.secondaryCta ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {data?.cta ? (
                  <a
                    href={data.ctaHref || '#'}
                    className="inline-flex items-center gap-2.5 rounded-full bg-paper-50 px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors duration-200 hover:bg-paper-100"
                  >
                    {data.cta}
                    <MdiIcon name="arrowRight" size={0.8} />
                  </a>
                ) : null}
                {data?.secondaryCta ? (
                  <a
                    href={data.secondaryCtaHref || '#'}
                    className="inline-flex items-center gap-2.5 rounded-full border border-paper-50/25 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:border-paper-50/50"
                  >
                    {data.secondaryCta}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
