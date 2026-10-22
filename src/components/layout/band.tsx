import type { ReactNode } from 'react';

import { PixelDither } from '@/components/ui/pixel-dither';
import { TraceField, type Anchor } from '@/components/ui/trace-field';
import { MaskedLine } from '@/lib/motion/reveal';

/**
 * Band — the frame every section is imposed into.
 *
 * The page is a routed path laid over three grounds: the field (where most of
 * the argument lives), the deep band (where it argues), and the paper bands.
 * Nothing is boxed and nothing is bordered: a band is a change of ground, and
 * where the ground changes the signal has to cross.
 *
 * It crosses two ways. At three moments on the page — the arrival, the
 * descent into the argument, and the inversion to paper — it *resolves*: an
 * ordered dither of large pixels instead of a cut line. Everywhere else the
 * join is a `seam`: one hairline with a packet running along it, so the
 * transition is still routed and still deliberate, and the resolve stays rare
 * enough to mean something.
 *
 * `resolve.from` is the ground the reader is leaving, `resolve.to` the one
 * they are entering; the dither canvas paints both, so the join is seamless.
 * Only three bands carry a resolve — the arrival, the inversion into the
 * belief, and the turn into the footer. Every other ground change is a clean
 * cut, because a resolve on every seam would stop being an event.
 * `mesh` is this band's slice of the trace network, routed between the
 * components named in its anchors.
 */

export type Ground = 'field' | 'deep' | 'paper';

const GROUND_CLASS: Record<Ground, string> = {
  field: 'ground text-primary-100',
  deep: 'ground--deep text-primary-100',
  paper: 'ground--paper text-ink-900',
};

export type ResolveInto = {
  from: string;
  to: string;
  height?: number;
  cut?: number;
  flip?: boolean;
  /** Amplitude of the threshold matrix, in band heights. */
  spread?: number;
  /** Side of the authored pixel, in CSS px. */
  cell?: number;
};

export type Mesh = {
  seed: number;
  count?: number;
  depth?: number;
  opacity?: number;
  frame?: number;
  tone?: 'dark' | 'plate';
  /** Points the routes terminate on, normalised to the content column. */
  anchors: Anchor[];
};

export const DEEP = '--color-primary-950';
export const FIELD = '--color-primary-700';
export const PAPER = '--color-paper-100';

export function Band({
  id,
  ground = 'field',
  resolve,
  mesh,
  children,
  className,
}: {
  id?: string;
  ground?: Ground;
  /** The resolve band that carries this section's ground change. */
  resolve?: ResolveInto;
  /** This band's slice of the trace network. */
  mesh?: Mesh;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative ${id ? 'scroll-mt-24' : ''} ${GROUND_CLASS[ground]}`}
    >
      {resolve ? (
        <PixelDither
          from={resolve.from}
          to={resolve.to}
          height={resolve.height ?? 232}
          cut={resolve.cut ?? 0.5}
          flip={resolve.flip ?? false}
          spread={resolve.spread ?? 0.8}
          cell={resolve.cell ?? 21}
        />
      ) : (
        <div aria-hidden className="seam" />
      )}

      {/*mesh ? (
        <TraceField
          seed={mesh.seed}
          count={mesh.count ?? 5}
          depth={mesh.depth ?? 40}
          opacity={mesh.opacity ?? 1}
          frame={mesh.frame ?? 0.94}
          tone={mesh.tone ?? 'dark'}
          anchors={mesh.anchors}
        />
      ) : null */}

      <div className={`relative px-5 md:px-8 ${className ?? ''}`}>
        <div className="mx-auto w-full max-w-[1360px] py-14 md:py-20">{children}</div>
      </div>
    </section>
  );
}

/** The section head: a square-bullet mono label with a hairline running out
 *  of it to the right margin. Inherits the band's colour, so it inverts with
 *  the ground. */
export function BandHead({
  children,
  className,
  center = false,
}: {
  children: ReactNode;
  className?: string;
  /** Rule either side of the label, so it sits on the band's centre line. */
  center?: boolean;
}) {
  if (center) {
    return (
      <div className={`flex items-center gap-5 ${className ?? ''}`}>
        <span aria-hidden className="hairline h-px min-w-0 flex-1" />
        <span className="label label--live shrink-0">{children}</span>
        <span aria-hidden className="hairline h-px min-w-0 flex-1" />
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-5 ${className ?? ''}`}>
      <span className="label label--live shrink-0">{children}</span>
      <span aria-hidden className="hairline min-w-0 flex-1" />
    </div>
  );
}

/** The statement a band makes. Display face, light, lines rising in sequence. */
export function BandTitle({
  lines,
  delay = 0,
  size = 'lg',
  className,
}: {
  lines: string;
  delay?: number;
  size?: 'lg' | 'md' | 'sm';
  className?: string;
}) {
  const list = String(lines).split('\n');
  const scale =
    size === 'lg'
      ? 'text-[clamp(2.05rem,4.4vw,3.4rem)]'
      : size === 'md'
        ? 'text-[clamp(1.7rem,3.2vw,2.5rem)]'
        : 'text-[clamp(1.3rem,2.2vw,1.7rem)]';
  return (
    <h2 className={`title ${scale} ${className ?? ''}`}>
      {list.map((line, i) => (
        <MaskedLine key={`${line}-${i}`} delay={delay + i * 0.08}>
          {line || ' '}
        </MaskedLine>
      ))}
    </h2>
  );
}