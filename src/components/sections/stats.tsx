import { GrowthSpark } from '@/components/graphics/growth-spark';
import { SectionHeader } from '@/components/motion/section-header';
import { Parallax } from '@/lib/motion/parallax';
import { Reveal } from '@/lib/motion/reveal';
import type { StatsSection } from '@/lib/content/types';

/** "OUR PHILOSOPHY" dark band with proof stats + sparkline media. */
export function Stats({ stats }: { stats?: StatsSection }) {
  return (
    <section id="philosophy" className="depth-dark py-28 text-[#eceeee] md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
          <SectionHeader eyebrow={stats?.eyebrow ?? ''} title={stats?.headline} dark />
          <Parallax speed={22}>
            <p className="prose-serif max-w-md text-[#eceeee]/75 md:pt-24">{stats?.body}</p>
          </Parallax>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px bg-[#eceeee]/15 md:grid-cols-4">
          {stats?.stats?.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="flex h-full flex-col justify-between bg-ink-950 p-8">
                <div>
                  <GrowthSpark seed={i} />
                  <p className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)] text-[#eceeee]">{stat.value}</p>
                </div>
                <p className="mono-label mt-8 text-[#eceeee]/55">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
