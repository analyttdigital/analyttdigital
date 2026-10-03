import { Action } from "@/components/layout/action";
import { BandHead, DEEP, FIELD } from "@/components/layout/band";
import { PixelDither } from "@/components/graphics/pixel-dither";
import { TraceField } from "@/components/graphics/trace-field";
import { SignalTrace } from "@/components/graphics/trace-recorder";
import { MaskedLine, Reveal } from "@/lib/motion/reveal";
import { useChrome } from "@/lib/content/chrome";
import type { HeroSection } from "@/lib/content/types";

/** The six things in the head the routes terminate on: the label, the
 *  statement, the action, the instrument, the figures under it, and the channel
 *  rail they all feed. Normalised to the content column, so 0 and 1 are its
 *  edges. */
const HERO_NODES = [
	{ x: 0.0, y: 0.31 },
	{ x: 0.15, y: 0.41 },
	//   { x: 0.0, y: 0.79 },
	//   { x: 0.58, y: 0.31 },
	//   { x: 0.58, y: 0.57 },
	//   { x: 0.5, y: 0.92 },
];

/**
 * Hero — the head of the route.
 *
 * Left: the statement, set light at display scale on three lines, with the
 * sub at a reading measure and the audit action beneath it. Right: the
 * demonstration — one flat panel one step lighter than the field, carrying a
 * live trace that starts as an untriggered signal and locks standing still
 * the moment tracking goes live. That behaviour is the page's proof of what
 * it sells; the caption says plainly that the figures are illustrative.
 *
 * This is the page's arrival resolve: the deep band the reader came from
 * dissolves into the field they are now in, on a coarse pixel grid, once. The
 * trace net runs behind the whole viewport, routed between the statement, the
 * instrument and the channel rail so the visitor lands inside a network they
 * can see already carrying signal.
 */
export function Hero({ hero }: { hero?: HeroSection }) {
	const chrome = useChrome();
	const lines = (hero?.headline ?? "").split("\n");
	const marquee = hero?.marquee ?? [];

	return (
		<section id="hero" className="ground relative overflow-hidden text-primary-100">
			<PixelDither from={DEEP} to={FIELD} height={196} cut={0.54} cell={2} />

			<div className="relative px-5 md:px-8">
				<div className="mx-auto w-full max-w-[1360px] pb-14 pt-[128px] md:pb-20 md:pt-[172px]">
					<div className="grid items-start gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
						{/* ---- the statement ------------------------------------- */}
						<div>
							<BandHead>{hero?.eyebrow}</BandHead>

							<h1 className="display mt-9 text-[clamp(2.85rem,7.4vw,6rem)] text-primary-50">
								{lines.map((line, i) => (
									<MaskedLine key={`${line}-${i}`} delay={0.1 + i * 0.1}>
										{line || " "}
									</MaskedLine>
								))}
							</h1>

							<Reveal delay={0.42}>
								<p className="body mt-9 max-w-[60ch] text-[17px]">{hero?.sub}</p>
							</Reveal>

							<Reveal delay={0.5}>
								<div className="mt-10 flex flex-wrap items-center gap-3">
									<Action
										href={hero?.ctaHref ?? "/#contact"}
										label={hero?.cta ?? "Start with a free audit"}
									/>
									<Action
										href="#process"
										label={hero?.scrollHint ?? "Scroll"}
										icon="arrowDown"
										variant="ghost"
									/>
								</div>
							</Reveal>
						</div>

						{/* ---- the demonstration --------------------------------- */}
						<Reveal delay={0.34}>
							<div className="panel">
								<div className="flex items-center justify-between gap-4 px-6 pb-5 pt-6">
									<p className="label">
										{hero?.dashboardTitle ?? "Campaign / Live"}
									</p>
									<p className="flex items-center gap-2.5">
										<span
											aria-hidden
											className="inline-block h-1.5 w-1.5 bg-accent-500"
										/>
										<span className="num text-[15px] text-accent-500">
											{hero?.dashboardMetric ?? "ROAS 4.2×"}
										</span>
									</p>
								</div>

								{/* instrument: an etched graticule with the trace standing on it */}
								<div className="relative mx-6 bg-primary-900/25 px-5 pb-4 pt-7">
									<svg
										aria-hidden
										viewBox="0 0 100 100"
										preserveAspectRatio="none"
										className="absolute inset-x-5 top-7 h-[132px] w-[calc(100%-2.5rem)]"
									>
										{[0, 25, 50, 75, 100].map((y) => (
											<line
												key={y}
												x1="0"
												x2="100"
												y1={y}
												y2={y}
												stroke="rgb(var(--color-primary-50) / 0.1)"
												strokeWidth="1"
												vectorEffect="non-scaling-stroke"
											/>
										))}
									</svg>
									<SignalTrace className="relative h-[132px] w-full" />
									<div className="mt-3 flex items-center justify-between">
										<p className="label">{chrome.signal}</p>
										<p className="label label--ember">{chrome.trackingLive}</p>
									</div>
								</div>

								{/* the account's two figures */}
								<dl className="mt-6 grid grid-cols-2 border-t border-primary-50/12">
									<div className="border-r border-primary-50/12 px-6 py-5">
										<dt className="label">
											{hero?.statA_label ?? "CPL this month"}
										</dt>
										<dd className="num mt-3 text-[30px] text-primary-50">
											{hero?.statA_value ?? "KES 280"}
											{hero?.statA_delta ? (
												<span className="ml-2 text-[12px] font-medium text-accent-500">
													{hero.statA_delta}
												</span>
											) : null}
										</dd>
									</div>
									<div className="px-6 py-5">
										<dt className="label">
											{hero?.statB_label ?? "Leads / month"}
										</dt>
										<dd className="num mt-3 text-[30px] text-primary-50">
											{hero?.statB_value ?? "1,200+"}
										</dd>
									</div>
								</dl>

								<p className="px-6 pb-6 pt-1 text-[11.5px] leading-snug text-primary-400">
									{chrome.illustration}
								</p>
							</div>
						</Reveal>
					</div>

					{/* ---- the channels this route carries ---------------------- */}
					<div className="mt-20 border-y border-primary-50/12">
						<div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:gap-9">
							<p className="label shrink-0">{chrome.channels}</p>
							<ul className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
								{marquee.map((item) => (
									<li key={item} className="flex items-center gap-6">
										<span className="label label--plain text-[11px] text-primary-200">
											{item}
										</span>
										<span
											aria-hidden
											className="inline-block h-1 w-1 bg-accent-500"
										/>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
