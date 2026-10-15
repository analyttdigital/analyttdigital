import { DynamicImage } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, IndustriesSection } from '@/lib/content/types';

/**
 * IndustriesAlt — the sector work as a ruled index.
 *
 * Where `Industries` sets the sectors as a typographic mosaic at cycling
 * scales, the alt lists them as uniform ruled rows (mono position, one
 * display size, hairline dividers, ember on hover) under the same head and
 * backdrop wash. Content shape unchanged: the same list of sector names.
 */
export function IndustriesAlt({ data, classes, className, id }: DataProps<IndustriesSection, 'index'>) {
  const items = data?.items ?? [];

  return (
    <section id={id ?? 'industries'} className={`relative overflow-hidden bg-paper py-20 md:py-28 ${className ?? ''}`}>
      {data?.image?.src?.trim() ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <DynamicImage image={data.image} className="absolute inset-0 h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-paper-50/95 via-paper-50/60 to-paper-50/95" />
        </div>
      ) : null}
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[14ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
              />
            </div>
            <div data-rise="1" className="max-w-[42ch]">
              <p className="text-sm leading-[1.85] text-ink-500">{data?.body}</p>
              {data?.hint ? (
                <p className="mt-4 font-mono text-[10px] capitalize text-ink-400">
                  {data.hint} · {String(items.length).padStart(2, '0')}
                </p>
              ) : null}
            </div>
          </div>

          {items.length > 0 ? (
            <ol
              className={['mt-12 border-t border-ink-950/10', classes?.index, className]
                .filter(Boolean)
                .join(' ')}
            >
              {items.map((item, i) => (
                <li
                  key={item}
                  data-rise={Math.min(i + 1, 3)}
                  className="group flex cursor-default items-baseline gap-5 border-b border-ink-950/10 py-5 transition-colors duration-200 md:gap-8 md:py-6"
                >
                  <span className="font-mono text-[10px] text-ink-300 transition-colors duration-200 group-hover:text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[clamp(1.3rem,2.4vw,2rem)] font-medium tracking-tight text-ink-950 transition-colors duration-200 group-hover:text-accent-600">
                    {item}
                  </span>
                  <span aria-hidden className="ml-auto hidden h-px flex-1 self-center bg-ink-950/10 transition-colors duration-200 group-hover:bg-accent-500/40 sm:block" />
                </li>
              ))}
            </ol>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
