"use client";

/**
 * ScrollSection: scroll-driven transition wrapper.
 *
 * WHY FRAMER-MOTION (and not GSAP / three.js) FOR THIS JOB
 * - Every effect here is a pure function of ONE scroll-progress value `p`.
 *   `useScroll` + `useTransform` write straight to the element's style
 *   (clip-path / transform / opacity / filter) with zero React re-renders,
 *   which is what you already do in Hero. It is reversible by construction.
 * - GSAP ScrollTrigger is equally fast, but it is a second scroll engine.
 *   Reach for it only if you need timeline sequencing across many elements
 *   or its own `snap`. Don't drive the same element from both libraries.
 * - three.js only draws pixels. Keep it for scene content; read `p` from the
 *   render-prop (`children={(p) => ...}`) via `p.get()` inside useFrame/rAF.
 * - Only compositor-friendly properties are animated (plus clip-path, which
 *   is cheap on a promoted layer). `will-change` is applied only while the
 *   effect is mid-flight.
 *
 * VARIANTS: see EnterVariant / PinnedVariant below (each is one line of
 * `frameFor`, so adding your own is a single `case`).
 *
 * TWO FAMILIES OF VARIANTS
 * - Enter variants (no runway): play as the section's top travels from the
 *   viewport bottom up to `enterAt` (fraction from viewport top).
 * - Pinned variants (runway): the section is a tall runway holding a sticky
 *   100svh stage; the effect plays at the END of the runway as the stage
 *   leaves. `portal` is your hero's circular zoom, generalised.
 *
 * BRIDGE — a pinned stage can hold copy that arrives as the effect window
 * opens: the hero's portal carries it inside the flood, every other pinned
 * variant holds it on the stage itself. One mount gate, one fade — a
 * shrink runway resolves onto its bridge instead of onto bare ground.
 *
 * SNAP
 * - 'proximity': native CSS scroll-snap (best on touch).
 * - 'magnetic': after scrolling settles near the section's top, smooth-scroll
 *   to align it. Pointer-fine devices only, never inside a pinned runway.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
	type MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export type EnterVariant =
	| "fade-up" //      rises and fades in
	| "mask-up" //      revealed bottom-to-top by a rising mask
	| "scale-in" //     grows from 90% while fading in
	| "blur-in" //      de-blurs while rising
	| "circle-in" //    circular clip opens from `origin`
	| "slide-left" //   slides in from the left
	| "slide-right" //  slides in from the right
	| "tilt-up" //      3D tilt rising to flat
	| "wipe-right" //   wiped in left-to-right
	| "window-open" //  rounded rectangle opens from the centre
	| "diamond-in" //   diamond clip opens from the centre
	| "zoom-settle"; // starts oversized and soft, settles to 100%
export type PinnedVariant =
	| "portal" //   circular flood from `origin` (your hero zoom)
	| "zoom-out" // stage scales up and fades
	| "curtain" //  stage lifts away from the bottom edge
	| "shrink" //   stage shrinks into a rounded card and fades
	| "iris-out" // circular iris closes on `origin`
	| "lift"; //    stage floats up faster than the scroll and fades
export type ScrollSectionVariant = EnterVariant | PinnedVariant | "none";
export type SnapMode = "none" | "proximity" | "magnetic";

export interface ScrollSectionProps {
	/** Transition effect. Default `fade-up`. */
	variant?: ScrollSectionVariant;
	/** Section content, or a render-prop receiving the progress MotionValue (0..1). */
	children: ReactNode | ((progress: MotionValue<number>) => ReactNode);
	id?: string;
	/** Classes for the outer <section>. */
	className?: string;
	/** Classes for the animated content wrapper / sticky stage. */
	innerClassName?: string;

	/** Progress window (0..1) in which the effect plays. Defaults per variant. */
	range?: [number, number];
	/** Enter variants: viewport fraction (from top) where the effect completes. Default 0.3. */
	enterAt?: number;
	/** Enter variants: keep the section revealed once it has played. Default false (reversible). */
	once?: boolean;
	/** Pinned variants: extra scroll length in svh on top of the 100svh stage. Default 150. */
	runway?: number;

	/** `circle-in` / `portal` origin, CSS position like '67% 51%'. Default '50% 50%'. */
	origin?: string;
	/** Origin below 760px wide. Falls back to `origin`. */
	originMobile?: string;
	/** `portal`: Tailwind classes painting the flood (match the NEXT section's ground). Default 'bg-primary'. */
	floodClassName?: string;
	/** `portal`: copy shown inside the flood. Other pinned variants: copy held on the stage as the effect window opens — the ask that fills a shrink runway's tail. */
	bridge?: ReactNode;
	/** `portal`: max circle radius in %. 125 covers 16:9, ultrawide and portrait. */
	portalMaxRadius?: number;
	/** Progress window for the bridge copy. */
	bridgeRange?: [number, number];

	/** Snap behaviour for the section top. Default 'none'. */
	snap?: SnapMode;
	/** `magnetic`: how close (fraction of viewport height) before it snaps. Default 0.25. */
	snapThreshold?: number;
}

