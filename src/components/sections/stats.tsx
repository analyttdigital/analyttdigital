import { Band, BandHead } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { CountUp } from '@/lib/motion/counter';
import { Reveal, TallyRise } from '@/lib/motion/reveal';
import type { StatsSection } from '@/lib/content/types';

/**
 * Stats — the tally, on the first paper band.
 *
 * The page inverts here: light stock, ink type, no cards. Four figures rise off
 * their own baseline and are divided by vertical hairlines, so they read as one
 * measured statement rather than four achievements. No framing around numbers
 * the agency actually commits to, and no trace net either — this is the one
 * place on the page where nothing is allowed to move behind the figures.
 */
export function Stats({ stats }: { stats?: StatsSection }) {
  return (
    <Band id="numbers" ground="paper">
      <BandHead>{stats?.eyebrow}</BandHead>

      <div className="mt-10 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
        <InViewTitle text={(stats?.headline ?? '').replace(/\n/g, " ")} lines={(stats?.headline ?? '').split('\n')} variant="line" as="h2" className="title text-[clamp(2.05rem,4.4vw,3.4rem)] max-w-[16ch]" />
        <Reveal delay={0.18}>
          <p className="body body--paper max-w-[46ch] lg:justify-self-end">{stats?.body}</p>
        </Reveal>
      </div>

      <dl className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4">
        {stats?.stats?.map((stat, i) => (
          <TallyRise
            key={stat.label}
            delay={0.1 + i * 0.08}
            className={`border-ink-950/12 py-8 lg:py-6 ${
              i > 0 ? 'border-t lg:border-t-0' : ''
            } ${i > 0 ? 'lg:border-l lg:pl-8' : ''}`}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <CountUp
                value={stat.value}
                className="num block text-[clamp(2.5rem,5.4vw,4rem)] text-ink-950"
              />
              <p className="label label--plate mt-5">{stat.label}</p>
            </dd>
          </TallyRise>
        ))}
      </dl>
    </Band>
  );
}