import { SheetBlock, SheetTitle } from '@/components/layout/sheet-block';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { CountUp } from '@/lib/motion/counter';
import { Reveal, TallyRise } from '@/lib/motion/reveal';
import type { StatsSection } from '@/lib/content/types';

/**
 * Stats — the tally.
 *
 * One inversion on the whole sheet: the band prints in press ink, edge to
 * edge, with no heading inside it. Four figures rise from their own baseline
 * and are divided by short vertical rules — a tally, not four cards, and no
 * invented framing around numbers the agency actually commits to.
 */
export function Stats({ stats }: { stats?: StatsSection }) {
  return (
    <SheetBlock id="numbers" folio="07" head={stats?.eyebrow} tone="ink">
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] lg:items-end">
        <SheetTitle lines={stats?.headline ?? ''} delay={0.1} />
        <Reveal delay={0.2}>
          <p className="body-copy max-w-[52ch] text-paper/85">{stats?.body}</p>
        </Reveal>
      </div>

      <div aria-hidden className="mt-12 h-0.5 w-full bg-paper/70" />

      <dl className="grid sm:grid-cols-2 lg:grid-cols-4">
        {stats?.stats?.map((stat, i) => (
          <TallyRise key={stat.label} delay={0.14 + i * 0.08} className="border-t border-paper/25 py-8 lg:py-10">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <CountUp value={stat.value} className="figure block text-[clamp(2.6rem,5vw,3.9rem)] text-paper" />
              <p className="mt-4 flex items-center gap-2.5 text-[13px] leading-snug text-paper/70">
                <MdiIcon name={stat.icon || 'crosshairs'} size={0.6} className="shrink-0 text-accent-400" />
                {stat.label}
              </p>
            </dd>
          </TallyRise>
        ))}
      </dl>
    </SheetBlock>
  );
}
