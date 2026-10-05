import { Band, BandHead } from '@/components/layout/band';
import { GlowButton } from '@/components/layout/glow-button';
import { ProcessPlayer } from '@/components/graphics/process-player';
import { Reveal } from '@/lib/motion/reveal';
import type { ProcessSection } from '@/lib/content/types';

/**
 * Process — the engagement as a playable system.
 *
 * The intro states the position on the field ground; the player card beneath
 * it is the light instrument that walks the five steps with one autoplayed
 * detail view and one visual each. The closing row hands to the audit action.
 * All copy, chips, visual specs and timings arrive from the content layer.
 */
export function ProcessChapter({ process }: { process?: ProcessSection }) {
  return (
    <Band id="process" ground="paper">
      <BandHead>{process?.eyebrow}</BandHead>

      <div className="mt-10 max-w-2xl">
        <Reveal>
          <h2 className="text-3xl font-medium leading-[1.1] tracking-tight text-ink-950 md:text-5xl">
            {process?.headline} <span className="text-accent-600">{process?.headlineAccent}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="body body--paper mt-5 text-sm md:text-base">{process?.lede}</p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mx-auto mt-10 w-full max-w-5xl md:mt-12">
        {process && process.steps?.length ? <ProcessPlayer data={process} id="process-player" /> : null}
      </Reveal>

      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <Reveal className="max-w-xl">
          <p className="body body--paper text-sm leading-relaxed">{process?.closing}</p>
        </Reveal>
        <Reveal delay={0.1} className="shrink-0">
          <GlowButton data={{ label: process?.cta ?? '', href: process?.ctaHref }} className="w-full sm:w-auto" />
        </Reveal>
      </div>
    </Band>
  );
}
