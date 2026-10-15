import { InViewTitle } from '@/components/graphics/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { CompareTableSection, DataProps } from '@/lib/content/types';

/**
 * CompareTable — plans side by side, one ledger table.
 *
 * First column names the feature; `Not included` cells dim. Horizontal
 * scroll on small screens keeps the table honest without restyling.
 */
export function CompareTable({ data, classes, className, id }: DataProps<CompareTableSection, 'panel'>) {
  const columns = data?.columns ?? [];
  const rows = data?.rows ?? [];
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
          <div
            data-rise="2"
            className={[
              'mt-12 overflow-x-auto rounded-[2rem] bg-paper-50 p-7 ring-1 ring-ink-950/10 md:p-10',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr>
                  {columns.map((column, i) => (
                    <th
                      key={`${column}-${i}`}
                      scope="col"
                      className={`px-4 py-3 font-mono text-[10px] font-medium capitalize  ${i === 0 ? 'text-ink-400' : 'text-ink-950'}`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-950/10 border-t border-ink-950/10">
                {rows.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className="px-4 py-4 text-sm font-medium text-ink-950">
                      {row.feature}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={`px-4 py-4 text-[13px] leading-snug ${cell.trim().toLowerCase() === 'not included' ? 'text-ink-300' : 'text-ink-700'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
