import { Band, BandHead, BandTitle, DEEP, PAPER } from '@/components/layout/band';
import { MediaSlot } from '@/components/media/dynamic-image';
import { NodeIn, PanelIn, Reveal } from '@/lib/motion/reveal';
import type { BeliefSection } from '@/lib/content/types';

/**
 * Belief — the commitments, as a numbered instrument readout.
 *
 * Three rows, each opened by a solid square badge carrying its number, then
 * the commitment and the mechanism that makes it true. No cards and no icons:
 * the number is the mark, because in this world the sequence is the argument.
 * The plate beside it is the one place on this band where media belongs, and
 * it stands empty until the client supplies the image.
 *
 * The third and last resolve of the page: near-black ground dissolving into
 * warm stock, the inversion the whole deep half of the route has been walking
 * toward. The net runs here in ink rather than light, wired from the plate to
 * the readout.
 */
/** Plate on the left, readout on the right, routes crossing the gutter. */
const NODES = [
  { x: 0.0, y: 0.34 },
  { x: 0.12, y: 0.45 },
  { x: 0.0, y: 0.72 },
  { x: 0.46, y: 0.45 },
  { x: 0.46, y: 0.82 },
];
export function Belief({ belief }: { belief?: BeliefSection }) {
  const points = belief?.points ?? [];

  return (
    <Band
      id="belief"
      ground="paper"
      resolve={{ from: DEEP, to: PAPER, height: 236, cell: 21 }}
      mesh={{ seed: 19, count: 4, depth: 26, opacity: 0.5, tone: 'plate', anchors: NODES }}
    >
      <BandHead>{belief?.eyebrow}</BandHead>

      <div className="mt-10 grid gap-x-14 gap-y-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <div>
          <BandTitle lines={belief?.headline ?? ''} className="max-w-[14ch]" />

          <PanelIn from="bottom" distance={5} delay={0.22}>
            <MediaSlot className="mt-10 aspect-[16/9] w-full" tone="paper" icon="image" />
          </PanelIn>

          {belief?.stripLabel ? (
            <Reveal delay={0.3}>
              <p className="label label--plate mt-5">{belief.stripLabel}</p>
            </Reveal>
          ) : null}
        </div>

        <ol className="panel--paper p-7 md:p-10">
          {points.map((point, i) => (
            <NodeIn
              as="li"
              key={point.title}
              delay={0.1 + i * 0.09}
              className={`grid gap-x-6 gap-y-4 sm:grid-cols-[3rem_minmax(0,1fr)] ${
                i > 0 ? 'mt-8 border-t border-ink-950/10 pt-8' : ''
              }`}
            >
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center bg-primary-800 text-[13px] font-medium text-primary-50"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="verb text-[clamp(1.2rem,2vw,1.55rem)] text-ink-950">{point.title}</h3>
                <p className="body body--paper body--sm mt-3 max-w-[52ch]">{point.body}</p>
              </div>
            </NodeIn>
          ))}
        </ol>
      </div>
    </Band>
  );
}