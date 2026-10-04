import { ActivityTerrain } from '@/components/graphics/activity-terrain';
import { Band, BandHead, DEEP, PAPER } from '@/components/layout/band';
import { Reveal } from '@/lib/motion/reveal';
import type { BeliefSection } from '@/lib/content/types';

/**
 * Belief — the philosophy, demonstrated rather than stated.
 *
 * The intro states the position (data as competitive edge); the activity
 * terrain beneath it is the proof of work — a live 3D readout of when
 * customers actually convert, with the same numbers available as a table for
 * assistive tech. All copy and metric config arrive from the content layer.
 *
 * The frame is unchanged: the page's last resolve, near-black ground
 * dissolving into warm stock, the net running here in ink rather than light.
 */
/** Routes cross from the intro into the terrain card. */
const NODES = [
  { x: 0.0, y: 0.2 },
  { x: 0.4, y: 0.32 },
  { x: 0.0, y: 0.62 },
  { x: 0.62, y: 0.6 },
  { x: 0.0, y: 0.91 },
];
export function Belief({ belief }: { belief?: BeliefSection }) {
  return (
    <Band
      id="belief"
      ground="paper"
      resolve={{ from: DEEP, to: PAPER, height: 236, cell: 21 }}
      mesh={{ seed: 19, count: 4, depth: 26, opacity: 0.5, tone: 'plate', anchors: NODES }}
    >
      <BandHead>{belief?.eyebrow}</BandHead>

      <div className="mt-10 max-w-2xl">
        <Reveal>
          <h2 className="text-3xl font-medium leading-[1.1] tracking-tight text-ink-950 md:text-5xl">
            {belief?.headline} <span className="text-accent-600">{belief?.headlineAccent}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="body body--paper mt-5 text-sm md:text-base">{belief?.lede}</p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mx-auto mt-10 w-full max-w-5xl md:mt-12">
        {belief?.terrain ? (
          <div
            className="rounded-2xl border border-ink-950/10 bg-paper-50 p-5 md:p-7"
            style={{ boxShadow: '0 20px 60px rgb(var(--color-primary-600) / 0.10)' }}
          >
            <ActivityTerrain data={belief.terrain} id="belief-terrain" />
          </div>
        ) : null}
      </Reveal>
    </Band>
  );
}
