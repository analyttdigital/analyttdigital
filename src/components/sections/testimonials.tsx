import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, TestimonialSection } from '@/lib/content/types';

/**
 * Testimonials — client voices as quote cards.
 *
 * One card per quote (ember quote glyph, quote, name + optional role in
 * mono) on paper. Seeded only with real client words from the content
 * layer — never invented; empty `items` renders nothing. Same `data` +
 * `classes` contract. Server component.
 */
export function Testimonials({ data, classes, className, id }: DataProps<TestimonialSection, 'grid' | 'card'>) {
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
              className={['mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3', classes?.grid, className]
                .filter(Boolean)
                .join(' ')}
            >
              {items.map((item, i) => (
                <li key={`${item.name}-${i}`} data-rise={Math.min(i + 1, 3)} className="h-full">
                  <figure
                    className={[
                      'flex h-full flex-col rounded-3xl bg-paper-50 p-7 ring-1 ring-ink-950/10',
                      classes?.card,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <MdiIcon name="quote" size={1.1} className="text-accent-500" />
                    <blockquote className="mt-5 flex-1 text-[14px] leading-[1.85] text-ink-700">
                      {item.quote}
                    </blockquote>
                    <figcaption className="mt-6 border-t border-ink-950/10 pt-4">
                      <p className="text-sm font-medium text-ink-950">{item.name}</p>
                      {item.role ? (
                        <p className="mt-1 font-mono text-[10px] capitalize text-ink-400">
                          {item.role}
                        </p>
                      ) : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ol>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
