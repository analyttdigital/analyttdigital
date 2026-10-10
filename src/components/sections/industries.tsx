import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector work as a ghost-numeral ledger.
 *
 * Thirteen sectors set as a two-column ruled ledger on paper: oversized
 * ghost numerals, display names, hairline rules. A row hover warms its
 * numeral to ember and draws the name forward with its arrow. Content
 * shape unchanged: the same list of sector names.
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

          {/* ---- the ledger ---------------------------------------- */}
          <ol
            className={[
              'mt-14 grid border-b border-ink-950/10 md:grid-cols-2 md:gap-x-16',
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
                className="border-t border-ink-950/10"
              >
                <span className="group grid cursor-default grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 py-5 md:gap-7 md:py-6">
                  <span className="num text-[clamp(2rem,3.4vw,2.9rem)] font-medium leading-none text-ink-200 transition-colors duration-200 group-hover:text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-medium tracking-tight text-ink-950 transition-transform duration-200 group-hover:translate-x-1.5">
                    {item}
                  </span>
                  <MdiIcon
                    name="arrowTopRight"
                    size={0.95}
                    className="-translate-x-1.5 text-ink-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-accent-600 group-hover:opacity-100"
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
