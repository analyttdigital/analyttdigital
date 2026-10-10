import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector work as a full-width directory index.
 *
 * No globe, no plates: thirteen rows of large display type on paper,
 * ruled by hairlines and numbered in mono. A row hover inverts the row
 * to ink and slides its arrow in warm. Content shape unchanged: the same
 * list of sector names.
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

          {/* ---- the directory ------------------------------------- */}
          <ol
            className={[
              'mt-14 border-t border-ink-950/10',
              classes?.index,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {items.map((item, i) => (
              <li
                key={item}
                data-rise={Math.min(i + 1, 3)}
                className="border-b border-ink-950/10"
              >
                <span className="group grid cursor-default grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-5 rounded-2xl px-3 py-5 transition-colors duration-200 hover:bg-ink-950 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-8 md:px-6 md:py-6">
                  <span className="num text-sm text-ink-300 transition-colors duration-200 group-hover:text-primary-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium leading-tight tracking-tight text-ink-950 transition-all duration-200 group-hover:translate-x-2 group-hover:text-paper-50">
                    {item}
                  </span>
                  <MdiIcon
                    name="arrowTopRight"
                    size={1}
                    className="-translate-x-2 text-ink-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-accent-500 group-hover:opacity-100"
                  />
                </span>
              </li>
            ))}
          </ol>
        </GsapReveal>
      </div>
    </section>
  );
}
