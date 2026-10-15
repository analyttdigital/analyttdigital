import { InViewTitle } from '@/components/graphics/in-view-title';
import { CountUp } from '@/lib/motion/counter';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, StatsSection } from '@/lib/content/types';

/**
 * Stats — the tally as a full-bleed light strip.
 *
 * No cards: one continuous paper band ruled into four columns by hairlines,
 * each carrying a counting figure, its mono label, and a small ghost icon.
 * The figures are the content's own numbers. Entrances rise and de-blur
 * (GSAP). Content shape unchanged.
 */
export function Stats({ data, classes, className, id }: DataProps<StatsSection, 'strip'>) {
  const stats = data?.stats ?? [];
  return (
    <section id={id ?? 'numbers'} className="relative overflow-hidden bg-paper py-20 md:py-28">
      {/* A held breath of violet across the band, never information. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_0%,rgb(var(--color-primary-200)/0.55),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
              />
            </div>
            {data?.body ? (
              <p data-rise="1" className="max-w-[40ch] text-[13px] leading-[1.85] text-ink-500">
                {data.body}
              </p>
            ) : null}
          </div>

          <dl
            className={[
              'mt-12 grid sm:grid-cols-2 lg:grid-cols-4',
              classes?.strip,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                data-rise={Math.min(i + 1, 3)}
                className="px-2 py-8 sm:px-6 md:py-10 lg:first:pl-0 lg:last:pr-0"
              >
                <dt className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-medium capitalize  text-ink-500">
                    {stat.label}
                  </span>
                  {stat.icon ? (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-500/10 text-accent-600">
                      <MdiIcon name={stat.icon} size={0.8} />
                    </span>
                  ) : null}
                </dt>
                <dd className="mt-6">
                  <CountUp
                    value={stat.value}
                    className="num block text-[clamp(2.6rem,4.6vw,3.8rem)] leading-none text-ink-950"
                  />
                </dd>
                <dd className="mt-5 flex items-center gap-2">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                  <span className="font-mono text-[9px] capitalize  text-ink-400">
                    {String(i + 1).padStart(2, '0')} / {String(stats.length).padStart(2, '0')}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </GsapReveal>
      </div>
    </section>
  );
}
