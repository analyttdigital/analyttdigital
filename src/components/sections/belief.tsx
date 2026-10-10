import { ActivityTerrain } from '@/components/graphics/activity-terrain';
import { Reveal } from '@/lib/motion/reveal';
import type { BeliefSection, DataProps } from '@/lib/content/types';

/**
 * Belief — the philosophy, demonstrated on the deep ground.
 *
 * The position is stated huge in paper white on deep violet-black; beneath
 * it the activity terrain sits as a light instrument panel — a live 3D
 * readout of when customers actually convert, with the same numbers
 * available as a table for assistive tech. All copy and metric config
 * arrive from the content layer. Content shape unchanged.
 */
export function Belief({ data, classes, className, id }: DataProps<BeliefSection, 'instrument'>) {
  return (
    <section id={id ?? 'belief'} className="relative overflow-hidden bg-primary-950 py-24 md:py-32">
      {/* Held violet light + faint contour rings, never information. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary-600/25 blur-3xl" />
        <div className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full ring-1 ring-paper-50/10" />
        <div className="absolute -left-24 top-1/3 h-[480px] w-[480px] rounded-full ring-1 ring-paper-50/[0.07]" />
        <div className="absolute -right-48 bottom-0 h-[520px] w-[520px] rounded-full ring-1 ring-paper-50/10" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="max-w-4xl">
          <Reveal>
            <h2 className="text-[clamp(2.4rem,5.4vw,4.2rem)] font-medium leading-[1.05] tracking-tight text-paper-50">
              {data?.headline} <span className="text-accent-400">{data?.headlineAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[62ch] text-sm leading-[1.85] text-primary-200 md:text-base">
              {data?.lede}
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className={[
            'mx-auto mt-12 w-full max-w-6xl md:mt-14',
            classes?.instrument,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {data?.terrain ? (
            <div
              className="rounded-[2rem] border border-ink-950/10 bg-paper-50 p-5 md:p-7"
              style={{ boxShadow: '0 40px 120px -40px rgb(0 0 0 / 0.6)' }}
            >
              <ActivityTerrain data={data.terrain} id="belief-terrain" />
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
