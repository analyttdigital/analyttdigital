import { InViewTitle } from '@/components/graphics/in-view-title';
import { GlowButton } from '@/components/graphics/glow-button';
import { MdiIcon, processStepIcons } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { Reveal } from '@/lib/motion/reveal';
import type { DataProps, ProcessSection } from '@/lib/content/types';

/**
 * ProcessChapter — the engagement as a ruled step index.
 *
 * Static by design: every step is visible at once (ember numeral, title,
 * desc, chips over hairlines), so the reader scans the engagement
 * top-to-bottom with nothing gated on scroll progress or interaction. Same
 * `data` + `classes` contract as the other bands; per-step copy is
 * content-editable, the watermark is one faint positional MDI glyph per row
 * (`processStepIcons`, same convention as the capability/stat defaults).
 * The closing ask reads on as its own band (`ProcessClosing`); the page's
 * `cta-banner` block renders standalone next to it.
 */
export function ProcessChapter({
	data,
	classes,
	className,
	id,
}: DataProps<ProcessSection, 'rows' | 'row' | 'head'>) {
	const steps = data?.steps ?? [];

	return (
		<section id={id ?? 'process'} className={`relative overflow-hidden bg-paper py-16 md:py-28 ${className ?? ''}`}>
			<div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
				<GsapReveal>
					{/* Head: eyebrow + display headline left, lede + instrument
					    caption right — heads and readouts bottom-aligned. */}
					<div className={['flex flex-wrap items-end justify-between gap-8', classes?.head]
						.filter(Boolean)
						.join(' ')}
					>
						<div data-rise>
							<p className="label text-ink-500">{data?.eyebrow}</p>
							<InViewTitle
								text={`${data?.headline ?? ''} ${data?.headlineAccent ?? ''}`.replace(/\n/g, ' ').trim()}
								variant="blur"
								as="h2"
								className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
							/>
						</div>
						{data?.lede || data?.cardTitle ? (
							<div data-rise="1" className="max-w-[52ch]">
								{data?.lede ? (
									<p className="text-sm leading-[1.85] text-ink-500">{data.lede}</p>
								) : null}
								{data?.cardTitle ? (
									<p className="label label--plain mt-4 text-ink-400">
										{data.cardTitle} · {String(steps.length).padStart(2, '0')}
									</p>
								) : null}
							</div>
						) : null}
					</div>

					{steps.length > 0 ? (
						<ol
							className={['mt-12 border-t border-ink-950/10', classes?.rows]
								.filter(Boolean)
								.join(' ')}
						>
							{steps.map((step, i) => (
								<li
									key={step.n || i}
									data-rise={Math.min(i + 1, 3)}
									className={`group relative grid gap-3 overflow-hidden border-b border-ink-950/10 py-7 transition-colors duration-200 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-10 md:gap-y-0 md:py-9 ${classes?.row ?? ''}`}
								>
									{/* Watermark — one faint glyph per position, bottom-right. */}
									<MdiIcon
										name={processStepIcons[i % processStepIcons.length]}
										size={5}
										className="pointer-events-none absolute -bottom-2 -right-1 select-none text-ink-950/[0.05] md:-bottom-4 md:-right-2"
									/>
									<div className="flex items-baseline gap-4 md:block">
										<span className="num text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none text-accent-500 transition-colors duration-200 group-hover:text-accent-600">
											{step.n}
										</span>
										<h3 className="verb text-[clamp(1.35rem,2.2vw,1.9rem)] text-ink-950 md:mt-3">
											{step.title}
										</h3>
									</div>
									<div>
										<p className="max-w-[64ch] text-sm leading-[1.85] text-ink-500 md:text-[15px]">
											{step.desc}
										</p>
										{step.chips?.length ? (
											<ul className="mt-5 flex flex-wrap gap-2">
												{step.chips.map((chip) => (
													<li
														key={chip}
														className="rounded-full border border-ink-950/15 px-4 py-1 text-xs text-ink-700"
													>
														{chip}
													</li>
												))}
											</ul>
										) : null}
									</div>
								</li>
							))}
						</ol>
					) : null}
				</GsapReveal>
			</div>
		</section>
	);
}

/** Process closing row — the audit ask after the steps. Rendered after the
 *  chapter (see `section-renderer.tsx`) so it reads on as its own band
 *  instead of squeezing in beside the steps. */
export function ProcessClosing({ process }: { process?: ProcessSection }) {
	return (
		<div className="bg-paper-50">
			{(!!process?.closing || !!process?.cta) && (
				<div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-5 px-5 py-16 md:flex-row md:items-center">
					{process?.closing && (
						<Reveal className="max-w-xl">
							<p className="body body--paper text-sm leading-relaxed">
								{process?.closing}
							</p>
						</Reveal>
					)}
					{process?.cta && (
						<Reveal delay={0.1} className="shrink-0">
							<GlowButton
								data={{ label: process?.cta ?? "", href: process?.ctaHref }}
								className="w-full sm:w-auto "
								tone="ember"
							/>
						</Reveal>
					)}
				</div>
			)}
		</div>
	);
}