/* ------------------------------------------------------------------ */
/* Pure helpers                                                         */
/* ------------------------------------------------------------------ */

const PINNED: ReadonlySet<ScrollSectionVariant> = new Set<ScrollSectionVariant>([
	"portal",
	"zoom-out",
	"curtain",
	"shrink",
	"iris-out",
	"lift",
]);

/** Variants whose look comes from clip-path (drives will-change). */
const CLIPPED: ReadonlySet<ScrollSectionVariant> = new Set<ScrollSectionVariant>([
	"mask-up",
	"circle-in",
	"wipe-right",
	"window-open",
	"diamond-in",
	"curtain",
	"shrink",
	"iris-out",
]);

const DEFAULT_RANGE: Record<ScrollSectionVariant, [number, number]> = {
	"fade-up": [0, 1],
	"mask-up": [0, 1],
	"scale-in": [0, 1],
	"blur-in": [0, 1],
	"circle-in": [0, 1],
	"slide-left": [0, 1],
	"slide-right": [0, 1],
	"tilt-up": [0, 1],
	"wipe-right": [0, 1],
	"window-open": [0, 1],
	"diamond-in": [0, 1],
	"zoom-settle": [0, 1],
	portal: [0.78, 0.985],
	"zoom-out": [0.65, 1],
	curtain: [0.65, 1],
	shrink: [0.65, 1],
	"iris-out": [0.6, 1],
	lift: [0.6, 1],
	none: [0, 1],
};

/** Smoothstep window: 0 before `a`, 1 after `b`, eased between. */
const smooth = (a: number, b: number, x: number) => {
	if (b <= a) return x >= b ? 1 : 0;
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};

interface Frame {
	opacity: number;
	x: number;
	/** px */
	y: number;
	/** extra vertical offset as a % of the element's own height */
	yPct: number;
	scale: number;
	rotateX: number;
	blur: number;
	clip: string;
}

/** The look of each variant at eased progress `e` (0 = start, 1 = done). */
function frameFor(variant: ScrollSectionVariant, e: number, origin: string): Frame {
	const rest: Frame = {
		opacity: 1,
		x: 0,
		y: 0,
		yPct: 0,
		scale: 1,
		rotateX: 0,
		blur: 0,
		clip: "none",
	};
	switch (variant) {
		case "fade-up":
			return { ...rest, opacity: e, y: (1 - e) * 64 };
		case "mask-up":
			return {
				...rest,
				y: (1 - e) * 48,
				clip: e >= 1 ? "none" : `inset(${(1 - e) * 100}% 0% 0% 0%)`,
			};
		case "scale-in":
			return { ...rest, opacity: e, scale: 0.9 + 0.1 * e };
		case "blur-in":
			return { ...rest, opacity: e, y: (1 - e) * 24, blur: (1 - e) * 16 };
		case "circle-in":
			return {
				...rest,
				scale: 1 + (1 - e) * 0.08,
				clip: e >= 1 ? "none" : `circle(${e * 125}% at ${origin})`,
			};
		case "slide-left":
			return { ...rest, opacity: e, x: (1 - e) * -120 };
		case "slide-right":
			return { ...rest, opacity: e, x: (1 - e) * 120 };
		case "tilt-up":
			return { ...rest, opacity: e, y: (1 - e) * 40, rotateX: (1 - e) * 18 };
		case "wipe-right":
			return { ...rest, clip: e >= 1 ? "none" : `inset(0% ${(1 - e) * 100}% 0% 0%)` };
		case "window-open": {
			const k = 1 - e;
			return {
				...rest,
				scale: 0.94 + 0.06 * e,
				clip:
					e >= 1
						? "none"
						: `inset(${k * 18}% ${k * 28}% ${k * 18}% ${k * 28}% round ${k * 48}px)`,
			};
		}
		case "diamond-in": {
			/* half-diagonal of 100% is the minimum that covers the corners. */
			const r = e * 102;
			return {
				...rest,
				clip:
					e >= 1
						? "none"
						: `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)`,
			};
		}
		case "zoom-settle":
			return { ...rest, opacity: e, scale: 1.2 - 0.2 * e, blur: (1 - e) * 6 };
		case "shrink":
			return {
				...rest,
				opacity: 1 - e,
				scale: 1 - 0.12 * e,
				clip: e <= 0 ? "none" : `inset(${e * 3}% ${e * 5}% round ${e * 40}px)`,
			};
		case "iris-out":
			return { ...rest, clip: e <= 0 ? "none" : `circle(${(1 - e) * 125}% at ${origin})` };
		case "lift":
			return { ...rest, opacity: 1 - e, yPct: -e * 35 };
		case "zoom-out":
			return { ...rest, opacity: 1 - e, scale: 1 + e * 0.25 };
		case "curtain":
			return { ...rest, clip: e <= 0 ? "none" : `inset(0% 0% ${e * 100}% 0%)` };
		case "portal":
			return { ...rest, scale: 1 + e * 0.1 };
		default:
			return rest;
	}
}

