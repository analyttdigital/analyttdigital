'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

import { MdiIcon, processStepIcons } from '@/lib/icons/resolve-icon';
import { GlowButton } from '@/components/graphics/glow-button';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { Reveal } from '@/lib/motion/reveal';
import type { ProcessSection } from '@/lib/content/types';

/**
 * Process — the engagement as a scroll-driven story, read in normal flow.
 *
 * The chapter is NOT wrapped in `ScrollSection`: it owns its own scroll
 * progress (`useScroll` on its own stage), so as the section travels the
 * viewport it sweeps an index through the steps — one framer-motion source,
 * zero re-renders. The left column carries the position and the step list
 * (clicking a step scrolls until that step's window is active); the right
 * panel swaps detail (index, title, desc, chips) per step; a 2px ember meter
 * along the foot reports how far through the process the reader is. Copy,
 * steps and chips stay content-layer driven. Each step carries a positional
 * watermark — one big faint MDI glyph bottom-right of the detail panel
 * (`processStepIcons`, same convention as the capability/stat defaults).
 * The closing row lives in `ProcessClosing` below so it reads on after the
 * chapter instead of squeezing into the same band. The process `image` moved
 * to the standalone `cta-banner` section (no bridge panel here any more).
 */
export function ProcessChapter({
	process,
	className,
	id,
}: {
	process?: ProcessSection;
	className?: string;
	id?: string;
}) {
	const stageRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const [meter, setMeter] = useState(0);
	const steps = process?.steps ?? [];

	/* The chapter's own timeline: 0 when its head reaches the viewport
	   bottom, 1 when its foot leaves the viewport top. */
	const { scrollYProgress } = useScroll({
		target: stageRef,
		offset: ['start end', 'end start'],
	});

	useEffect(() => {
		const update = (v: number) => {
			const p = Math.min(1, Math.max(0, v));
			setMeter(p);
			setActive(steps.length ? Math.min(steps.length - 1, Math.floor(p * steps.length)) : 0);
		};
		update(scrollYProgress.get());
		return scrollYProgress.on('change', update);
	}, [scrollYProgress, steps.length]);

	const goTo = (i: number) => {
		// The story drives off the section's own position in the viewport, so
		// jumping to step `i` scrolls until that step's share of the sweep is
		// centred: p = 0 with the section head at the viewport bottom, p = 1
		// with its foot at the viewport top.
		const stage = stageRef.current;
		if (!stage || !steps.length) return;
		const top = stage.getBoundingClientRect().top + window.scrollY;
		const span = stage.offsetHeight + window.innerHeight;
		if (span <= 0) return;
		const y = top - window.innerHeight + (span * (i + 0.5)) / steps.length;
		window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
	};

	const current = steps[active];

	return (
		<div
			ref={stageRef}
			id={id}
			data-process-stage
			className={`bg-paper relative w-full overflow-hidden text-ink-800 ${className ?? ''}`}
		>
			{/* Head: eyebrow, display headline + accent, lede. */}
			<div className="flex flex-col items-center pt-14 md:pt-24">
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
					<p className="label text-ink-500">{process?.eyebrow}</p>

					<InViewTitle
						text={`${process?.headline ?? ""} ${process?.headlineAccent ?? ""}`}
						variant="blur"
						as="h2"
						className="title mt-5 text-[clamp(2rem,4vw,2.4rem)] max-w-[92%] text-primary-800 text-center md:max-w-[70%]"
					/>

					<p className="text-ink-500 mt-6 max-w-[92%] text-center text-sm md:mt-8 md:max-w-[70%] md:text-base">
						{process?.lede}
					</p>
				</div>
			</div>

			{/* Story: position + step list, and the detail panel that swaps
			    per active step. */}
			<div className="mx-auto flex w-full max-w-7xl flex-col justify-center gap-8 px-5 py-12 md:flex-row md:items-center md:gap-16 md:px-8 md:py-16">
				{/* Position + step list */}
				<div className="w-full md:w-[38%] hidden md:block">
					<ol>
						{steps.map((step, i) => (
							<li key={step.n}>
								<button
									type="button"
									onClick={() => goTo(i)}
									aria-pressed={i === active}
									className={`flex w-full items-center gap-4 py-4 text-left text-sm transition-colors duration-200 ${
										i === active
											? "font-medium text-accent-600"
											: "text-ink-500 hover:text-accent-600"
									}`}
								>
									<span className="font-mono text-[10.5px]  opacity-70">
										{step.n}
									</span>
									<span className="flex-1 font-mono">{step.title}</span>
									<MdiIcon
										name="arrowRight"
										size={0.8}
										className={
											i === active ? "text-accent-500" : "opacity-0"
										}
									/>
								</button>
							</li>
						))}
					</ol>
				</div>

				{/* Detail panel — swaps per active step */}
				<div className="w-full flex-1 md:w-auto">
					{current ? (
						<div
							key={current.n}
							className="relative p-5 md:p-12"
							style={{
								animation:
									"fade .5s ease both, rise .6s var(--ease-enter) both",
							}}
						>
							{/* Step watermark — one faint glyph per position, bottom-right. */}
							<MdiIcon
								name={processStepIcons[active % processStepIcons.length]}
								size={12}
								className="pointer-events-none absolute -bottom-8 -right-4 select-none text-ink-950/[0.06]"
							/>
							<p className="num font-display text-[clamp(2.6rem,6vw,4.6rem)] text-ink-300">
								{current.n}
							</p>
							<h3 className="verb font-mono mt-4 text-[clamp(1.6rem,3vw,2.4rem)] text-accent-600">
								{current.title}
							</h3>
							<p className="text-ink-500 mt-5 max-w-[56ch]">{current.desc}</p>
							<ul className="mt-5 flex flex-wrap gap-2.5 md:mt-7">
								{current.chips.map((chip) => (
									<li
										key={chip}
										className="border border-ink-950/15 py-1 px-4 text-xs text-ink-700 rounded-full"
									>
										{chip}
									</li>
								))}
							</ul>
						</div>
					) : null}
				</div>
			</div>

			{/* Foot — meter. A direct stage child so the readout sits on the
			    chapter's ground, below the story band. */}
			<div className="relative border-t border-accent/10 px-5 py-5 md:px-8">
				<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
					<span className="label text-ink-500">{process?.cardTitle ?? "Process"}</span>
					<div className="relative h-[2px] w-40 bg-ink-950/10" aria-hidden>
						<span
							className="absolute inset-y-0 left-0 bg-accent-500"
							style={{ width: `${meter * 100}%` }}
						/>
					</div>
					<span className="label text-ink-500">{/* Scroll to explore */}</span>
				</div>
			</div>
		</div>
	);
}

/** Process closing row — the audit ask after the story. Rendered after the
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
