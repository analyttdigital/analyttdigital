import { MdiIcon } from '@/components/motion/mdi-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Cover3D } from '@/lib/motion/scroll-3d';
import type { BeliefSection } from '@/lib/content/types';

/** Belief — three flat bordered points, hairline divider strip. */
export function Belief({ belief }: { belief?: BeliefSection }) {
  return (
    <section id="belief" data-scene="belief" data-snap className="relative border-t hairline bg-mist py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader eyebrow={belief?.eyebrow ?? ''} title={belief?.headline} />

        <div className="mt-16 grid gap-px border hairline bg-line md:grid-cols-3">
          {belief?.points?.map((point, i) => (
            <Cover3D key={point.title} delay={i * 0.08} tilt={10} y={44} className="bg-mist">
              <div className="group h-full bg-mist p-8 transition-colors duration-300 hover:bg-paper">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] text-ink/35 transition-colors group-hover:text-ember">
                    {`0${i + 1}`}
                  </span>
                  <MdiIcon name="crosshairs" size={0.7} className="text-ink/25 transition-colors group-hover:text-ember" />
                </div>
                <h3 className="mt-10 font-display text-[22px] font-semibold text-ink-950">{point.title}</h3>
                <p className="prose-serif mt-3 text-[15px]">{point.body}</p>
              </div>
            </Cover3D>
          ))}
        </div>

        {belief?.stripLabel ? (
          <div className="mt-16 flex items-center gap-6">
            <span aria-hidden className="h-px flex-1 bg-ink/15" />
            <p className="mono-label text-ink/50">{belief.stripLabel}</p>
            <span aria-hidden className="h-px flex-1 bg-ink/15" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
