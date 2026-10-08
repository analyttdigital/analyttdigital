import { Band, BandHead } from '@/components/layout/band';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { PathFlowSection, type FlowVariant } from '@/components/graphics/path-flow-section';
import { MdiIcon, capabilityIcons } from '@/lib/icons/resolve-icon';
import type { CapabilitiesSection } from '@/lib/content/types';

/**
 * Capabilities — one horizontal pathflow per service.
 *
 * Each entry rides its own `PathFlowSection`, alternating through the
 * horizontal route shapes (`edges-converge` → `cross-flow` →
 * `staircase-ltr` → `staircase-rtl`) so no two consecutive traces run the
 * same way. The flow's title is the entry's own icon + tag + depth + title,
 * set as a ruled header above the trace; the lone body card docks at the
 * slot where that route's travel ends (`slotOffset`), so the trace field
 * reads between the header and the content. Flows are stacked with ample vertical spacing so each trace
 * gets its own scroll ride and the ember trail re-fires per entry. Trail
 * reuses the brand token rather than the component's blue default. Nodes
 * are flat plates — square, no shadows.
 *
 * Content shape is unchanged: `tag / depth / title / body / icon` per item.
 * The lede sentence below is pre-existing copy carried over verbatim.
 */

/** One distinct horizontal route per entry, in order. `offset` docks the lone
 *  body card at the slot where that route's travel ends — the traces converge
 *  onto the content — so the trace field reads between the header above and
 *  the card: edges-converge arrives bottom-centre (slot 2), cross-flow
 *  bottom-right (slot 4), both staircases bottom-corner (slot 3). */
const FLOWS: { variant: FlowVariant; offset: number }[] = [
  { variant: 'edges-converge', offset: 2 },
  { variant: 'cross-flow', offset: 4 },
  { variant: 'staircase-ltr', offset: 3 },
  { variant: 'staircase-rtl', offset: 3 },
];
export function Capabilities({ capabilities }: { capabilities?: CapabilitiesSection }) {
  const items = capabilities?.items ?? [];

  return (
		<Band id="capabilities" ground="paper">
			<div className="mx-auto w-full max-w-5xl px-6">
				<BandHead>{capabilities?.eyebrow ?? "Our services"}</BandHead>
				<InViewTitle
					text={(capabilities?.headline ?? "").replace(/\n/g, " ")}
					lines={(capabilities?.headline ?? "").split("\n")}
					variant="line"
					as="h2"
					className="title text-[clamp(2.05rem,4.4vw,3.4rem)] mt-6 text-ink-950"
				/>
				<p className="body body--paper body--sm mt-6 max-w-[42ch]">
					Four things we are hired for, and the order they happen in.
				</p>
			</div>

			<div className="flex flex-col gap-20 py-14 md:gap-28 md:py-20">
				{items.map((item, i) => {
					const flow = FLOWS[i % FLOWS.length];
					return (
					<PathFlowSection
						key={item.title}
						variant={flow.variant}
						slotOffset={flow.offset}
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
								<div className="flex items-center gap-4">
									<span
										aria-hidden
										className="grid h-10 w-10 shrink-0 place-items-center text-ink-800"
									>
										<MdiIcon
											name={item.icon || capabilityIcons[i % capabilityIcons.length]}
											size={0.85}
										/>
									</span>
									<span className="num text-[15px] text-accent-700">
										{item.depth ?? String(i + 1).padStart(2, "0")}
									</span>
									<span className="border border-accent/10 py-1 px-4 text-xs text-accent-400 rounded-full">
										{item.tag}
									</span>
									<span aria-hidden className="hairline h-px min-w-0 flex-1" />
								</div>
								<h3 className="verb mt-5 max-w-[28ch] text-[clamp(1.5rem,2.8vw,2rem)] text-ink-950">
									{item.title}
								</h3>
							</div>
						}
					>
						<article
							key={item.title}
							aria-label={`${item.depth ?? String(i + 1).padStart(2, "0")} — ${item.title}`}
							className="p-6 md:p-7"
						>
							<p className="body body--paper body--sm max-w-[58ch]">{item.body}</p>
						</article>
					</PathFlowSection>
					);
				})}
			</div>

			<p className="mx-auto mt-2 w-full max-w-5xl px-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink-800">
				Read top to bottom — the engagement runs in this order.
			</p>
		</Band>
  );
}
