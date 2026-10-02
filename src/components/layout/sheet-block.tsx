import type { ReactNode } from 'react';

import { MaskedLine, RuleDraw } from '@/lib/motion/reveal';

/**
 * Sheet furniture — the frame every section is imposed into.
 *
 * A printed sheet is not a stack of boxes. Each block is a band of stock,
 * separated from the last by a hairline rule that carries the section's own
 * head and folio set into it, the way a broadsheet runs a head across its
 * column rule. There is no card chrome anywhere in this system: content
 * sits directly on the stock, and the contour field reads through behind it.
 *
 * `tone` selects the stock. Alternating tones between blocks is the only
 * device that separates sections — the discipline the sheet inherited from
 * stage lighting, where tone does the work a drawn rule would otherwise do.
 */

export type SheetTone = 'a' | 'b' | 'c' | 'spot' | 'ink';

const toneClass: Record<SheetTone, string> = {
  a: 'stock',
  b: 'stock stock--b',
  c: 'stock stock--c',
  spot: 'bg-accent-700 text-paper',
  ink: 'bg-ink-950 text-paper',
};

export function SheetBlock({
  id,
  folio,
  head,
  tone = 'a',
  children,
  className,
}: {
  id: string;
  /** Sheet folio — where this block sits on the sheet. */
  folio: string;
  /** The section head, set into the rule. Content's own eyebrow lives here. */
  head?: string;
  tone?: SheetTone;
  children: ReactNode;
  className?: string;
}) {
  const inverse = tone === 'spot' || tone === 'ink';

  return (
    <section
      id={id}
      data-sheet-block=""
      data-sheet-head={head}
      className={`relative scroll-mt-20 px-4 md:px-6 ${toneClass[tone]} ${className ?? ''}`}
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="flex items-center gap-4 pt-10 md:pt-14">
          <span className={`folio ${inverse ? 'folio--inverse' : ''}`}>{folio}</span>
          {head ? (
            <span className={`sheet-head ${inverse ? 'sheet-head--inverse' : ''}`}>{head}</span>
          ) : null}
          <span className="min-w-0 flex-1">
            <RuleDraw
              className={inverse ? 'h-px w-full bg-paper/25' : 'h-px w-full bg-ink-950/15'}
              delay={0.05}
            />
          </span>
        </div>

        <div className="py-14 md:py-20">{children}</div>
      </div>
    </section>
  );
}

/** Section headline — set as a chart masthead, balanced, with lines rising. */
export function SheetTitle({
  lines,
  className,
  delay = 0,
  size = 'lg',
}: {
  lines: string | string[];
  className?: string;
  delay?: number;
  size?: 'lg' | 'md';
}) {
  const list = Array.isArray(lines) ? lines : String(lines).split('\n');
  return (
    <h2
      className={`sheet-title ${size === 'lg' ? 'text-[clamp(2.05rem,4.6vw,3.4rem)]' : 'text-[clamp(1.7rem,3.4vw,2.5rem)]'} ${
        className ?? ''
      }`}
    >
      {list.map((line, i) => (
        <MaskedLine key={`${line}-${i}`} delay={delay + i * 0.09}>
          {line || ' '}
        </MaskedLine>
      ))}
    </h2>
  );
}

/** A marginal note — the sheet's side column, set small and true. */
export function MarginNote({
  children,
  className,
  head,
}: {
  children: ReactNode;
  className?: string;
  head?: string;
}) {
  return (
    <div className={className}>
      {head ? <p className="sheet-head mb-3">{head}</p> : null}
      <div className="margin-note">{children}</div>
    </div>
  );
}

/** Column head for the sheet's ledgers and tables. */
export function ColumnHead({
  children,
  align = 'left',
  className,
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}) {
  return (
    <p
      className={`sheet-head ${align === 'right' ? 'text-right' : ''} ${className ?? ''}`}
    >
      {children}
    </p>
  );
}
