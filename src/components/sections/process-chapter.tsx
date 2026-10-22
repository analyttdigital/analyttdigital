'use client';

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { GlowButton } from '@/components/graphics/glow-button';
import { MdiIcon, processStepIcons } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { Reveal } from '@/lib/motion/reveal';
import type { DataProps, ProcessSection } from '@/lib/content/types';

/**
 * ProcessChapter — a pinned, scroll-driven sequence with one visible step.
 */
function getProcessStepIndex(progress: number, stepCount: number) {
	if (stepCount <= 1) return 0;
	return Math.min(stepCount - 1, Math.max(0, Math.round(progress * (stepCount - 1))));
}

export function ProcessChapter({
	data,
	classes,
	className,
	id,
}: DataProps<ProcessSection, 'rows' | 'row' | 'head'>) {
	const steps = data?.steps ?? [];
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ['start start', 'end end'],
	});
	const shouldReduceMotion = useReducedMotion();
	const [active, setActive] = useState({ index: 0, direction: 1 });

	useMotionValueEvent(scrollYProgress, 'change', (progress) => {
		const index = getProcessStepIndex(progress, steps.length);
		setActive((current) => (
			index === current.index
				? current
				: { index, direction: index > current.index ? 1 : -1 }
		));
	});

	useEffect(() => {
		const index = getProcessStepIndex(scrollYProgress.get(), steps.length);
		setActive((current) => (
			index === current.index
				? current
				: { index, direction: index > current.index ? 1 : -1 }
		));
	}, [scrollYProgress, steps.length]);

	return (
		<section
			ref={sectionRef}
			id={id ?? 'process'}
			style={steps.length > 0 ? { minHeight: `${steps.length * 100}svh` } : undefined}
			className={`relative overflow-clip bg-paper ${className ?? ''}`}
		>
			<div className="sticky top-0 flex min-h-svh flex-col justify-center py-16 md:py-28">
				<div className="mx-auto w-full max-w-7xl px-5 md:px-8">
					<GsapReveal>
						<div
							className={['flex flex-wrap items-end justify-between gap-8', classes?.head]
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
									{data?.cardTitle && steps.length > 0 ? (
										<p className="label label--plain mt-4 text-ink-400">
											{data.cardTitle} · {String(active.index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
										</p>
									) : null}
								</div>
							) : null}
						</div>
					</GsapReveal>

					{steps.length > 0 ? (
						<ol
							aria-live="polite"
							className={['mx-auto mt-12 w-full max-w-[64ch] border-t border-ink-950/10', classes?.rows]
								.filter(Boolean)
								.join(' ')}
						>
							<AnimatePresence initial={false} mode="wait" custom={active.direction}>
								<motion.li
									key={active.index}
									custom={active.direction}
									variants={{
										enter: (direction: number) => ({
											opacity: 0,
											x: shouldReduceMotion ? 0 : direction * 32,
										}),
										center: { opacity: 1, x: 0 },
										exit: (direction: number) => ({
											opacity: 0,
											x: shouldReduceMotion ? 0 : direction * -32,
										}),
									}}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
									aria-posinset={active.index + 1}
									aria-setsize={steps.length}
									className={`group relative grid max-w-[64ch] grid-cols-1 gap-3 overflow-hidden border-b border-ink-950/10 py-7 md:py-9 ${classes?.row ?? ''}`}
								>
									<MdiIcon
										name={processStepIcons[active.index % processStepIcons.length]}
										size={5}
										className="pointer-events-none absolute -bottom-2 -right-1 select-none text-ink-950/[0.05] md:-bottom-4 md:-right-2"
									/>
									<div>
										<span className="num text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none text-accent-500 transition-colors duration-200 group-hover:text-accent-600">
											{steps[active.index].n}
										</span>
										<h3 className="verb mt-3 text-[clamp(1.35rem,2.2vw,1.9rem)] text-ink-950">
											{steps[active.index].title}
										</h3>
									</div>
									<div>
										<p className="text-sm leading-[1.85] text-ink-500 md:text-[15px]">
											{steps[active.index].desc}
										</p>
										{steps[active.index].chips?.length ? (
											<ul className="mt-5 flex flex-wrap gap-2">
												{steps[active.index].chips.map((chip) => (
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
								</motion.li>
							</AnimatePresence>
						</ol>
					) : null}
				</div>
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
