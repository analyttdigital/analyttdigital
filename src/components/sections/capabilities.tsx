import { Band, BandHead } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { PathFlowSection } from '@/components/graphics/path-flow-section';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — the services as nodes on a routed path.
 *
 * Path-flow rebuild (Oct 2026, per owner sign-off): the four services ride
 * `PathFlowSection` in its `rail` layout — a two-up grid in normal document
 * flow, so no panel can ever overlap another, with a switchback spine routed
 * through their measured positions. Trail is scroll-driven with glow + head;
 * the ember trail reuses the brand token rather than the component's blue
 * default. Nodes are flat `panel--paper` plates — square, no shadows — so the
 * flow carries the composition and the tokens carry the colour.
 *
 * Content shape is unchanged: `tag / depth / title / body / icon` per item.
 * The lede sentence below is pre-existing copy carried over verbatim.
 */
export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
    <Band id="capabilities" ground="paper">
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
            <BandHead>{capabilities?.eyebrow ?? 'Our services'}</BandHead>
            <InViewTitle text={(capabilities?.headline ?? '').replace(/\n/g, " ")} lines={(capabilities?.headline ?? '').split('\n')} variant="line" as="h2" className="title text-[clamp(2.05rem,4.4vw,3.4rem)] mt-6 text-ink-950" />
            <p className="body body--paper body--sm mt-6 max-w-[42ch]">
              Four things we are hired for, and the order they happen in.
            </p>
          </div>
        }
      >
        {items.map((item, i) => (
          <article key={item.title} aria-label={`${item.depth ?? String(i + 1).padStart(2, '0')} — ${item.title}`} className="panel--paper p-6 md:p-7">
            <div className="flex items-center gap-4">
              <span className="num text-[15px] text-accent-700">
                {item.depth ?? String(i + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden
                className="grid h-10 w-10 place-items-center text-ink-800"
                style={{ boxShadow: 'inset 0 0 0 1px rgb(var(--color-ink-950) / 0.2)' }}
              >
                <MdiIcon name={item.icon || capabilityIcons[i % capabilityIcons.length]} size={0.85} />
              </span>
              <span className="chip chip--paper ml-auto">{item.tag}</span>
            </div>
            <h3 className="verb mt-5 max-w-[28ch] text-[clamp(1.25rem,2.2vw,1.65rem)] text-ink-950">
              {item.title}
            </h3>
            <p className="body body--paper body--sm mt-3 max-w-[58ch]">{item.body}</p>
          </article>
        ))}
      </PathFlowSection>

      <p className="mx-auto mt-2 w-full max-w-5xl px-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-800">
        Read top to bottom — the engagement runs in this order.
      </p>
    </Band>
  );
}
