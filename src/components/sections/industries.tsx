import { MdiIcon } from '@/components/motion/mdi-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Cover3D, ScrollTilt } from '@/lib/motion/scroll-3d';
import type { IndustriesSection } from '@/lib/content/types';

/** Industries — flat bordered index chips, zero radius. */
export function Industries({ industries }: { industries?: IndustriesSection }) {
  return (
    <section id="industries" data-scene="industries" data-snap className="relative bg-paper py-28 md:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-6 md:grid-cols-[1fr_1.2fr] md:px-10">
        <SectionHeader eyebrow={industries?.eyebrow ?? ''} title={industries?.headline}>
          <p className="prose-serif mt-6 max-w-md">{industries?.body}</p>
          {industries?.hint ? (
            <p className="mono-label mt-6 flex items-center gap-2 text-ink/50">
              <MdiIcon name="waves" size={0.7} className="text-ember" />
              {industries.hint}
            </p>
          ) : null}
        </SectionHeader>

        <ScrollTilt tilt={6} travel={20} className="flex flex-wrap content-start gap-2 md:pt-16">
          {industries?.items?.map((item, i) => (
            <Cover3D key={item} delay={i * 0.03} tilt={8} y={24}>
              <span className="inline-flex cursor-default items-center gap-2 border hairline bg-paper px-4 py-2.5 font-mono text-[12px] uppercase tracking-monoSm text-ink/80 transition-colors hover:border-ember hover:text-ember">
                <MdiIcon name="pin" size={0.6} className="text-ember/70" />
                {item}
              </span>
            </Cover3D>
          ))}
        </ScrollTilt>
      </div>
    </section>
  );
}
