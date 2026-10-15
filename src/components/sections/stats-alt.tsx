import { InViewTitle } from '@/components/graphics/in-view-title';
import { CountUp } from '@/lib/motion/counter';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, StatsSection } from '@/lib/content/types';

/**
 * StatsAlt — the tally as a dark panel.
 *
 * Where `Stats` rules a light strip into hairlined columns, the alt holds the
 * same figures on one near-black plate: counting numerals in paper, mono
 * labels, ghost icons, ember position dots. Content shape unchanged.
 */
export function StatsAlt({ data, classes, className, id }: DataProps<StatsSection, 'panel' | 'grid'>) {
  const stats = data?.stats ?? [];

  return (
    <section id={id ?? 'numbers'} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            className={[
              'rounded-[2rem] bg-ink-950 px-6 py-12 shadow-[0_40px_100px_-40px_rgb(var(--color-primary-600)/0.45)] md:p-14',
              classes?.panel,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div data-rise>
                {data?.eyebrow ? (
                  <p className="label text-primary-300">{data.eyebrow}</p>
                ) : null}
                <InViewTitle
                  text={(data?.headline ?? '').replace(/\n/g, ' ')}
                  variant="blur"
                  as="h2"
                  className="title mt-4 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-paper-50"
                />
              </div>
              {data?.body ? (
                <p data-rise="1" className="max-w-[40ch] text-[13px] leading-[1.85] text-primary-200">
                  {data.body}
                </p>
              ) : null}
            </div>

            {stats.length > 0 ? (
              <dl
                className={['mt-12 grid gap-px overflow-hidden rounded-3xl bg-primary-50/10 sm:grid-cols-2 lg:grid-cols-4', classes?.grid]
                  .filter(Boolean)
                  .join(' ')}
              >
                {stats.map((stat, i) => (
                  <div key={stat.label} data-rise={Math.min(i + 1, 3)} className="bg-ink-950 px-6 py-8">
                    <dt className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] font-medium capitalize text-primary-200">
                        {stat.label}
                      </span>
                      {stat.icon ? (
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-50/10 text-primary-200">
                          <MdiIcon name={stat.icon} size={0.8} />
                        </span>
                      ) : null}
                    </dt>
                    <dd className="mt-6">
                      <CountUp
                        value={stat.value}
                        className="num block text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-paper-50"
                      />
                    </dd>
                    <dd className="mt-5 flex items-center gap-2">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                      <span className="font-mono text-[9px] capitalize text-primary-300">
                        {String(i + 1).padStart(2, '0')} / {String(stats.length).padStart(2, '0')}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
