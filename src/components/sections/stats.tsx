import { MdiIcon, statIcons } from '@/lib/icons/resolve-icon';
import { CountUp } from '@/lib/motion/counter';
import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { StatsSection } from '@/lib/content/types';

/**
 * Stats — dark navy rounded panel inside the light stage: white metric
 * cards with sparklines, chat-style toast, periwinkle blob accents.
 */
export function Stats({ stats }: { stats?: StatsSection }) {
  return (
    <section
      id="philosophy"
      data-scene="philosophy"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage mx-auto w-full max-w-[1320px] px-6 py-16 md:px-14 md:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-8 py-14 md:px-14 md:py-16">
          {/* periwinkle blobs */}
          <div aria-hidden className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />

          <div className="relative grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
            <SectionHeader eyebrow={stats?.eyebrow ?? ''} title={stats?.headline} dark />
            <Reveal delay={0.15}>
              <p className="max-w-md text-[15.5px] leading-relaxed text-paper/70 md:justify-self-end">
                {stats?.body}
              </p>
              {/* chat toast — screenshot 3 language */}
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-ink-900/90 px-5 py-3.5 shadow-float ring-1 ring-paper/10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-paper">
                  <MdiIcon name="chart" size={0.7} />
                </span>
                <div className="text-left">
                  <p className="text-[12px] font-semibold text-paper">Live reporting · This week</p>
                  <p className="text-[12px] text-paper/60">Every shilling tracked, every report actionable.</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="relative mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats?.stats?.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.07}>
                <div className="group h-full rounded-3xl bg-paper p-6 shadow-float transition-transform duration-500 hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-500 transition-colors group-hover:bg-accent-500 group-hover:text-paper">
                      <MdiIcon name={stat.icon || statIcons[i % statIcons.length]} size={1.3} />
                    </span>
                  </div>
                  <CountUp
                    value={stat.value}
                    className="mt-4 block font-display text-[clamp(2rem,3.4vw,2.8rem)] font-bold leading-none tracking-tight text-ink-950"
                  />
                  <p className="mt-3 text-[13px] leading-snug text-ink-600">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
