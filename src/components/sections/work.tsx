import { AnalyticsScreen } from '@/components/graphics/analytics-screen';
import { CountUp } from '@/lib/motion/counter';
import { MdiIcon } from '@/components/motion/mdi-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Cover3D, Perspective } from '@/lib/motion/scroll-3d';
import type { WorkSection } from '@/lib/content/types';

/** Work — alternating flat rows: hairline frame, display metric, figure. */
export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];

  return (
    <section id="work" data-scene="work" data-snap className="relative border-t hairline bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader eyebrow={work?.eyebrow ?? ''} title={work?.headline} />

        <Perspective distance={1300} className="mt-16 space-y-px border hairline bg-line">
          {cases.map((kase, i) => {
            const flipped = i % 2 === 1;
            return (
              <Cover3D key={kase.client} delay={0.04 * i} tilt={8} y={48} className="bg-paper">
                <article
                  className={`grid gap-10 bg-paper p-8 md:p-10 lg:grid-cols-[1fr_360px] ${
                    flipped ? 'lg:grid-cols-[360px_1fr]' : ''
                  }`}
                >
                  <div className={flipped ? 'lg:order-2' : ''}>
                    <p className="mono-label flex items-center gap-2 text-ink/45">
                      <span className="text-ember">{kase.depth ?? String(i + 1).padStart(2, '0')}</span>
                      {kase.client} — {kase.industry}
                    </p>
                    <h3 className="mt-4 max-w-lg font-display text-[26px] font-semibold leading-tight text-ink-950">
                      {kase.headline}
                    </h3>
                    <p className="prose-serif mt-5 max-w-2xl text-[15px]">{kase.body}</p>

                    <div className="mt-8 border-t hairline pt-8">
                      <CountUp value={kase.metric} className="display text-[clamp(3rem,6vw,4.6rem)] text-ink-950" />
                      <p className="mono-label mt-2 text-ink/50">{kase.metricLabel}</p>
                    </div>
                  </div>

                  <figure className={`border hairline ${flipped ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center justify-between border-b hairline px-4 py-2.5">
                      <span className="font-mono text-[10px] uppercase tracking-monoSm text-ink/50">{kase.client}</span>
                      <MdiIcon name="chart" size={0.7} className="text-ember" />
                    </div>
                    <div className="p-3">
                      <AnalyticsScreen variant={i} />
                    </div>
                  </figure>
                </article>
              </Cover3D>
            );
          })}
        </Perspective>
      </div>
    </section>
  );
}
