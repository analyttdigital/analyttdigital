"use client";

import Link from "next/link";
import {
	motion,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { offsetPolyline, toRoundedPath, type Point } from "./path-utils";

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

export interface PathLine {
	/** Sideways offset from the main path in px (negative = right of travel). */
	offset: number;
	/** Base line opacity (0–1). */
	opacity?: number;
	strokeWidth?: number;
	/** Whether the animated trace runs along this line. */
	trace?: boolean;
}

export interface PathFlowCta {
	label: string;
	href: string;
}

export interface PathFlowProps {
	/* content */
	cta?: PathFlowCta;
	/** Extra content rendered inside the content block, under the CTA. */
	children?: ReactNode;

	/* path geometry */
	/** Orthogonal waypoints as fractions (0–1) of the section's width/height. */
	points?: Point[];
	/** Corner radius in px. */
	cornerRadius?: number;
	/** Parallel rails drawn around the main path. */
	lines?: PathLine[];

	/* animation */
	/** "trace" = bright segment travels the path; "draw" = path progressively draws. */
	mode?: "trace" | "draw";
	/** Trace length as a fraction of the path (0–1). Only for mode="trace". */
	traceLength?: number;
	/** Maps scroll progress to animation progress, e.g. [0.2, 0.8]. */
	progressRange?: [number, number];
	/** framer-motion useScroll offset. */
	scrollOffset?: NonNullable<Parameters<typeof useScroll>[0]>["offset"];
	/** Spring smoothing on top of Lenis. Set false to follow scroll 1:1. */
	spring?: false | { stiffness?: number; damping?: number; mass?: number };
	glow?: boolean;

	/* layout / theming */
	/** CSS `left` / `top` of the content block on md+ screens. */
	contentPosition?: { left: string; top: string };
	backgroundColor?: string;
	lineColor?: string;
	traceColor?: string;
	textColor?: string;
	accentColor?: string;
	className?: string;
	contentClassName?: string;
	id?: string;
}

/* ----------------------------------------------------------------------------
 * Defaults (staircase similar to the cantor8 "Foundation" section)
 * ------------------------------------------------------------------------- */

const DEFAULT_POINTS: Point[] = [
	{ x: 0, y: 0.81 },
	{ x: 0.325, y: 0.81 },
	{ x: 0.325, y: 0.5 },
	{ x: 0.48, y: 0.5 },
	{ x: 0.48, y: 0.34 },
	{ x: 0.81, y: 0.34 },
	{ x: 0.81, y: 0.43 },
	{ x: 0.9, y: 0.43 },
	{ x: 0.9, y: 0.2 },
	{ x: 1, y: 0.2 },
];

const DEFAULT_LINES: PathLine[] = [
	{ offset: -11, opacity: 0.22, strokeWidth: 1 },
	{ offset: 0, opacity: 0.35, strokeWidth: 1, trace: true },
	{ offset: 11, opacity: 0.22, strokeWidth: 1 },
];

/* ----------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

function useElementSize<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setSize({ width, height });
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return [ref, size] as const;
}

function ArrowIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<path
				d="M3 11 11 3M5 3h6v6"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="square"
			/>
		</svg>
	);
}

/* ----------------------------------------------------------------------------
 * Animated stroke
 * ------------------------------------------------------------------------- */

function AnimatedStroke({
	d,
	progress,
	mode,
	traceLength,
	color,
	width,
	glow,
	reduced,
}: {
	d: string;
	progress: MotionValue<number>;
	mode: "trace" | "draw";
	traceLength: number;
	color: string;
	width: number;
	glow: boolean;
	reduced: boolean;
}) {
	// framer-motion turns pathLength / pathOffset into stroke-dasharray / offset.
	// trace: dash of fixed length slides from before the start to past the end.
	const pathOffset = useTransform(progress, [0, 1], [-traceLength, 1]);
	const drawLength = progress;

	const style =
		mode === "draw"
			? { pathLength: reduced ? 1 : drawLength, pathOffset: 0 }
			: {
					pathLength: traceLength,
					pathOffset: reduced ? 0.5 : pathOffset,
				};

	return (
		<motion.path
			d={d}
			fill="none"
			stroke={color}
			strokeWidth={width}
			strokeLinecap="round"
			style={{
				...style,
				filter: glow ? `drop-shadow(0 0 5px ${color})` : undefined,
			}}
		/>
	);
}

/* ----------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */

function PathFlow({
	cta,
	children,

	points = DEFAULT_POINTS,
	cornerRadius = 22,
	lines = DEFAULT_LINES,

	mode = "trace",
	traceLength = 0.12,
	progressRange = [0.1, 0.9],
	scrollOffset = ["start end", "end start"],
	spring = { stiffness: 120, damping: 30, mass: 0.3 },
	glow = true,

	contentPosition = { left: "55%", top: "45%" },
	backgroundColor = "#034bb5",
	lineColor = "#ffffff",
	traceColor = "#ffffff",
	textColor = "#ffffff",
	accentColor = "#034bb5",
	className = "",
	contentClassName = "",
	id,
}: PathFlowProps) {
	const reduced = !!useReducedMotion();
	const sectionRef = useRef<HTMLDivElement>(null);
	const [boxRef, { width, height }] = useElementSize<HTMLDivElement>();

	/* scroll progress → (optionally remapped) → (optionally sprung) */
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: scrollOffset,
	});
	const remapped = useTransform(scrollYProgress, [progressRange[0], progressRange[1]], [0, 1], {
		clamp: true,
	});
	const sprung = useSpring(remapped, spring || { duration: 0 });
	const progress = spring ? sprung : remapped;

	/* geometry in px so corner radii stay circular at any aspect ratio */
	const paths = useMemo(() => {
		if (!width || !height) return [];
		const abs = points.map((p) => ({ x: p.x * width, y: p.y * height }));
		return lines.map((l) => toRoundedPath(offsetPolyline(abs, l.offset), cornerRadius));
	}, [points, lines, cornerRadius, width, height]);

	const cssVars = {
		backgroundColor,
		color: textColor,
		"--cx": contentPosition.left,
		"--cy": contentPosition.top,
	} as CSSProperties;

	return (
		<div
			id={id}
			ref={sectionRef}
			style={cssVars}
			className={`relative min-h-screen w-full overflow-hidden ${className}`}
		>
			{/* path layer */}
			<div ref={boxRef} className="pointer-events-none absolute inset-0" aria-hidden>
				{width > 0 && (
					<svg
						width={width}
						height={height}
						viewBox={`0 0 ${width} ${height}`}
						className="absolute inset-0 overflow-visible"
					>
						{paths.map((d, i) => (
							<path
								key={`base-${i}`}
								d={d}
								fill="none"
								stroke={lineColor}
								strokeOpacity={lines[i].opacity ?? 0.3}
								strokeWidth={lines[i].strokeWidth ?? 1}
							/>
						))}
						{paths.map(
							(d, i) =>
								lines[i].trace && (
									<AnimatedStroke
										key={`trace-${i}`}
										d={d}
										progress={progress}
										mode={mode}
										traceLength={traceLength}
										color={traceColor}
										width={(lines[i].strokeWidth ?? 1) + 0.5}
										glow={glow}
										reduced={reduced}
									/>
								)
						)}
					</svg>
				)}
			</div>


			{/* content block */}
			<div
				className={`relative z-10 mt-16 max-w-[26rem] px-7 pb-24 md:absolute md:left-[var(--cx)] md:top-[var(--cy)] md:mt-0 md:px-0 md:pb-0 ${contentClassName}`}
			>
				
				{cta && (
					<Link
						href={cta.href}
						className="group inline-flex items-stretch gap-10 bg-white p-[3px] pl-3 text-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
						style={{ color: accentColor }}
					>
						<span className="self-center">{cta.label}</span>
						<span
							className="grid h-9 w-9 place-items-center text-white transition-transform duration-300 group-hover:-translate-y-0.5"
							style={{ backgroundColor: accentColor }}
						>
							<ArrowIcon />
						</span>
					</Link>
				)}
				{children}
			</div>
		</div>
	);
}

export default PathFlow;
