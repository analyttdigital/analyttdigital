"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useId, useMemo, useRef } from "react";

/**
 * TraceField — the routed signal net behind a band.
 *
 * One route per anchor chain, drawn at the width of the page: it comes in from
 * off-frame, steps between the components the band names, and leaves off-frame
 * on the far side. Because the routes terminate on those anchors, the net reads
 * as wiring between named things rather than as wallpaper.
 *
 * The geometry is the reference's, deliberately: a 1920×914 box, one long
 * route per chain, and **elliptical** corner easing — 50px along the horizontal
 * leg, 20px along the vertical — which is the wide flat fillet of a board trace
 * and not the quarter-circle a naive router would draw. Each route is drawn
 * twice, a bright line and a ghost fifteen pixels above it, and its stroke is a
 * gradient that falls to nothing at both ends, so a route fades out of frame
 * instead of being guillotined by it.
 *
 * The packet is not a loop. `pathLength` is normalised to 1000 so one dashoffset
 * drives any route shape, and it travels as the band is scrolled, then fades as
 * it completes. The motion is earned by reading the band rather than running
 * forever in the corner of the eye.
 *
 * Decorative, never informative. Under `prefers-reduced-motion` the packet
 * parks itself on the route as a lit segment.
 */

export type Anchor = { x: number; y: number };

const W = 1920;
const H = 914;
/** Corner easing: long along the horizontal leg, short along the vertical. */
const FILLET_X = 50;
const FILLET_Y = 20;
/** Control-point pulls for the fillet's cubic, matching the reference curve. */
const K_X = 0.82;
const K_Y = 0.55;

function mulberry32(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

type Node = { x: number; y: number };

const r2 = (n: number) => Math.round(n * 10) / 10;

/** Unit vector along the leg a→b, snapped to an axis. */
function axis(from: Node, to: Node): Node {
	return Math.abs(to.x - from.x) >= Math.abs(to.y - from.y)
		? { x: Math.sign(to.x - from.x) || 1, y: 0 }
		: { x: 0, y: Math.sign(to.y - from.y) || 1 };
}

/**
 * Orthogonal polyline with every interior corner eased on an elliptical
 * fillet: `FILLET_X` along whichever leg runs horizontally, `FILLET_Y` along
 * whichever runs vertically.
 */
function routePath(pts: Node[]) {
	let d = `M ${r2(pts[0].x)} ${r2(pts[0].y)}`;

	for (let i = 1; i < pts.length - 1; i += 1) {
		const prev = pts[i - 1];
		const p = pts[i];
		const next = pts[i + 1];
		const u = axis(prev, p);
		const v = axis(p, next);

		const inRun = u.x !== 0 ? FILLET_X : FILLET_Y;
		const outRun = v.x !== 0 ? FILLET_X : FILLET_Y;
		const inLen = Math.hypot(p.x - prev.x, p.y - prev.y);
		const outLen = Math.hypot(next.x - p.x, next.y - p.y);
		const a = Math.min(inRun, inLen / 2);
		const b = Math.min(outRun, outLen / 2);

		const from = { x: p.x - u.x * a, y: p.y - u.y * a };
		const to = { x: p.x + v.x * b, y: p.y + v.y * b };

		d +=
			` L ${r2(from.x)} ${r2(from.y)}` +
			` C ${r2(from.x + u.x * a * K_X)} ${r2(from.y + u.y * a * K_X)}` +
			` ${r2(to.x - v.x * b * K_Y)} ${r2(to.y - v.y * b * K_Y)}` +
			` ${r2(to.x)} ${r2(to.y)}`;
	}

	const last = pts[pts.length - 1];
	return `${d} L ${r2(last.x)} ${r2(last.y)}`;
}

/** A point off the frame, weighted towards the sides so routes span the page. */
function offFrame(random: () => number, near: Node): Node {
	const roll = random();
	const drift = () => (random() - 0.5) * 160;
	if (roll < 0.36) return { x: -40, y: near.y + drift() };
	if (roll < 0.72) return { x: W + 40, y: near.y + drift() };
	if (roll < 0.86) return { x: near.x + drift(), y: -40 };
	return { x: near.x + drift(), y: H + 40 };
}

/** Insert a right-angle between every pair of points so the route stays axial. */
function orthogonalise(pts: Node[], random: () => number) {
	const out: Node[] = [pts[0]];
	for (let i = 1; i < pts.length; i += 1) {
		const a = out[out.length - 1];
		const b = pts[i];
		if (Math.abs(a.x - b.x) > 1 && Math.abs(a.y - b.y) > 1) {
			out.push(random() > 0.5 ? { x: b.x, y: a.y } : { x: a.x, y: b.y });
		}
		out.push(b);
	}
	return out;
}

type Route = {
	id: string;
	d: string;
	pads: Node[];
	bbox: { minX: number; minY: number; maxX: number; maxY: number };
	/** Dash pattern for this route's packet, alternated so packets sharing one
	 *  scroll-driven dashoffset still sit at different points along it. */
	packet: string;
};

/** The reference's two periods, alternated: a long packet and a short one. */
const PACKETS = ["120 880", "90 910"];

function buildRoutes(seed: number, count: number, anchors: Anchor[], uid: string): Route[] {
	const random = mulberry32(seed);
	const px = anchors.map((a) => ({ x: a.x * W, y: a.y * H }));
	const routes: Route[] = [];

	for (let i = 0; i < count; i += 1) {
		// Walk a slice of the anchor list, wrapping, so consecutive routes hand
		// off from one named component to the next rather than overlapping.
		const span = Math.max(2, Math.min(px.length, 2 + (i % 3)));
		const chain: Node[] = [];
		for (let k = 0; k < span; k += 1) {
			chain.push(px[(i + k) % px.length]);
		}

		const first = chain[0];
		const last = chain[chain.length - 1];
		const pts = orthogonalise(
			[offFrame(random, first), ...chain, offFrame(random, last)],
			random
		);

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const p of pts) {
			minX = Math.min(minX, p.x);
			minY = Math.min(minY, p.y);
			maxX = Math.max(maxX, p.x);
			maxY = Math.max(maxY, p.y);
		}

		// Pads on two of the corners, the way a board marks a junction.
		const pads = [pts[2], pts[pts.length - 3]].filter(
			(p): p is Node => Boolean(p) && p.x > minX && p.x < maxX
		);

		routes.push({
			id: `${uid}-${i}`,
			d: routePath(pts),
			pads,
			bbox: { minX, minY, maxX, maxY },
			packet: PACKETS[i % PACKETS.length],
		});
	}

	return routes;
}

