'use client';

import { useEffect, useRef, useState } from 'react';

import { MdiIcon, processStepIcons } from '@/lib/icons/resolve-icon';
import { GlowButton } from '@/components/layout/glow-button';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { Reveal } from '@/lib/motion/reveal';
import type { ProcessSection } from '@/lib/content/types';
import { useReducedMotion } from 'framer-motion';

/**
 * Process — the engagement as a scroll-driven story.
 *
 * Modelled on the Otto reference: the section is tall (one screen per step),
 * the stage is sticky at 100vh, and scroll progress sweeps an index through
 * the five steps. The left column carries the position and the step list;
 * the right panel swaps detail (index, title, desc, chips) per step; a 2px
 * ember meter along the foot reports how far through the process the reader
 * is. Copy, steps and chips stay content-layer driven. Each step carries a
 * positional watermark — one big faint MDI glyph bottom-right of the detail
 * panel (`processStepIcons`, same convention as the capability/stat defaults).
 * The hero holds its portal flood over this section while it aligns behind
 * it (top edge to viewport top); the bridge exits only once the stage
 * fills the viewport.
 */
export function ProcessChapter({ process }: { process?: ProcessSection }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();
  const steps = process?.steps ?? [];

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, span)));
      setProgress(p);
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [steps.length]);

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = window.scrollY + el.getBoundingClientRect().top + (span * i) / Math.max(1, steps.length - 1);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const current = steps[active];

  return (
		<>
			<section
				id="process"
				ref={sectionRef}
			className={`bg-paper relative text-ink-800 `}
			style={{ height: `${Math.max(steps.length, 1) * 100}vh` }}
		>
			<div className="sticky top-0 flex h-screen  py-14 pt-32 min-h-[640px] flex-col overflow-hidden">
					<div className="mx-auto  w-full max-w-7xl flex flex-col items-center justify-center ">
					<p className="label text-ink-500">{process?.eyebrow}</p>

					<InViewTitle
						text={`${process?.headline ?? ""} ${process?.headlineAccent ?? ""}`}
						variant="blur"
						as="h2"
						className="title mt-8 text-[clamp(2rem,4vw,2.4rem)] max-w-[70%] text-primary-900 text-center"
					/>

					<p className="text-ink-500 mt-12 max-w-[70%] text-center text-sm md:text-base">
						{process?.lede}
					</p>
					</div>
					<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-10 px-5 md:flex-row md:items-center md:gap-16">
						{/* Position + step list */}
						<div className="w-full md:w-[38%] hidden md:block">
							<ol className="mt-10">
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
											<span className="font-mono text-[10.5px] tracking-[0.14em] opacity-70">
												{step.n}
											</span>
											<span className="flex-1">{step.title}</span>
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
								className="relative p-8 md:p-12"
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
								<p className="num text-[clamp(2.6rem,6vw,4.6rem)] text-ink-300">
										{current.n}
									</p>
								<h3 className="verb mt-4 text-[clamp(1.6rem,3vw,2.4rem)] text-accent-600">
									{current.title}
								</h3>
								<p className="text-ink-500 mt-5 max-w-[56ch]">{current.desc}</p>
								<ul className="mt-7 flex flex-wrap gap-2.5">
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

				{/* Foot — meter + scroll cue */}
				<div className="border-t border-accent/10 px-5 py-5 md:px-8">
					<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
						<span className="label text-ink-500">
							{process?.cardTitle ?? "Process"}
						</span>
						<div className="relative h-[2px] w-40 bg-ink-950/10" aria-hidden>
							<span
								className="absolute inset-y-0 left-0 bg-accent-500"
								style={{ width: `${progress * 100}%` }}
							/>
						</div>
                          <span className="label text-ink-500">
                              {/* Scroll to explore */}
                          </span>
					</div>
				</div>
				</div>
			</section>

		{/* Closing row after the story */}
		<div className="bg-paper-50">
			<div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-5 px-5 py-16 md:flex-row md:items-center">
				<Reveal className="max-w-xl">
					<p className="body body--paper text-sm leading-relaxed">
						{process?.closing}
					</p>
				</Reveal>
					<Reveal delay={0.1} className="shrink-0">
						<GlowButton
							data={{ label: process?.cta ?? "", href: process?.ctaHref }}
							className="w-full sm:w-auto "
							tone="ember"
						/>
					</Reveal>
				</div>
			</div>
		</>
  );
}
