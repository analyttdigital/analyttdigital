import { ActivityTerrain } from '@/components/graphics/activity-terrain';
import { Reveal } from '@/lib/motion/reveal';
import type { BeliefSection, DataProps } from '@/lib/content/types';

/**
 * Belief — the philosophy, stated on the light ground.
 *
 * The position is set huge in ink with an ember accent; beneath it the
 * activity terrain sits as a dark-framed instrument — a live 3D readout
 * of when customers actually convert, with the same numbers available as
 * a table for assistive tech. All copy and metric config arrive from the
 * content layer. Content shape unchanged.
 */
export function Belief({ data, classes, className, id }: DataProps<BeliefSection, 'instrument'>) {
  return (
    <section id={id ?? 'belief'} className="relative overflow-hidden bg-paper py-24 md:py-32">
      {/* Held violet light, never information. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgb(var(--color-primary-200)/0.5),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="max-w-4xl">
          <Reveal>
            <h2 className="text-[clamp(2.4rem,5.4vw,4.2rem)] font-medium leading-[1.05] tracking-tight text-ink-950">
              {data?.headline} <span className="text-accent-600">{data?.headlineAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[62ch] text-sm leading-[1.85] text-ink-500 md:text-base">
              {data?.lede}
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className={['mx-auto mt-12 w-full max-w-6xl md:mt-14', classes?.instrument, className]
            .filter(Boolean)
            .join(' ')}
        >
          {data?.terrain ? (
            <div
              className="rounded-[2rem] bg-ink-950 p-2 shadow-[0_40px_100px_-40px_rgb(var(--color-primary-600)/0.45)] md:p-3"
            >
              <div className="rounded-[1.6rem] bg-paper-50 p-5 md:p-7">
                <ActivityTerrain data={data.terrain} id="belief-terrain" />
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
