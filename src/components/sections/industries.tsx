import { SheetBlock, SheetTitle } from '@/components/layout/sheet-block';
import { RowPress } from '@/lib/motion/reveal';
import type { IndustriesSection } from '@/lib/content/types';

/**
 * Industries — the sector index.
 *
 * Back matter, printed as back matter: the sectors run in a ruled multi-
 * column block, the way a broadsheet's service index does, with a mark per
 * entry that fills on hover. No leaders, because there are no page numbers
 * to point at — an index that lies about its own locators is worse than a
 * plain list.
 */
export function Industries({ industries }: { industries?: IndustriesSection }) {
  const items = industries?.items ?? [];

  return (
    <SheetBlock id="industries" folio="08" head={industries?.eyebrow} tone="b">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-end">
        <SheetTitle lines={industries?.headline ?? ''} delay={0.1} />
        <div>
          {industries?.body ? (
            <p className="body-copy">{industries.body}</p>
          ) : null}
          {industries?.hint ? <p className="stamp mt-5">{industries.hint}</p> : null}
        </div>
      </div>

      <div aria-hidden className="mt-12 h-0.5 w-full bg-ink-950/85" />

      <ul className="grid border-l border-ink-950/12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <RowPress key={item} delay={0.02 + i * 0.035}>
            <li
              className={`group border-b border-r border-ink-950/12 transition-colors duration-300 hover:bg-paper/70 ${
                i % 2 === 0 ? 'sm:border-l-0' : ''
              } ${i < 2 ? 'lg:border-l-0' : ''}`}
            >
              <p className="flex items-center gap-3 px-5 py-4">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 shrink-0 border border-ink-950/40 transition-colors duration-300 group-hover:border-accent-500 group-hover:bg-accent-500"
                />
                <span className="w-narrow text-[15px] font-semibold text-ink-900">{item}</span>
              </p>
            </li>
          </RowPress>
        ))}
      </ul>
    </SheetBlock>
  );
}
