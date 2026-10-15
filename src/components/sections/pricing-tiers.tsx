import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, PricingTiersSection } from '@/lib/content/types';

/**
 * PricingTiers — the four plans as ledger cards.
 *
 * Featured tier takes the ink ground; the rest sit on paper-50. Tick rows
 * use the shared check glyph; `bestFor` rides as the mono foot.
 */
export function PricingTiers({ data, classes, className, id }: DataProps<PricingTiersSection, 'grid' | 'card'>) {
  const tiers = data?.tiers ?? [];
  return (
    <section id={id} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
              />
            </div>
            {data?.body ? (
              <p data-rise="1" className="max-w-[52ch] text-sm leading-[1.85] text-ink-500">
                {data.body}
              </p>
            ) : null}
          </div>
          <ol
            className={['mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4', classes?.grid, className]
              .filter(Boolean)
              .join(' ')}
          >
            {tiers.map((tier, i) => (
              <li key={`${tier.name}-${i}`} data-rise={Math.min(i + 1, 3)} className="h-full">
                <article
                  className={[
                    'flex h-full flex-col rounded-3xl p-7 ring-1',
                    tier.featured
                      ? 'bg-ink-950 text-paper-50 ring-paper-50/10'
                      : 'bg-paper-50 text-ink-950 ring-ink-950/10',
                    classes?.card,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <p className={`font-mono text-[10px] capitalize  ${tier.featured ? 'text-accent-300' : 'text-accent-600'}`}>
                    {tier.name}
                  </p>
                  <h3 className={`verb mt-3 text-[clamp(1.2rem,1.9vw,1.5rem)] ${tier.featured ? 'text-paper-50' : 'text-ink-950'}`}>
                    {tier.tagline}
                  </h3>
                  <p className={`mt-3 text-[12.5px] leading-[1.8] ${tier.featured ? 'text-primary-200' : 'text-ink-500'}`}>
                    {tier.body}
                  </p>
                  <ul className="mt-6 grid gap-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-snug">
                        <MdiIcon name="check" size={0.7} className={tier.featured ? 'mt-0.5 text-accent-300' : 'mt-0.5 text-accent-600'} />
                        <span className={tier.featured ? 'text-primary-100' : 'text-ink-700'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.bestFor ? (
                    <p className={`mt-6 font-mono text-[10px] capitalize  ${tier.featured ? 'text-paper-50/50' : 'text-ink-400'}`}>
                      {tier.bestFor}
                    </p>
                  ) : null}
                  <p className="mt-auto pt-7">
                    <a
                      href={tier.ctaHref || '#'}
                      className={
                        tier.featured
                          ? 'inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-semibold text-paper-50 transition hover:bg-accent-600'
                          : 'inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700'
                      }
                    >
                      {tier.cta}
                      <MdiIcon name="arrowRight" size={0.8} />
                    </a>
                  </p>
                </article>
              </li>
            ))}
          </ol>
          {data?.note ? (
            <p data-rise="1" className="label label--plain mt-10 max-w-[70ch] leading-[1.9] text-ink-500">
              {data.note}
            </p>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
