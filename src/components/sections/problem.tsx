import { AnalyticsScreen } from '@/components/graphics/analytics-screen';
import { SectionHeader } from '@/components/motion/section-header';
import { Cover3D, ScrollTilt } from '@/lib/motion/scroll-3d';
import { Reveal } from '@/lib/motion/reveal';
import type { ProblemSection } from '@/lib/content/types';

/** Problem — light band, flat bordered figure with hairline stat cells. */
export function Problem({ problem }: { problem?: ProblemSection }) {
  const chips = problem?.panelChips ?? [];
  return (
    <section id="problem" data-scene="problem" data-snap className="relative bg-paper py-28 md:py-40">
      <div className="mx-auto grid max-w-[1320px] gap-16 px-6 md:grid-cols-[1.1fr_1fr] md:px-10">
        <div>
          <SectionHeader eyebrow={problem?.eyebrow ?? ''} title={problem?.headline} />

          <div className="mt-14 space-y-8">
            {problem?.paragraphs?.map((paragraph, i) => (
              <Cover3D key={i} delay={i * 0.08} tilt={8} y={36}>
                <p className="prose-serif md:text-[19px]">{paragraph}</p>
              </Cover3D>
            ))}
            {problem?.closing ? (
              <Reveal delay={0.2}>
                <p className="display border-l-2 border-ember pl-6 text-2xl text-ink-950 md:text-[28px]">{problem.closing}</p>
              </Reveal>
            ) : null}
          </div>
        </div>

        {/* sticky figure — flat border, hairline cells */}
        <div className="relative hidden md:block">
          <div className="sticky top-28">
            <ScrollTilt tilt={6} travel={24} scaleTo={0.98}>
              <figure className="border hairline bg-paper">
                <div className="flex items-center justify-between border-b hairline px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-monoSm text-ink/50">{problem?.panelTitle ?? 'Typical account'}</span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-monoSm text-ember">{problem?.panelAlert ?? 'Leaking −38%'}</span>
                </div>
                <div className="p-3">
                  <AnalyticsScreen variant={1} />
                </div>
                <div className="grid grid-cols-3 gap-px border-t hairline bg-line">
                  {chips.map((chip, i) => (
                    <div key={`${chip.label}-${i}`} className="bg-paper px-3 py-3">
                      <p className={`font-display text-lg font-bold ${i === 1 ? 'text-ember' : 'text-ink-950'}`}>{chip.value}</p>
                      <p className="font-mono text-[9px] uppercase tracking-monoSm text-ink/50">{chip.label}</p>
                    </div>
                  ))}
                </div>
              </figure>
            </ScrollTilt>
          </div>
        </div>
      </div>
    </section>
  );
}
