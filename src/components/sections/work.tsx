import { AnalyticsScreen } from '@/components/graphics/analytics-screen';
import { SectionHeader } from '@/components/motion/section-header';
import { TiltCard } from '@/components/motion/tilt-card';
import { Reveal } from '@/lib/motion/reveal';
import type { WorkSection } from '@/lib/content/types';

/** "CLIENT RESULTS" — rows with tilted media cards + oversized metrics. */
export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];

  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader eyebrow={work?.eyebrow ?? ''} title={work?.headline} />

        <div className="mt-16 border-t hairline">
          {cases.map((kase, i) => (
            <Reveal key={kase.client} delay={i * 0.04}>
              <article className="group grid gap-10 border-b hairline py-14 lg:grid-cols-[56px_1.25fr_1fr]">
                <span className="font-mono text-[13px] text-ink/40">{String(i + 1).padStart(2, '0')}</span>

                <div>
                  <p className="mono-label text-ink/45">{kase.client} — {kase.industry}</p>
                  <h3 className="mt-4 max-w-md font-display text-[26px] font-semibold leading-tight text-ink-950">
                    {kase.headline}
                  </h3>
                  <p className="prose-serif mt-5 max-w-xl text-[15px]">{kase.body}</p>

                  {/* case media — faux dashboard in a tilt frame */}
                  <div className="mt-8 max-w-[340px]" style={{ perspective: '1000px' }}>
                    <TiltCard max={4}>
                      <div className="depth-panel depth-float rounded-lg border border-ink/10 p-3">
                        <div className="depth-inset rounded bg-mist p-2">
                          <AnalyticsScreen variant={i} />
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </div>

                <div className="flex items-end justify-start lg:justify-end">
                  <TiltCard max={3} glare={false}>
                    <div>
                      <p className="display text-[clamp(3.5rem,7vw,5.5rem)] text-ember">{kase.metric}</p>
                      <p className="mono-label mt-2 text-ink/50">{kase.metricLabel}</p>
                    </div>
                  </TiltCard>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
