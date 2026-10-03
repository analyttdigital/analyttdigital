import { Band, BandHead, BandTitle } from '@/components/layout/band';
import { PanelIn } from '@/lib/motion/reveal';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — the services, as four panels on the deep band.
 *
 * Each panel is one step lighter than the band it sits on, carries a tag chip,
 * and holds its own copy. Depth numerals sit in the corner the way a
 * directory's column numbers do. No icons in circles: the chip is the mark.
 *
 * The trace net runs once across the whole band, not once inside each card —
 * four little nets at card scale were fragments, not wiring. These routes come
 * in past the head, land on each panel in turn, and leave the other side, so
 * the four services read as four nodes on one route.
 */
/** One pad per panel, on the panel's own edge: 0 and 1 are the column
 *  edges, 0.5 is the gutter between them. Nothing terminates inside an opaque
 *  panel, because a pad behind a panel is a pad nobody sees. */
const NODES = [
  { x: 0.0, y: 0.09 },
  { x: 0.2, y: 0.18 },
  { x: 0.0, y: 0.46 },
  { x: 0.5, y: 0.46 },
  { x: 1.0, y: 0.46 },
  { x: 0.0, y: 0.78 },
  { x: 0.5, y: 0.78 },
  { x: 1.0, y: 0.78 },
];

export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
    <Band
      id="capabilities"
      ground="deep"
      mesh={{ seed: 31, count: 6, depth: 44, opacity: 0.55, anchors: NODES }}
    >
      <BandHead>{capabilities?.eyebrow}</BandHead>

      <div className="mt-10 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
        <BandTitle lines={capabilities?.headline ?? ''} />
        <p className="body body--sm max-w-[42ch] lg:justify-self-end">
          Four things we are hired for, and the order they happen in.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {items.map((item, i) => (
          <PanelIn key={item.title} from={i % 2 === 0 ? 'left' : 'bottom'} distance={4} delay={0.08 + i * 0.07}>
            <article className="panel--deep group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-surface-700 md:p-9">
              <div className="flex items-start justify-between gap-6">
                <span className="chip">{item.tag}</span>
                <span className="num text-[24px] text-primary-50/25 transition-colors duration-300 group-hover:text-accent-500">
                  {item.depth ?? String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="mt-auto pt-16">
                <h3 className="verb max-w-[20ch] text-[clamp(1.3rem,2.2vw,1.7rem)] text-primary-50">
                  {item.title}
                </h3>
                <p className="body body--sm mt-4 max-w-[44ch] text-primary-200">{item.body}</p>
              </div>
            </article>
          </PanelIn>
        ))}
      </div>
    </Band>
  );
}