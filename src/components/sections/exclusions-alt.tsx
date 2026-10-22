import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, ExclusionsSection } from '@/lib/content/types';

/**
 * ExclusionsAlt — the honest scope note on the dark ground.
 *
 * Where `Exclusions` rules light divided rows, the alt holds the same
 * title + body rows on one near-black panel in paper ink, with the closing
 * note beneath. Same fields, no new copy.
 */
export function ExclusionsAlt({ data, classes, className, id }: DataProps<ExclusionsSection, 'panel' | 'list'>) {
  const items = data?.items ?? [];
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            className={[
              'rounded-[2rem] bg-ink-950 px-6 py-12 shadow-[0_40px_100px_-40px_rgb(var(--color-primary-600)/0.45)] md:p-14',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div data-rise>
              <p className="label text-primary-300">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-4 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-paper-50"
              />
              {data?.body ? (
                <p className="mt-5 max-w-[52ch] text-sm leading-[1.85] text-primary-200">
                  {data.body}
                </p>
              ) : null}
            </div>
            {items.length > 0 ? (
              <ol
                className={['mt-10 divide-y divide-paper-50/10 border-y border-paper-50/10', classes?.list]
                  .filter(Boolean)
                  .join(' ')}
              >
                {items.map((item, i) => (
                  <li key={`${item.title}-${i}`} data-rise={Math.min(i + 1, 3)} className="grid gap-2 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-paper-50/10 text-primary-200">
                      <MdiIcon name="close" size={0.8} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium tracking-tight text-paper-50">
                        {item.title}
                      </span>
                      <span className="mt-1.5 block max-w-[64ch] text-sm leading-[1.85] text-primary-200">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
            {data?.note ? (
              <p data-rise="1" className="label label--plain mt-8 max-w-[70ch] leading-[1.9] text-primary-300">
                {data.note}
              </p>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
