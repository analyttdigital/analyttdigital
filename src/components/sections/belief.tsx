import { SheetBlock, SheetTitle } from '@/components/layout/sheet-block';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { Reveal, RuleDraw } from '@/lib/motion/reveal';
import type { BeliefSection } from '@/lib/content/types';

/**
 * Belief — the sheet's commitments, as ruled ledger rows.
 *
 * Three rows across the type area: a stamped mark, the commitment, and the
 * mechanism that makes it true in the margin column. No cards, no icons in
 * circles — the mark is a debossed stamp pressed into the stock, and the
 * rules between rows are the only structure. The strip label closes the
 * block as the sheet's colophon line.
 */
export function Belief({ belief }: { belief?: BeliefSection }) {
  const points = belief?.points ?? [];

  return (
    <SheetBlock id="belief" folio="03" head={belief?.eyebrow} tone="a">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <SheetTitle lines={belief?.headline ?? ''} delay={0.1} />
        {belief?.stripLabel ? (
          <Reveal delay={0.2}>
            <p className="stamp stamp--spot lg:justify-self-end">{belief.stripLabel}</p>
          </Reveal>
        ) : null}
      </div>

      <RuleDraw className="mt-12" delay={0.26}>
        <div className="h-0.5 w-full bg-ink-950/85" />
      </RuleDraw>

      <div className="mt-2">
        {points.map((point, i) => (
          <Reveal key={point.title} delay={0.12 + i * 0.09}>
            <article className="group grid items-start gap-x-10 gap-y-3 border-b border-ink-950/12 py-8 transition-colors duration-300 hover:bg-paper/70 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,0.82fr)] lg:py-9">
              <span
                aria-hidden
                className="press-mark flex h-11 w-11 items-center justify-center rounded-[2px] text-ink-700 transition-colors duration-300 group-hover:text-accent-600"
              >
                <MdiIcon name={point.icon || 'crosshairs'} size={1} />
              </span>

              <h3 className="sheet-verb text-[clamp(1.35rem,2.4vw,1.9rem)] text-ink-950">
                {point.title}
              </h3>

              <p className="body-copy max-w-[46ch] text-[15px]">{point.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SheetBlock>
  );
}
