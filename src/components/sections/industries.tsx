import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector work as a flowing typographic index.
 *
 * No rows, no globe, no plates: the sectors run as one large wrapping
 * line of display type on paper, parted by ember points, each warming to
 * ember on hover. The hint counts the set. Content shape unchanged: the
 * same list of sector names.
 */
export function Industries({ data, classes, className, id }: DataProps<IndustriesSection, 'index'>) {
  const items = data?.items ?? [];

  return (
    <section id={id ?? 'industries'} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          {/* ---- the head ------------------------------------------ */}
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title max-w-[14ch] text-[clamp(2.4rem,5vw,3.8rem)] text-ink-950"
              />
            </div>
            <div data-rise="1" className="max-w-[42ch]">
              <p className="text-sm leading-[1.85] text-ink-500">{data?.body}</p>
              {data?.hint ? (
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                  {data.hint} — {String(items.length).padStart(2, '0')}
                </p>
              ) : null}
            </div>
          </div>

          {/* ---- the flowing index --------------------------------- */}
          <ol
            data-rise="2"
            className={['mt-14 border-t border-ink-950/10 pt-10', classes?.index, className]
              .filter(Boolean)
              .join(' ')}
          >
            <li className="font-display text-[clamp(1.7rem,3.8vw,2.9rem)] font-medium leading-[1.35] tracking-tight text-ink-950">
              {items.map((item, i) => (
                <span key={item}>
                  <span className="transition-colors duration-200 hover:text-accent-600">
                    {item}
                  </span>
                  {i < items.length - 1 ? (
                    <span aria-hidden className="mx-3 inline-block h-[0.35em] w-[0.35em] rounded-full bg-accent-500 align-middle sm:mx-4" />
                  ) : (
                    <span aria-hidden className="text-accent-500">.</span>
                  )}
                </span>
              ))}
            </li>
          </ol>
        </GsapReveal>
      </div>
    </section>
  );
}
