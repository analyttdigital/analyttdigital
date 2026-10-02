import { IconPanel } from '@/components/graphics/icon-panel';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { ProblemSection } from '@/lib/content/types';

/**
 * Problem — screenshot 3 composition: text left, collage right (app window,
 * report card, chat bubble callouts). Collage pieces drift at different
 * parallax rates for depth.
 */
export function Problem({ problem }: { problem?: ProblemSection }) {
  const chips = problem?.panelChips ?? [];
  return (
    <section
      id="problem"
      data-scene="problem"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage mx-auto grid w-full max-w-[1320px] items-center gap-14 px-6 py-16 md:px-14 md:py-20 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHeader eyebrow={problem?.eyebrow ?? ''} title={problem?.headline} />
          <div className="mt-8 space-y-5">
            {problem?.paragraphs?.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="max-w-lg text-[15.5px] leading-relaxed text-ink-700">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          {problem?.closing ? (
            <Reveal delay={0.2}>
              <p className="mt-8 inline-flex items-center gap-3 rounded-pill bg-ink-950 px-5 py-2.5 text-[13px] font-semibold text-paper shadow-button">
                <MdiIcon name="check" size={0.7} className="text-accent-300" />
                {problem.closing}
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* collage */}
        <div className="relative h-[420px] md:h-[520px]">
          {/* app window */}
          <Reveal className="absolute left-0 top-0 w-[62%]" delay={0.1}>
            <div className="card-float overflow-hidden p-2.5">
              <div className="mb-2 flex items-center gap-1.5 px-1.5">
                <span className="h-2 w-2 rounded-full bg-mist-400" />
                <span className="h-2 w-2 rounded-full bg-mist-400" />
                <span className="h-2 w-2 rounded-full bg-mist-400" />
                <span className="ml-auto text-[11px] font-medium text-ink-400">{problem?.panelTitle ?? 'Account snapshot'}</span>
              </div>
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-b from-ink-50 via-paper to-mist-100">
                <div aria-hidden className="aurora absolute inset-0 opacity-40" />
                <IconPanel icon="crosshairs" size="lg" tint="ink" />
              </div>
            </div>
          </Reveal>

          {/* report card */}
          <Reveal className="absolute right-0 top-[38%] w-[46%]" delay={0.25}>
            <div className="card-float p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">Report</span>
                <span className="text-[11px] font-medium text-ink-400">Last 90 days</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {chips.map((chip, i) => (
                  <div key={`${chip.label}-${i}`} className="flex items-center justify-between rounded-xl bg-mist-100 px-3.5 py-2.5">
                    <span className="text-[13px] text-ink-700">{chip.label}</span>
                    <span className={`text-[15px] font-bold ${i === 1 ? 'text-accent-600' : 'text-ink-950'}`}>{chip.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* alert bubble */}
          <Reveal className="absolute left-[8%] bottom-[6%]" delay={0.35}>
            <span className="callout">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-paper">
                <MdiIcon name="chart" size={0.65} />
              </span>
              <strong className="text-ink-950">{problem?.panelAlert ?? 'Wasting −38%'}</strong>
            </span>
          </Reveal>

          {/* violet blob */}
          <div aria-hidden className="blob blob--violet -right-10 top-1/3 h-48 w-48 opacity-70" />
        </div>
      </div>
    </section>
  );
}
