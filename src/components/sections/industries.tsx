import { MdiIcon } from '@/lib/icons/resolve-icon';
import { SectionHeader } from '@/components/motion/section-header';
import { Reveal } from '@/lib/motion/reveal';
import type { IndustriesSection } from '@/lib/content/types';

/**
 * Industries — light stage with white pill chips (dashed circle markers),
 * aurora rings drifting behind.
 */
export function Industries({ industries }: { industries?: IndustriesSection }) {
  return (
    <section
      id="industries"
      data-scene="industries"
      data-snap
      className="canvas relative flex min-h-[100svh] items-center overflow-hidden px-4 py-16 md:px-6"
    >
      <div className="stage relative mx-auto w-full max-w-[1320px] px-6 py-16 md:px-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <SectionHeader eyebrow={industries?.eyebrow ?? ''} title={industries?.headline}>
            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-ink-700">{industries?.body}</p>
            {industries?.hint ? (
              <p className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-ink-500">
                <MdiIcon name="waves" size={0.7} className="text-accent-500" />
                {industries.hint}
              </p>
            ) : null}
          </SectionHeader>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-3">
              {industries?.items?.map((item) => (
                <span
                  key={item}
                  className="callout cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="h-4 w-4 rounded-full border border-dashed border-ink-300" />
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div aria-hidden className="aurora pointer-events-none absolute -right-56 top-1/2 h-[640px] w-[640px] -translate-y-1/2 opacity-40" />
      </div>
    </section>
  );
}
