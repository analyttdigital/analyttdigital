import { IconPanel } from '@/components/graphics/icon-panel';
import { DynamicImage } from '@/components/media/dynamic-image';
import { CountUp } from '@/lib/motion/counter';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { WorkSection } from '@/lib/content/types';

/**
 * Work — screenshot 1 pricing-card language: two-up grid of elevated
 * rounded cards with dashboard media, giant metric and circular arrow disc.
 */
export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];

  return (
    <section
      id="work"
      data-scene="work"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage relative mx-auto w-full max-w-[1320px] px-6 py-16 md:px-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader eyebrow={work?.eyebrow ?? ''} title={work?.headline} />
          <Reveal delay={0.15}>
            <span className="chip-pill">{cases.length} selected cases</span>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cases.map((kase, i) => {
            const featured = i === 0;
            return (
              <Reveal key={kase.client} delay={(i % 2) * 0.1} className={featured ? 'md:col-span-2' : ''}>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-paper-400/60 bg-paper shadow-float transition-transform duration-500 hover:-translate-y-1.5 ${
                    featured ? 'lg:flex-row lg:items-center' : ''
                  }`}
                >
                  <div className={`p-8 md:p-10 ${featured ? 'lg:max-w-[52%]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="rounded-pill bg-accent-50 px-3 py-1 text-[11px] font-bold text-accent-600">
                        {kase.depth ?? `Case ${String(i + 1).padStart(2, '0')}`}
                      </span>
                      <span className="text-[12.5px] font-medium text-ink-500">
                        {kase.client} · {kase.industry}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-[24px] font-semibold leading-snug tracking-tight text-ink-950 md:text-[28px]">
                      {kase.headline}
                    </h3>
                    <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-700">{kase.body}</p>

                    <div className="mt-8 flex items-end justify-between border-t border-dashed border-ink-950/15 pt-6">
                      <div>
                        <CountUp value={kase.metric} className="font-display text-[clamp(2.6rem,5vw,3.8rem)] font-bold leading-none tracking-tight text-ink-950" />
                        <p className="mt-2 text-[13px] text-ink-600">{kase.metricLabel}</p>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-950 text-paper transition-transform duration-300 group-hover:rotate-45">
                        <MdiIcon name="arrowTopRight" size={0.7} />
                      </span>
                    </div>
                  </div>

                  <figure className={`relative ${featured ? 'min-h-[240px] flex-1 lg:min-h-[360px]' : 'min-h-[220px]'}`}>
                    {kase.image?.src?.trim() ? (
                      <DynamicImage image={kase.image} sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-50 via-paper to-mist-100">
                        <div aria-hidden className="aurora absolute inset-0 opacity-40" />
                        <IconPanel
                          icon={capabilityIcons[i % capabilityIcons.length]}
                          value={kase.metric}
                          label={kase.metricLabel}
                          tint={i % 2 === 1 ? 'accent' : 'brand'}
                          size="lg"
                        />
                      </div>
                    )}
                  </figure>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div aria-hidden className="blob blob--violet -right-20 top-10 h-56 w-56 opacity-50" />
      </div>
    </section>
  );
}