/* ------------------------------------------------------------------ */
/* Small hooks                                                          */
/* ------------------------------------------------------------------ */

function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia(query);
		const update = () => setMatches(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, [query]);
	return matches;
}

/* Reference-counted so several sections can share the root snap type. */
let proximityUsers = 0;
function useProximitySnap(enabled: boolean) {
	useEffect(() => {
		if (!enabled) return;
		const root = document.documentElement;
		if (proximityUsers++ === 0) root.style.scrollSnapType = "y proximity";
		return () => {
			if (--proximityUsers === 0) root.style.removeProperty("scroll-snap-type");
		};
	}, [enabled]);
}

/** After scrolling settles near the section top, glide to align it. */
function useMagneticSnap(
	ref: React.RefObject<HTMLElement | null>,
	enabled: boolean,
	threshold: number,
	pinned: boolean
) {
	useEffect(() => {
		if (!enabled || !window.matchMedia("(pointer: fine)").matches) return;
		let timer = 0;
		let busy = false;
		let busyTimer = 0;

		const settle = () => {
			const el = ref.current;
			if (!el || busy) return;
			const top = el.getBoundingClientRect().top;
			const vh = window.innerHeight;
			if (Math.abs(top) < 2 || Math.abs(top) > threshold * vh) return;
			if (pinned && top < 0) return; // never fight the pinned runway
			busy = true;
			window.clearTimeout(busyTimer);
			busyTimer = window.setTimeout(() => (busy = false), 800);
			window.scrollTo({ top: window.scrollY + top, behavior: "smooth" });
		};
		const onScroll = () => {
			window.clearTimeout(timer);
			timer = window.setTimeout(settle, 140);
		};
		/* User input cancels an in-flight snap. */
		const cancel = () => {
			if (!busy) return;
			busy = false;
			window.scrollTo({ top: window.scrollY });
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("wheel", cancel, { passive: true });
		window.addEventListener("touchstart", cancel, { passive: true });
		window.addEventListener("keydown", cancel);
		return () => {
			window.clearTimeout(timer);
			window.clearTimeout(busyTimer);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("wheel", cancel);
			window.removeEventListener("touchstart", cancel);
			window.removeEventListener("keydown", cancel);
		};
	}, [ref, enabled, threshold, pinned]);
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function ScrollSection({
	variant = "fade-up",
	children,
	id,
	className = "",
	innerClassName = "",
	range,
	enterAt = 0.3,
	once = false,
	runway = 150,
	origin = "50% 50%",
	originMobile,
	floodClassName = "bg-primary",
	bridge,
	portalMaxRadius = 125,
	bridgeRange = [0.8, 0.93],
	snap = "none",
	snapThreshold = 0.25,
}: ScrollSectionProps) {
	const reduce = useReducedMotion();
	const isMobile = useMediaQuery("(max-width: 759px)");
	const pinned = PINNED.has(variant);
	const win = range ?? DEFAULT_RANGE[variant];
	const pos = isMobile && originMobile ? originMobile : origin;

	/* ---- the single scroll-progress source ---- */
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress: raw } = useScroll({
		target: ref,
		offset: pinned
			? ["start start", "end end"]
			: ["start end", `start ${Math.round(enterAt * 100)}%`],
	});

	/* `once`: latch the highest progress reached (enter variants only). */
	const reached = useMotionValue(0);
	useMotionValueEvent(raw, "change", (v) => {
		if (v > reached.get()) reached.set(v);
	});
	const p = once && !pinned ? reached : raw;

	/* ---- timeline: pure functions of `p`, no re-renders ---- */
	const e = useTransform(p, (v) => smooth(win[0], win[1], v));
	const opacity = useTransform(e, (v) => frameFor(variant, v, pos).opacity);
	const x = useTransform(e, (v) => frameFor(variant, v, pos).x);
	const y = useTransform(e, (v) => {
		const f = frameFor(variant, v, pos);
		/* identity stays a plain 0 so no transform (and no stacking context) is emitted */
		return f.yPct === 0 ? f.y : `calc(${f.y}px + ${f.yPct}%)`;
	});
	const rotateX = useTransform(e, (v) => frameFor(variant, v, pos).rotateX);
	const scale = useTransform(e, (v) => frameFor(variant, v, pos).scale);
	const clipPath = useTransform(e, (v) => frameFor(variant, v, pos).clip);
	const filter = useTransform(e, (v) => {
		const b = frameFor(variant, v, pos).blur;
		return b > 0.05 ? `blur(${b}px)` : "none";
	});

	/* Portal flood + bridge copy. */
	const radius = useTransform(e, (v) => v * portalMaxRadius);
	const floodClip = useMotionTemplate`circle(${radius}% at ${pos})`;
	const bridgeIn = useTransform(p, (v) => smooth(bridgeRange[0], bridgeRange[1], v));
	const bridgeY = useTransform(bridgeIn, (v) => (1 - v) * 45);
	/* The bridge mounts as its window opens and unmounts before it, so an
	   invisible bridge never covers the stage or reaches the tab order. */
	const [bridgeOn, setBridgeOn] = useState(false);
	useMotionValueEvent(p, "change", (v) => setBridgeOn(v >= bridgeRange[0]));
	useEffect(() => setBridgeOn(p.get() >= bridgeRange[0]), [p, bridgeRange[0]]);

	/* will-change only while mid-flight (threshold crossings only). */
	const [live, setLive] = useState(false);
	useMotionValueEvent(p, "change", (v) => {
		const next = v > 0.001 && v < 0.999;
		setLive((prev) => (prev === next ? prev : next));
	});
	const willChange = live
		? CLIPPED.has(variant)
			? "transform, opacity, clip-path"
			: "transform, opacity"
		: undefined;

	/* ---- snap ---- */
	const snapOn = !reduce && variant !== "none";
	useProximitySnap(snapOn && snap === "proximity");
	useMagneticSnap(ref, snapOn && snap === "magnetic", snapThreshold, pinned);
	const sectionStyle: CSSProperties = {
		scrollSnapAlign: snapOn && snap === "proximity" ? "start" : undefined,
	};

	const content = typeof children === "function" ? children(p) : children;

	/* Reduced motion / no effect: plain static section. */
	if (reduce || variant === "none") {
		return (
			<section ref={ref} id={id} className={`relative ${className}`}>
				<div className={innerClassName}>{content}</div>
				{pinned && bridge ? <div className="relative">{bridge}</div> : null}
			</section>
		);
	}

	const animated = {
		opacity,
		x,
		y,
		scale,
		rotateX,
		clipPath,
		filter,
		willChange,
		/* perspective only where a 3D rotation exists (it forces a transform) */
		...(variant === "tilt-up"
			? { transformPerspective: 1200, transformOrigin: "50% 100%" }
			: null),
	};

	/* ---- pinned family: tall runway + sticky stage ---- */
	if (pinned) {
		return (
			<section
				ref={ref}
				id={id}
				className={`relative ${className}`}
				style={{ ...sectionStyle, height: `${100 + runway}svh` }}
			>
				<div className="sticky top-0 isolate h-[100svh] overflow-hidden">
					<motion.div className={`h-full w-full ${innerClassName}`} style={animated}>
						{content}
					</motion.div>

					{variant === "portal" && (
						<motion.div
							aria-hidden
							className={`pointer-events-none absolute inset-0 z-50 ${floodClassName}`}
							style={{
								clipPath: floodClip,
								willChange: live ? "clip-path" : undefined,
							}}
						>
							<div className="flex h-full w-full items-center justify-center px-5 sm:px-[clamp(20px,6vw,96px)]">
								{bridge ? (
									<motion.div
										className="w-full"
										style={{ opacity: bridgeIn, y: bridgeY }}
									>
										{bridge}
									</motion.div>
								) : null}
							</div>
						</motion.div>
					)}

					{/* The bridge on every other pinned variant: held on the
					    stage, above the effect, arriving with its window. */}
					{variant !== "portal" && bridge && bridgeOn ? (
						<div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5">
							<motion.div
								className="pointer-events-auto w-full"
								style={{ opacity: bridgeIn, y: bridgeY }}
							>
								{bridge}
							</motion.div>
						</div>
					) : null}
				</div>
			</section>
		);
	}

	/* ---- enter family: plain section, animated content ---- */
	return (
		<section
			ref={ref}
			id={id}
			className={`relative overflow-x-clip ${className}`}
			style={sectionStyle}
		>
			<motion.div className={innerClassName} style={animated}>
				{content}
			</motion.div>
		</section>
	);
}

export default ScrollSection;
