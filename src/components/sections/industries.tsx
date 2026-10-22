import { DynamicImage } from '@/components/media/dynamic-image';
import { InViewTitle } from '@/components/ui/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector work as a typographic mosaic.
 *
 * No rows, no globe, no plates, no rules: the sectors set as one
 * airy field of display type on paper, each name at its own scale from
 * a repeating positional rhythm, with a small mono index for wayfinding.
 * A name hover warms it to ember. Content shape unchanged: the same list
 * of sector names.
 */

/** Display sizes cycling through the set — position, not content. */
const SCALES = [
  'clamp(2rem,4.6vw,3.4rem)',
  'clamp(1.2rem,2vw,1.6rem)',
  'clamp(1.7rem,3vw,2.5rem)',
  'clamp(1.1rem,1.8vw,1.4rem)',
  'clamp(2.3rem,5vw,3.8rem)',
  'clamp(1.4rem,2.2vw,1.8rem)',
];

export function Industries({ data, classes, className, id }: DataProps<IndustriesSection, 'index'>) {
  const items = data?.items ?? [];

  return (
    <section id={id ?? 'industries'} className="relative overflow-hidden bg-paper py-24 md:py-32">
      {data?.image?.src?.trim() ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <DynamicImage image={data.image} className="absolute inset-0 h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-paper-50/95 via-paper-50/60 to-paper-50/95" />
        </div>
      ) : null}
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          {/* ---- the head ------------------------------------------ */}
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title max-w-[14ch] text-[clamp(2.4rem,5vw,2.8rem)] text-ink-950"
              />
            </div>
            <div data-rise="1" className="max-w-[42ch]">
              <p className="text-sm leading-[1.85] text-ink-500">{data?.body}</p>
              {data?.hint ? (
                <p className="mt-4 font-mono text-[10px] capitalize  text-ink-400">
                  {data.hint} — {String(items.length).padStart(2, '0')}
                </p>
              ) : null}
            </div>
          </div>

          {/* ---- the mosaic ---------------------------------------- */}
          <div
            data-rise="2"
            className={['mt-14 border-t border-ink-950/10 pt-12', classes?.index, className]
              .filter(Boolean)
              .join(' ')}
          >
            <ol className="flex flex-wrap items-baseline gap-x-8 gap-y-5 md:gap-x-12">
              {items.map((item, i) => (
                <li key={item} className="group flex cursor-default items-baseline gap-3">
                  <span className="font-mono text-[10px]  text-ink-300 transition-colors duration-200 group-hover:text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-mono tracking-tight text-ink-950 transition-colors duration-200 group-hover:text-accent-600"
                    style={{ fontSize: SCALES[i % SCALES.length] }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
