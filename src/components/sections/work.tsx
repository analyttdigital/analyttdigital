import { Band, BandHead, BandTitle } from '@/components/layout/band';
import { PathFlowSection } from '@/components/graphics/path-flow-section';
import { MediaSlot } from '@/components/media/dynamic-image';
import { CountUp } from '@/lib/motion/counter';
import { useChrome } from '@/lib/content/chrome';
import type { WorkSection } from '@/lib/content/types';

/**
 * Work — the proof as nodes on a routed path.
 *
 * Path-flow rebuild (Oct 2026, per owner sign-off): the four cases ride
 * `PathFlowSection` in its `rail` layout — a two-up grid in normal document
 * flow, so the tall media plates can never overlap, with a switchback spine
 * routed through their measured positions. Trail is scroll-driven with glow +
 * head; the ember trail reuses the brand token rather than the component's
 * blue default. Nodes are flat `panel--paper` plates — square, no shadows —
 * each with its media slot, so the four empty mounts travel the path with
 * their figures.
 *
 * Content shape is unchanged: `client / industry / depth / headline / body /
 * metric / metricLabel / image` per case. Figures are the content's own real
 * numbers, carried over untouched.
 */
export function Work({ work }: { work?: WorkSection }) {
  const cases = work?.cases ?? [];
  const chrome = useChrome();

  return (
    <Band id="work" ground="paper">
      <PathFlowSection
        layout="rail"
        mode="scroll"
        color="rgb(var(--color-ink-950))"
        trailColor="rgb(var(--color-accent-500))"
        trailLength={0.14}
        strokeWidth={1.5}
        glow={true}
        head={true}
        rails={true}
        revealItems={true}
        header={
          <div>
            <BandHead>{work?.eyebrow ?? 'Selected work'}</BandHead>
            <BandTitle lines={work?.headline ?? ''} delay={0.06} size="lg" className="mt-6 text-ink-950" />
            <p className="body body--paper body--sm mt-6 max-w-[38ch]">{chrome.workNote}</p>
          </div>
        }
      >
        {cases.map((kase) => (
          <article key={kase.client} aria-label={`${kase.depth ?? kase.client} — ${kase.headline}`} className="panel--paper">
            <MediaSlot image={kase.image} icon="chartBox" label={kase.client} tone="paper" className="aspect-[16/9] w-full" />
            <div className="flex flex-col p-6 md:p-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-800">
                <span className="text-accent-700">{kase.depth ?? kase.client}</span>
                <span aria-hidden className="text-ink-800/40">/</span>
                <span>{kase.industry}</span>
              </div>
              <p className="mt-4 text-[15px] font-medium text-ink-900">{kase.client}</p>
              <h3 className="verb mt-3 max-w-[30ch] text-[clamp(1.2rem,2vw,1.5rem)] text-ink-950">
                {kase.headline}
              </h3>
              <p className="body body--paper body--sm mt-3 max-w-[56ch]">{kase.body}</p>
              <div className="mt-6">
                <CountUp
                  value={kase.metric}
                  className="num block text-[clamp(2.4rem,4.4vw,3.4rem)] text-accent-700"
                />
                <span className="mt-3 block max-w-[26ch] font-mono text-[10.5px] font-medium uppercase leading-relaxed tracking-[0.16em] text-ink-800">
                  {kase.metricLabel}
                </span>
              </div>
            </div>
          </article>
        ))}
      </PathFlowSection>
    </Band>
  );
}
