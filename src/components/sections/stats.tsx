import { Band, BandHead } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { CountUp } from '@/lib/motion/counter';
import { Reveal, TallyRise } from '@/lib/motion/reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { StatsSection } from '@/lib/content/types';

/**
 * Stats — the tally as Otto's bordered price-grid on the paper band.
 *
 * One ruled frame, four cells, hairlines between them — no cards, no
 * shadows. Each cell carries a muted mark, the figure rising off its
 * baseline (CountUp), and a mono label; hovering a cell lifts it onto the
 * plate tone, the way Otto's grid reads as one instrument rather than four
 * boxes. Band head and type match the belief. Content shape unchanged.
 */
/** Hairlines per cell for the 1 / 2 / 4-column splits of one ruled frame. */
const CELL_RULES: Record<number, string> = {
  0: 'border-b sm:border-r lg:border-b-0',
  1: 'border-b lg:border-b-0 lg:border-r',
  2: 'border-b sm:border-b-0 sm:border-r',
  3: '',
};

export function Stats({ stats }: { stats?: StatsSection }) {
  return (
    <Band id="numbers" ground="paper">
      <BandHead>{stats?.eyebrow}</BandHead>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
        <InViewTitle
          text={(stats?.headline ?? '').replace(/\n/g, ' ')}
          variant="blur"
          as="h2"
          className="title max-w-[16ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
        />
        <Reveal delay={0.14}>
          <p className="max-w-[40ch] text-[13px] leading-[1.85] text-ink-500">{stats?.body}</p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mt-12">
        <dl className="grid border border-ink-950/15 sm:grid-cols-2 lg:grid-cols-4">
          {stats?.stats?.map((stat, i) => (
            <TallyRise
              key={stat.label}
              delay={0.08 + i * 0.08}
              className={`group border-ink-950/15 p-7 transition-colors duration-300 hover:bg-paper-50 md:p-8 ${
                CELL_RULES[i] ?? 'border-b sm:border-r'
              }`}
            >
              <dt className="flex items-center justify-between gap-3">
                <span className="label text-ink-500">{stat.label}</span>
                {stat.icon ? (
                  <span className="text-ink-300 transition-colors duration-300 group-hover:text-accent-600">
                    <MdiIcon name={stat.icon} size={0.85} />
                  </span>
                ) : null}
              </dt>
              <dd className="mt-8">
                <CountUp
                  value={stat.value}
                  className="num block text-[clamp(2.4rem,4.6vw,3.6rem)] leading-none text-ink-950 transition-colors duration-300 group-hover:text-accent-600"
                />
              </dd>
            </TallyRise>
          ))}
        </dl>
      </Reveal>
    </Band>
  );
}
