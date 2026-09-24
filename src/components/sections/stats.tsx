import { GrowthSpark } from '@/components/graphics/growth-spark';
import { MdiIcon, statIcons } from '@/components/motion/mdi-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Cover3D, ScrollTilt } from '@/lib/motion/scroll-3d';
import type { StatsSection } from '@/lib/content/types';

/** Stats — dark band, flat hairline stat cells with sparklines. */
export function Stats({ stats }: { stats?: StatsSection }) {
  return (
    <section id="philosophy" data-scene="philosophy" data-snap className="relative bg-ink-950 py-28 text-[#eceeee] md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
          <SectionHeader eyebrow={stats?.eyebrow ?? ''} title={stats?.headline} dark />
          <ScrollTilt tilt={5} travel={24}>
            <p className="prose-serif max-w-md text-[#eceeee]/75 md:pt-24">{stats?.body}</p>
          </ScrollTilt>
        </div>

        <div className="mt-20 grid gap-px border border-[#eceeee]/15 bg-[#eceeee]/15 sm:grid-cols-2 md:grid-cols-4">
          {stats?.stats?.map((stat, i) => (
            <Cover3D key={stat.label} delay={i * 0.06} tilt={10} y={40} className="bg-ink-950">
              <div className="h-full bg-ink-950 p-7">
                <div className="flex items-start justify-between">
                  <GrowthSpark seed={i} />
                  <MdiIcon name={statIcons[i % statIcons.length]} size={0.85} className="text-ember" />
                </div>
                <p className="display mt-5 text-[clamp(2.2rem,4vw,3.2rem)] text-[#eceeee]">{stat.value}</p>
                <p className="mono-label mt-6 text-[#eceeee]/55">{stat.label}</p>
              </div>
            </Cover3D>
          ))}
        </div>
      </div>
    </section>
  );
}
