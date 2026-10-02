import { SheetBlock, SheetTitle } from '@/components/layout/sheet-block';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { Impression } from '@/lib/motion/reveal';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — the one colour field on the sheet.
 *
 * Services are printed as a directory, not as cards: four cells divided by
 * rules on the spot-colour band, each with its tag set as a column head, its
 * title large, and its mechanism in the margin. Depth numerals sit in the
 * corner the way a directory's column numbers do. This is the only block that
 * floods with colour — the sheet spends the spot colour once, here, and
 * everywhere else it appears only on a live mark.
 */
export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
    <SheetBlock id="capabilities" folio="05" head={capabilities?.eyebrow} tone="spot">
      <SheetTitle lines={capabilities?.headline ?? ''} delay={0.1} className="max-w-[20ch]" />

      <div aria-hidden className="mt-10 h-0.5 w-full bg-paper/70" />

      <div className="mt-0 grid sm:grid-cols-2">
        {items.map((item, i) => (
          <Impression
            key={item.title}
            delay={0.1 + i * 0.08}
            from={i % 2 === 0 ? 'left' : 'center'}
            className="border-b border-paper/30 sm:[&:nth-child(odd)]:border-l sm:[&:nth-child(odd)]:border-paper/30"
          >
            <article className="group relative h-full px-1 py-9 transition-colors duration-300 hover:bg-paper/10 sm:px-8 sm:py-11">
              <div className="flex items-start justify-between gap-6">
                <p className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-paper/15 text-paper transition-colors duration-300 group-hover:bg-accent-500"
                  >
                    <MdiIcon name={item.icon || 'bullhorn'} size={0.8} />
                  </span>
                  <span className="w-narrow text-[11px] font-bold uppercase tracking-[0.16em] text-paper/85">
                    {item.tag}
                  </span>
                </p>
                <span
                  aria-hidden
                  className="figure text-[26px] text-paper/35 transition-colors duration-300 group-hover:text-paper/70"
                >
                  {item.depth ?? String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="sheet-verb mt-7 text-[clamp(1.35rem,2.3vw,1.85rem)] text-paper">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.6] text-paper/85">{item.body}</p>
            </article>
          </Impression>
        ))}
      </div>
    </SheetBlock>
  );
}
