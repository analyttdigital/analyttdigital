import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, ExclusionsSection } from '@/lib/content/types';

/**
 * Exclusions — the honest scope note as ledger rows.
 *
 * Title + body per row under a hairline; the closing note keeps the
 * transparency promise from the pricing source copy.
 */
export function Exclusions({ data, classes, className, id }: DataProps<ExclusionsSection, 'list'>) {
  const items = data?.items ?? [];
  return (
    <section id={id} className="relative overflow-hidden bg-paper py-24 md:py-32">
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
          <ol
            className={['mt-12 divide-y divide-ink-950/10 border-y border-ink-950/10', classes?.list, className]
              .filter(Boolean)
              .join(' ')}
          >
            {items.map((item, i) => (
              <li key={`${item.title}-${i}`} data-rise={Math.min(i + 1, 3)} className="grid gap-2 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-950/5 text-ink-700">
                  <MdiIcon name="close" size={0.8} />
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
          {data?.note ? (
            <p data-rise="1" className="label label--plain mt-8 max-w-[70ch] leading-[1.9] text-ink-500">
              {data.note}
            </p>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
