import { MdiIcon } from '@/lib/icons/resolve-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { BeliefSection } from '@/lib/content/types';

/**
 * Belief — screenshot 1 pricing-card language: two elevated rounded cards on
 * the light stage with dashed feature rows and circular arrow discs.
 */
export function Belief({ belief }: { belief?: BeliefSection }) {
  const points = belief?.points ?? [];
  return (
    <section
      id="belief"
      data-scene="belief"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage mx-auto w-full max-w-[1320px] px-6 py-16 md:px-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader eyebrow={belief?.eyebrow ?? ''} title={belief?.headline} />
          {belief?.stripLabel ? (
            <Reveal delay={0.15}>
              <span className="chip-pill">{belief.stripLabel}</span>
            </Reveal>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.1}>
              <article className={`group relative flex h-full flex-col rounded-3xl p-8 shadow-float transition-transform duration-500 hover:-translate-y-1.5 ${i === 0 ? 'border border-paper-400/60 bg-paper' : 'border border-accent-200/70 bg-accent-50'}`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-950 text-paper shadow-button">
                  <MdiIcon name={point.icon || 'crosshairs'} size={0.85} />
                </div>
                <h3 className="mt-6 font-display text-[22px] font-semibold tracking-tight text-ink-950">{point.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{point.body}</p>

                {/* dashed feature row — screenshot 1 language */}
                <div className="mt-auto pt-8">
                  <div className="flex items-center justify-between border-t border-dashed border-ink-950/15 pt-5">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-ink-600">
                      <span className="h-4 w-4 rounded-full border border-dashed border-ink-400" />
                      Step {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-paper transition-transform duration-300 group-hover:rotate-45">
                      <MdiIcon name="arrowTopRight" size={0.65} />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* aurora rings backdrop */}
        <div aria-hidden className="aurora pointer-events-none absolute -bottom-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 opacity-50" />
      </div>
    </section>
  );
}
