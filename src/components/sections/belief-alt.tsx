import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { BeliefSection, DataProps } from '@/lib/content/types';

/**
 * BeliefAlt — the philosophy as a centered statement card.
 *
 * Where `Belief` states the position huge and docks the activity-terrain
 * instrument beneath it, the alt is the copy-only composition: eyebrow,
 * headline + accent, and lede centered on one paper plate. No instrument,
 * no client state. Content shape unchanged.
 */
export function BeliefAlt({ data, classes, className, id }: DataProps<BeliefSection, 'card'>) {
  return (
    <section id={id ?? 'belief'} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgb(var(--color-primary-200)/0.5),transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            data-rise
            className={[
              'mx-auto max-w-4xl rounded-[2rem] bg-paper-50 px-6 py-14 text-center shadow-[0_30px_80px_-36px_rgb(var(--color-primary-600)/0.3)] ring-1 ring-ink-950/10 md:px-12 md:py-16',
              classes?.card,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {data?.eyebrow ? (
              <p className="label text-ink-500">{data.eyebrow}</p>
            ) : null}
            <InViewTitle
              text={`${data?.headline ?? ''} ${data?.headlineAccent ?? ''}`.replace(/\n/g, ' ').trim()}
              variant="blur"
              as="h2"
              className="title mx-auto mt-6 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink-950"
            />
            {data?.lede ? (
              <p className="mx-auto mt-6 max-w-[58ch] text-sm leading-[1.85] text-ink-500 md:text-base">
                {data.lede}
              </p>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
