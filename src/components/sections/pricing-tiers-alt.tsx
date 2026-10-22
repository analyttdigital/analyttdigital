import Link from '@/components/ui/link';
import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, PricingTiersSection } from '@/lib/content/types';

/**
 * PricingTiersAlt — the plans as stacked comparison rows.
 *
 * Where `PricingTiers` sets four ledger cards in a grid (featured on ink),
 * the alt lays each tier out as one full-width row: name + tagline left,
 * ticked features inline center, best-for foot and ask right — the featured
 * row takes the ember wash. Same fields, no new copy.
 */
export function PricingTiersAlt({ data, classes, className, id }: DataProps<PricingTiersSection, 'rows' | 'row'>) {
  const tiers = data?.tiers ?? [];
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
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
          {tiers.length > 0 ? (
            <ol
              className={['mt-12 grid gap-4', classes?.rows].filter(Boolean).join(' ')}
            >
              {tiers.map((tier, i) => (
                <li
                  key={`${tier.name}-${i}`}
                  data-rise={Math.min(i + 1, 3)}
                  className={[
                    'grid gap-6 rounded-3xl p-7 ring-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-8',
                    tier.featured
                      ? 'bg-accent-500/[0.07] ring-accent-500/30'
                      : 'bg-paper-50 ring-ink-950/10',
                    classes?.row,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div>
                    <p className="flex items-center gap-3 font-mono text-[10px] capitalize text-accent-600">
                      {tier.featured ? (
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                      ) : null}
                      {tier.name}
                    </p>
                    <h3 className="verb mt-3 text-[clamp(1.2rem,1.9vw,1.5rem)] text-ink-950">
                      {tier.tagline}
                    </h3>
                    <p className="mt-2 max-w-[44ch] text-[12.5px] leading-[1.8] text-ink-500">
                      {tier.body}
                    </p>
                  </div>
                  <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-snug">
                        <MdiIcon name="check" size={0.7} className="mt-0.5 shrink-0 text-accent-600" />
                        <span className="text-ink-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="shrink-0 md:w-52">
                    {tier.bestFor ? (
                      <p className="font-mono text-[10px] capitalize text-ink-400">
                        {tier.bestFor}
                      </p>
                    ) : null}
                    <p className="mt-3">
                      <Link
                        href={tier.ctaHref || '#'}
                        className={
                          tier.featured
                            ? 'inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-semibold text-paper-50 transition hover:bg-accent-600'
                            : 'inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700'
                        }
                      >
                        {tier.cta}
                        <MdiIcon name="arrowRight" size={0.8} />
                      </Link>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
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
