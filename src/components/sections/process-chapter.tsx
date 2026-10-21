'use client';

import { useEffect, useRef, useState } from 'react';

import { MdiIcon, processStepIcons } from '@/lib/icons/resolve-icon';
import { CtaBanner } from '@/components/sections/cta-banner';
import { GlowButton } from '@/components/graphics/glow-button';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { Reveal } from '@/lib/motion/reveal';
import type { ContentImage, CtaSection, ProcessSection } from '@/lib/content/types';
import type { MotionValue } from 'framer-motion';

/**
 * Process — the engagement as a scroll-driven story.
 *
 * The pin lives in the reusable `ScrollSection` wrapper (see
 * `section-renderer.tsx`, shrink + cover trick): this stage renders inside
 * its sticky 100svh viewport and reads the wrapper's scroll progress —
 * one framer-motion source, zero re-renders — sweeping an index through
 * the steps. The left column carries the position and the step list; the
 * right panel swaps detail (index, title, desc, chips) per step; a 2px
 * ember meter along the foot reports how far through the process the reader
 * is. Copy, steps and chips stay content-layer driven. Each step carries a
 * positional watermark — one big faint MDI glyph bottom-right of the detail
 * panel (`processStepIcons`, same convention as the capability/stat defaults).
 * The closing row lives in `ProcessClosing` below so it can scroll on after
 * the pin, instead of squeezing into the 100svh stage. The stage itself
 * carries no background image — the process `image` moved to the bridge
 * panel (see `ProcessBridge`), which renders the page's cta-banner block.
 */
export function ProcessChapter({
  process,
  progress,
}: {
  process?: ProcessSection;
  /** Scroll progress from the wrapping `ScrollSection` (cover runway). */
  progress?: MotionValue<number>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [meter, setMeter] = useState(0);
  const steps = process?.steps ?? [];

  useEffect(() => {
    if (!progress) return;
    const update = (v: number) => {
      const p = Math.min(1, Math.max(0, v));
      setMeter(p);
      setActive(steps.length ? Math.min(steps.length - 1, Math.floor(p * steps.length)) : 0);
    };
    update(progress.get());
    return progress.on('change', update);
  }, [progress, steps.length]);

  /* Step copy swaps under the pin: start each step at its head instead of
     wherever the previous (taller) step left the mobile scroll position. */
  useEffect(() => {
    if (storyRef.current) storyRef.current.scrollTop = 0;
  }, [active]);

  const goTo = (i: number) => {
    // Step buttons jump along the wrapping runway (the pinned section the
    // renderer provides), so they keep working with no runway of our own.
    const runway = stageRef.current?.closest('section');
    if (!runway || !steps.length) return;
    const span = runway.offsetHeight - window.innerHeight;
    if (span <= 0) return;
    const top = window.scrollY + runway.getBoundingClientRect().top + (span * (i + 0.5)) / steps.length;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const current = steps[active];

  return (
		<div
			ref={stageRef}
			data-process-stage
			className="bg-paper relative flex h-full min-h-0 w-full flex-col overflow-hidden text-ink-800"
		>
			{/* The story scrolls inside the pin when it outgrows the stage (always
			    on phones, on short desktop viewports). The stage stays 100svh
			    and the foot stays anchored, so the runway, the cover and the
			    shrink exit keep working while no copy is clipped. */}
			<div ref={storyRef} className="relative min-h-0 flex-1 overflow-y-auto">
				<div className="flex min-h-full flex-col justify-center py-10 pt-20 md:py-14 md:pt-32">
					<div className="mx-auto  w-full max-w-7xl flex flex-col items-center justify-center ">
						<p className="label text-ink-500">{process?.eyebrow}</p>

						<InViewTitle
							text={`${process?.headline ?? ""} ${process?.headlineAccent ?? ""}`}
							variant="blur"
							as="h2"
							className="title mt-5 text-[clamp(2rem,4vw,2.4rem)] max-w-[92%] text-primary-800 text-center md:mt-8 md:max-w-[70%]"
						/>

						<p className="text-ink-500 mt-6 max-w-[92%] text-center text-sm md:mt-12 md:max-w-[70%] md:text-base">
							{process?.lede}
						</p>
					</div>
					<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-8 px-5 md:flex-row md:items-center md:gap-16">
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
				</div>
			</div>

			{/* Foot — meter + scroll cue. A direct stage child so it stays
				    bottom-anchored while the story above flexes. */}
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
 *  pinned cover (see `section-renderer.tsx`) so it scrolls on once the
 *  steps stage unpins, instead of squeezing into the 100svh pin. */
export function ProcessClosing({ process }: { process?: ProcessSection }) {
	return (
		<div className="bg-paper-50">
            {(!!process?.closing || !!process?.cta) && <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-5 px-5 py-16 md:flex-row md:items-center">
                {process?.closing && <Reveal className="max-w-xl">
                    <p className="body body--paper text-sm leading-relaxed">
                        {process?.closing}
                    </p>
                </Reveal>}
                {process?.cta && (
                    <Reveal delay={0.1} className="shrink-0">
                        <GlowButton
                            data={{ label: process?.cta ?? "", href: process?.ctaHref }}
                            className="w-full sm:w-auto "
                            tone="ember"
                        />
                    </Reveal>)}
            </div>}
			</div>
	);
}

/** The ask that holds the pin's tail.
 *
 *  The shrink runway ends with the stage empty, so the renderer passes this
 *  as the `ScrollSection` bridge: it rises as the step card dissolves — the
 *  runway resolves onto the ask instead of onto blank paper. The bridge is
 *  the page's `cta-banner` block (consumed, not rendered standalone), with
 *  the process `image` as its panel background — the image moved off the
 *  steps stage onto this panel. */
export function ProcessBridge({
  process,
  banner,
}: {
  process?: ProcessSection;
  /** The page's `cta-banner` block, consumed here and hidden standalone. */
  banner?: CtaSection;
}) {
  if (!banner) return null;
  const background: ContentImage | null = process?.image?.src?.trim() ? process.image : null;
  return (
    <div className="mx-auto w-full max-w-5xl">
      <CtaBanner data={banner} background={background} bare />
    </div>
  );
}
