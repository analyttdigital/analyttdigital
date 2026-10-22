import { InViewTitle } from '@/components/ui/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, PageHeroSection } from '@/lib/content/types';

/**
 * PageHero — the compact head for content pages.
 *
 * Eyebrow + display headline left, lede right (the DESIGN.md head pattern),
 * optional pull-quote and one or two pill asks beneath. No tunnel, no
 * marquee: inner pages open on the statement, not the instrument.
 */
export function PageHero({ data, classes, className, id }: DataProps<PageHeroSection, 'head'>) {
  return (
    <section id={id} className="relative overflow-hidden bg-paper pb-16 pt-28 md:pb-20 md:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgb(var(--color-primary-200)/0.5),transparent_70%)]"
      />
      <div
        className={['relative mx-auto w-full max-w-7xl px-5 md:px-8', classes?.head, className]
          .filter(Boolean)
          .join(' ')}
      >
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h1"
                className="title mt-7 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4rem)] text-ink-950"
              />
            </div>
            {data?.lede ? (
              <p data-rise="1" className="w-full max-w-[52ch] text-sm leading-[1.85] text-ink-500 md:text-base">
                {data.lede}
              </p>
            ) : null}
          </div>
          {data?.quote ? (
            <blockquote data-rise="2" className="mt-8 max-w-[52ch] border-l-2 border-accent-500 pl-5 text-sm italic leading-[1.85] text-ink-700">
              {data.quote}
            </blockquote>
          ) : null}
          {data?.cta || data?.secondaryCta ? (
            <div data-rise="2" className="mt-10 flex flex-wrap items-center gap-4">
              {data?.cta ? (
                <a
                  href={data.ctaHref || '#'}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
                >
                  {data.cta}
                  <MdiIcon name="arrowRight" size={0.8} />
                </a>
              ) : null}
              {data?.secondaryCta ? (
                <a
                  href={data.secondaryCtaHref || '#'}
                  className="inline-flex items-center gap-2.5 rounded-full border border-ink-950/15 px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors duration-200 hover:border-ink-950/30"
                >
                  {data.secondaryCta}
                </a>
              ) : null}
            </div>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
