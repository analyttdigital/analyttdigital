import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, LeakListSection } from '@/lib/content/types';

/**
 * LeakList — account leaks as numbered rows.
 *
 * Built for the paid-media "six leaks" block, which previously reused
 * `problem-alt` with its figure forced into service as a list. Each leak
 * gets an ember numeral, a title, and its cost line over hairlines, with
 * the closing promise beneath. No figure, no client state. Same `data` +
 * `classes` contract; no new copy (all strings arrive in `data`).
 */
export function LeakList({ data, classes, className, id }: DataProps<LeakListSection, 'rows' | 'row'>) {
  const items = data?.items ?? [];
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
              />
            </div>
            {data?.body ? (
              <p data-rise="1" className="max-w-[52ch] text-sm leading-[1.85] text-ink-500">
                {data.body}
              </p>
            ) : null}
          </div>
          {items.length > 0 ? (
            <ol
              className={['mt-12 border-t border-ink-950/10', classes?.rows]
                .filter(Boolean)
                .join(' ')}
            >
              {items.map((item, i) => (
                <li
                  key={item.title || i}
                  data-rise={Math.min(i + 1, 3)}
                  className={`grid gap-2 border-b border-ink-950/10 py-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 ${classes?.row ?? ''}`}
                >
                  <span className="num text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium tracking-tight text-ink-950">
                      {item.title}
                    </span>
                    <span className="mt-1.5 block max-w-[64ch] text-sm leading-[1.85] text-ink-500">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
          {data?.closing ? (
            <p data-rise="1" className="label mt-8 text-accent-600">
              {data.closing}
            </p>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
