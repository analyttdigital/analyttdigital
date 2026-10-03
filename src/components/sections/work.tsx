import { Band, BandHead, BandTitle } from '@/components/layout/band';
import { MediaSlot } from '@/components/media/dynamic-image';
import { CountUp } from '@/lib/motion/counter';
import { NodeIn, Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { WorkCase, WorkSection } from '@/lib/content/types';

/**
 * Work — four results, four plates.
 *
 * Each engagement prints as one panel: the plate at the top (empty, awaiting
 * artwork), then who it was and in what sector, the result in a sentence, and
 * the figure set large enough to read from across the room. Client names are
 * withheld pending permission, so the section says exactly that underneath
 * rather than implying these are cleared case studies.
 *
 * One net across the band, routed panel to panel, so the four results are
 * wired to each other rather than sitting in four separate boxes.
 */
/** One pad per case panel, on its edge — see capabilities. */
const NODES = [
  { x: 0.0, y: 0.04 },
  { x: 0.22, y: 0.08 },
  { x: 0.0, y: 0.31 },
  { x: 0.5, y: 0.31 },
  { x: 1.0, y: 0.31 },
  { x: 0.0, y: 0.7 },
  { x: 0.5, y: 0.7 },
  { x: 1.0, y: 0.7 },
];

export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];
  const chrome = useChrome();

  return (
    <Band id="work" ground="field" mesh={{ seed: 41, count: 6, depth: 42, opacity: 0.5, anchors: NODES }}>
      <BandHead>{work?.eyebrow}</BandHead>

      <div className="mt-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <BandTitle lines={work?.headline ?? ''} />
        <Reveal delay={0.16}>
          <p className="body body--sm max-w-[32ch] text-primary-300">{chrome.workNote}</p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {cases.map((kase, i) => (
          <CasePanel key={kase.client} kase={kase} index={i} />
        ))}
      </div>
    </Band>
  );
}

function CasePanel({ kase, index }: { kase: WorkCase; index: number }) {
  return (
    <NodeIn delay={0.06 + index * 0.07}>
      <article className="panel group flex h-full flex-col transition-colors duration-300 hover:bg-primary-500">
        <MediaSlot
          image={kase.image}
          icon="chartBox"
          label={kase.client}
          className="aspect-[16/10] w-full"
        />

        <div className="flex flex-1 flex-col p-7 md:p-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="chip chip--ember">{kase.depth ?? `Case ${String(index + 1).padStart(2, '0')}`}</span>
            <span className="label">{kase.industry}</span>
          </div>

          <p className="mt-6 text-[17px] font-medium text-primary-50">{kase.client}</p>

          <h3 className="verb mt-4 text-[clamp(1.2rem,2vw,1.5rem)] text-primary-50">
            {kase.headline}
          </h3>
          <p className="body body--sm mt-4 max-w-[50ch]">{kase.body}</p>

          <div className="mt-8 border-t border-primary-50/14 pt-6">
            <CountUp
              value={kase.metric}
              className="num block text-[clamp(2.4rem,4.4vw,3.4rem)] text-primary-50 transition-colors duration-300 group-hover:text-accent-400"
            />
            <span className="label mt-4 block max-w-[26ch] leading-relaxed">{kase.metricLabel}</span>
          </div>
        </div>
      </article>
    </NodeIn>
  );
}