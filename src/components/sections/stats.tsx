import { Band, BandHead } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { CountUp } from '@/lib/motion/counter';
import { GsapReveal, TiltCard } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { StatsSection } from '@/lib/content/types';

/**
 * Stats — the tally as soft instrument tiles on the paper band.
 *
 * Four rounded plates with soft shadows, each leaning into the pointer with
 * an ember spotlight (TiltCard); the figure counts up and warms to ember on
 * hover. Entrances rise and de-blur on scroll (GSAP). Band head and type
 * match the belief. Content shape unchanged.
 */
export function Stats({ stats }: { stats?: StatsSection }) {
  return (
    <Band id="numbers" ground="paper">
      <GsapReveal>
        <div data-rise>
          <BandHead>{stats?.eyebrow}</BandHead>
        </div>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <div data-rise="1">
            <InViewTitle
              text={(stats?.headline ?? '').replace(/\n/g, ' ')}
              variant="blur"
              as="h2"
              className="title max-w-[16ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
            />
          </div>
          <p data-rise="2" className="max-w-[40ch] text-[13px] leading-[1.85] text-ink-500">
            {stats?.body}
          </p>
        </div>

        <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats?.stats?.map((stat, i) => (
            <div key={stat.label} data-rise={i + 1}>
              <TiltCard
                className="h-full rounded-3xl bg-paper-50 shadow-[0_22px_50px_-24px_rgb(var(--color-primary-600)/0.25)]"
                max={7}
              >
                <div className="flex h-full flex-col rounded-3xl border border-ink-950/[0.07] p-6 md:p-7">
                  <dt className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-ink-500">
                      {stat.label}
                    </span>
                    {stat.icon ? (
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-500/10 text-accent-600">
                        <MdiIcon name={stat.icon} size={0.8} />
                      </span>
                    ) : null}
                  </dt>
                  <dd className="mt-8">
                    <CountUp
                      value={stat.value}
                      className="num block text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-ink-950"
                    />
                  </dd>
                  <dd className="mt-5 flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-400">
                      {String(i + 1).padStart(2, '0')} / {String(stats.stats.length).padStart(2, '0')}
                    </span>
                  </dd>
                </div>
              </TiltCard>
            </div>
          ))}
        </dl>
      </GsapReveal>
    </Band>
  );
}
