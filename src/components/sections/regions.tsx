import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, RegionsSection } from '@/lib/content/types';

/**
 * Regions — where-we-work coverage as pin cards.
 *
 * Built for the about page's coverage block, which previously reused
 * `industries-alt`. Same list shape as industries, own presentation: one
 * card per region (pin tile, mono position, region name) on paper with the
 * hint line beneath — neither the mosaic nor the ruled index. No backdrop
 * image, no client state. Same `data` + `classes` contract; no new copy
 * (all strings arrive in `data`).
 */
export function Regions({ data, classes, className, id }: DataProps<RegionsSection, 'grid' | 'card'>) {
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
            <div data-rise="1" className="max-w-[42ch]">
              <p className="text-sm leading-[1.85] text-ink-500">{data?.body}</p>
              {data?.hint ? (
                <p className="mt-4 font-mono text-[10px] capitalize text-ink-400">
                  {data.hint} — {String(items.length).padStart(2, '0')}
                </p>
              ) : null}
            </div>
          </div>

          {items.length > 0 ? (
            <ol
              className={['mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4', classes?.grid, className]
                .filter(Boolean)
                .join(' ')}
            >
              {items.map((item, i) => (
                <li
                  key={item}
                  data-rise={Math.min(i + 1, 3)}
                  className={`flex items-start gap-4 rounded-3xl border border-ink-950/[0.07] bg-paper-50 p-6 ${classes?.card ?? ''}`}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-950 text-paper-50">
                    <MdiIcon name="pin" size={0.9} />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] text-ink-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="verb mt-1.5 block text-[clamp(1.05rem,1.6vw,1.25rem)] leading-snug text-ink-950">
                      {item}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
