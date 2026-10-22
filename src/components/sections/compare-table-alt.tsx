import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { CompareTableSection, DataProps } from '@/lib/content/types';

/**
 * CompareTableAlt — plans as per-plan cards, not one ledger table.
 *
 * Where `CompareTable` sets features against plan columns in a single
 * table, the alt transposes it: one card per plan (column header as the
 * card title) listing its features with check glyphs, `Not included` rows
 * dimmed with the close glyph. Same fields, no new copy.
 */
export function CompareTableAlt({ data, classes, className, id }: DataProps<CompareTableSection, 'grid' | 'card'>) {
  const columns = data?.columns ?? [];
  const rows = data?.rows ?? [];
  const plans = columns.slice(1);
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
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
          {plans.length > 0 ? (
            <ol
              className={['mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4', classes?.grid, className]
                .filter(Boolean)
                .join(' ')}
            >
              {plans.map((plan, i) => (
                <li key={`${plan}-${i}`} data-rise={Math.min(i + 1, 3)} className="h-full">
                  <article
                    className={['flex h-full flex-col rounded-3xl bg-paper-50 p-7 ring-1 ring-ink-950/10', classes?.card]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <h3 className="verb text-[clamp(1.2rem,1.9vw,1.5rem)] text-ink-950">
                      {plan}
                    </h3>
                    <ul className="mt-6 grid flex-1 content-start gap-3 border-t border-ink-950/10 pt-6">
                      {rows.map((row) => {
                        const cell = row.cells[i] ?? '';
                        const excluded = cell.trim().toLowerCase() === 'not included';
                        return (
                          <li key={row.feature} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2.5">
                            <MdiIcon
                              name={excluded ? 'close' : 'check'}
                              size={0.7}
                              className={excluded ? 'mt-0.5 shrink-0 text-ink-300' : 'mt-0.5 shrink-0 text-accent-600'}
                            />
                            <span>
                              <span className={`block text-[13px] font-medium leading-snug ${excluded ? 'text-ink-300' : 'text-ink-700'}`}>
                                {row.feature}
                              </span>
                              {!excluded && cell.trim() ? (
                                <span className="mt-0.5 block text-[12px] leading-snug text-ink-500">
                                  {cell}
                                </span>
                              ) : null}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                </li>
              ))}
            </ol>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