export function TraceField({
	seed = 3,
	count = 5,
	depth = 40,
	opacity = 1,
	/** Fraction of the host's height the net occupies. */
	frame = 0.94,
	tone = "dark",
	anchors,
	className,
}: {
	seed?: number;
	count?: number;
	/** Pixels of parallax drift across the scroll of the host band. */
	depth?: number;
	opacity?: number;
	frame?: number;
	tone?: "dark" | "plate";
	/** Points the routes terminate on, normalised to the band. */
	anchors: Anchor[];
	className?: string;
}) {
	const hostRef = useRef<HTMLDivElement>(null);
	const reduce = useReducedMotion();
	const uid = useId().replace(/:/g, "");
	const routes = useMemo(
		() => buildRoutes(seed, count, anchors, uid),
		[anchors, count, seed, uid]
	);

	const { scrollYProgress } = useScroll({
		target: hostRef,
		offset: ["start end", "end start"],
	});
	const shift = useTransform(scrollYProgress, [0, 1], [depth, -depth]);
	const dash = useTransform(scrollYProgress, [0, 1], [1010, 0]);
	const lit = useTransform(scrollYProgress, [0.82, 1], [1, 0]);

	const ink = tone === "plate" ? "rgb(var(--color-ink-950))" : "rgb(var(--color-primary-50))";

	return (
		<div
			ref={hostRef}
			aria-hidden
			className={`pointer-events-none absolute inset-0 overflow-hidden ${
				tone === "plate" ? "trace-plate" : ""
			} ${className ?? ""}`}
		>
			<motion.svg
				className="block w-full max-md:w-[200%] max-md:-ml-[50%]"
				style={{ y: shift, opacity, height: `${frame * 100}%` }}
				preserveAspectRatio="xMidYMid meet"
				viewBox={`0 0 ${W} ${H}`}
				fill="none"
				role="presentation"
			>
				<defs>
					{routes.map((route) => (
						<linearGradient
							key={`grad-${route.id}`}
							id={`fade-${route.id}`}
							gradientUnits="userSpaceOnUse"
							x1={route.bbox.maxX + 60}
							y1={route.bbox.minY - 60}
							x2={route.bbox.minX - 60}
							y2={route.bbox.maxY + 60}
						>
							<stop offset="0" stopOpacity="0" style={{ stopColor: ink }} />
							<stop offset="0.5" stopOpacity="1" style={{ stopColor: ink }} />
							<stop offset="1" stopOpacity="0" style={{ stopColor: ink }} />
						</linearGradient>
					))}
				</defs>

				{routes.map((route) => (
					<g key={route.id}>
						{/* the ghost, fifteen pixels above the line it shadows */}
						<path
							className="trace-line trace-line--ghost"
							d={route.d}
							stroke={`url(#fade-${route.id})`}
							transform="translate(0 -15)"
							vectorEffect="non-scaling-stroke"
						/>
						{/* <path
              className="trace-line"
              d={route.d}
              stroke={`url(#fade-${route.id})`}
              vectorEffect="non-scaling-stroke"
            />
            {route.pads.map((pad, i) => (
              <rect
                key={`pad-${i}`}
                className="trace-pad"
                x={pad.x - 5}
                y={pad.y - 5}
                width={10}
                height={10}
              />
            ))} */}
						{!reduce && (
							<motion.path
								className="trace-pulse"
								d={route.d}
								pathLength={1000}
								strokeDasharray={route.packet}
								style={{ strokeDashoffset: dash, opacity: lit }}
								vectorEffect="non-scaling-stroke"
							/>
						)}
					</g>
				))}
			</motion.svg>
		</div>
	);
}
