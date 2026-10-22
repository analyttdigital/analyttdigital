"use client";

import Link from '@/components/ui/link';
import { useEffect, useRef, useState } from "react";
import {
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
	type MotionValue,
} from "framer-motion";

import { MdiIcon } from "@/lib/icons/resolve-icon";
import { DynamicImage } from "@/components/media/dynamic-image";
import type { HeroPartner, HeroPanel, HeroProof, HeroSection } from "@/lib/content/types";
import { GlowButton } from "@/components/ui/glow-button";
// import { HeroGatherLite } from "@/components/ui/hero-gather-lite";
import { useLiteScene } from "@/lib/hooks/use-lite-scene";
import { smooth } from "@/lib/motion/smooth";
import dynamic from "next/dynamic";
import { TextReveal } from "../ui/text-reveal";

/* The WebGL gather pulls three.js + gsap — code-split so lite devices
 * (mobile / low-compute / save-data) never download it. SSR off: the
 * first paint is always the lite mark, desktops upgrade after hydration. */
const HeroGather = dynamic(
	() => import("@/components/ui/hero-gather").then((m) => m.HeroGather),
	{ ssr: false }
);

/**
 * Hero — full-screen audit route head (user-approved replica).
 *
 * The visitor's choices are honoured verbatim here: the glass result-tunnel,
 * pill audit link, halo copy block and proof strip ship as requested, even
 * where they break the Signal Mesh bans (rounded glass, blur, shadows, an
 * infinite loop, information inside decoration). That override was explicit.
 *
 * What still holds: token colours only (primary/accent/paper/ink families),
 * MDI resolution (no `iconify-icon` custom element), copy from the content
 * layer, `aria-hidden` on the decorative tunnel so it never carries
 * information for AT, and a static readable state under
 * `prefers-reduced-motion` / mobile (fewer panels, no parallax, no loop).
 *
 * Tunnel cards are data, not markup: every panel's copy lives in
 * `defaults.ts` (`hero.panels`, editable in Keystatic) and this file only
 * picks a layout by `panel.kind`. Empty `icon` keeps the kind's positional
 * default, per the shared icon convention.
 */

/** Fallback tunnel when the content layer carries no panels (legacy CMS entries). */
/*
const FALLBACK_PANELS: HeroPanel[] = [
	{
		kind: "cpl",
		title: "Cost per lead",
		subtitle: "ZoomTech Ke · Google Search",
		footer: "KES 1,800 → KES 280",
		delta: "-84% in 60 days",
		icon: "chartBox",
		bars: [100, 82, 64, 46, 31, 22, 17, 15],
	},
	{
		kind: "leads",
		title: "Kings Bliss Developers",
		value: "37",
		valueLabel: "property inquiries per week",
		footer: "9x growth from a KES 150K budget",
		icon: "pin",
	},
	{
		kind: "revenue",
		title: "Mandevu BeardCare",
		value: "KES 2.4M",
		valueLabel: "monthly revenue in 90 days",
		footer: "Up from a 1.1x ROAS",
		icon: "tag",
	},
	{
		kind: "seo",
		title: "Page 1 rankings",
		subtitle: "Mabati Yetu · 8 months",
		value: "47",
		valueLabel: "high-intent keywords",
		progress: 85,
	},
	{
		kind: "process",
		title: "Your 90-day plan",
		icon: "rocket",
		steps: [
			{ label: "Diagnose", state: "done" },
			{ label: "Blueprint", state: "done" },
			{ label: "Launch", state: "active" },
			{ label: "Optimise", state: "todo" },
			{ label: "Scale", state: "todo" },
		],
	},
	{
		kind: "code",
		title: "server-side tracking",
		icon: "document",
		codeLines: [
			"gtag('event', 'generate_lead',",
			"{ value: 280, currency: 'KES' }",
			"// conversion attributed",
		],
	},
	{
		kind: "alert",
		title: "Budget leak found",
		subtitle: "Most audits uncover KES 50K–200K in recoverable spend.",
		icon: "asterisk",
		tone: "alert",
	},
	{
		kind: "whatsapp",
		title: "New lead · WhatsApp",
		subtitle: "Instant follow-up from a retargeted virtual tour.",
		icon: "mail",
	},
	{
		kind: "simkar",
		title: "Simkar Group",
		icon: "chart",
		metrics: [
			{ value: "+45%", label: "lead generation" },
			{ value: "+80%", label: "content engagement" },
		],
	},
	{
		kind: "roas",
		title: "Blended ROAS",
		subtitle: "Mandevu · Meta + Google",
		footer: "Up from 1.1× in 90 days",
		delta: "+282%",
		icon: "chart",
		bars: [18, 26, 34, 47, 61, 77, 89, 100],
	},
	{
		kind: "attribution",
		title: "GA4 + GTM + server-side",
		value: "100%",
		valueLabel: "campaigns tracked to conversion",
		footer: "No vanity metrics reported",
		icon: "database",
	},
	{
		kind: "audit",
		title: "Measurement health",
		subtitle: "New account · 27 leaks fixed",
		value: "38 → 92",
		valueLabel: "audit score",
		delta: "+54 pts",
		progress: 92,
	},
	{
		kind: "ctr",
		title: "Prospecting CTR",
		subtitle: "TikTok + Meta · Nairobi",
		footer: "Benchmark 1.1%",
		delta: "3.8% · +2.7pts",
		icon: "bullhorn",
		bars: [30, 42, 38, 55, 68, 74, 88, 95],
	},
	{
		kind: "funnel",
		title: "Intent pages + lead scoring",
		value: "6.8%",
		valueLabel: "visitor → lead rate",
		footer: "Up from 2.1%",
		delta: "+224%",
		icon: "layers",
	},
	{
		kind: "partner",
		title: "Google",
		subtitle: "Search · YouTube · Analytics",
		logo: { src: "/img/partners/google.svg", alt: "Google" },
		logoDark: { src: "/img/partners/google-light.svg", alt: "Google" },
	},
	{
		kind: "partner",
		title: "Meta",
		subtitle: "Facebook · Instagram · WhatsApp",
		logo: { src: "/img/partners/meta.svg", alt: "Meta" },
		logoDark: { src: "/img/partners/meta-light.svg", alt: "Meta" },
	},
	{
		kind: "partner",
		title: "HubSpot",
		subtitle: "CRM & attribution",
		logo: { src: "/img/partners/hubspot.svg", alt: "HubSpot" },
		logoDark: { src: "/img/partners/hubspot-light.svg", alt: "HubSpot" },
	},
	{
		kind: "partner",
		title: "TikTok",
		subtitle: "Discovery & prospecting",
		logo: { src: "/img/partners/tiktok.svg", alt: "TikTok" },
		logoDark: { src: "/img/partners/tiktok-light.svg", alt: "TikTok" },
	},
	{
		kind: "partner",
		title: "LinkedIn",
		subtitle: "B2B demand",
		logo: { src: "/img/partners/linkedin.svg", alt: "LinkedIn" },
		logoDark: { src: "/img/partners/linkedin-light.svg", alt: "LinkedIn" },
	},
];
*/
/** Positional icon per layout — an explicit `icon` in content always wins. */
const DEFAULT_ICON: Record<HeroPanel["kind"], string> = {
	cpl: "chartBox",
	leads: "pin",
	revenue: "tag",
	seo: "chart",
	process: "rocket",
	code: "document",
	alert: "asterisk",
	whatsapp: "mail",
	simkar: "chart",
	roas: "chart",
	attribution: "database",
	audit: "crosshairs",
	ctr: "bullhorn",
	funnel: "layers",
	partner: "check",
};

/** Icon colour per panel — content-editable, token-only, Tailwind-static.
 *  `default` keeps the layout's positional colour (ember headers, soft metric
 *  icons); the three named tones map to fixed token classes so the JIT always
 *  sees full class literals. */
type IconTone = "accent" | "primary" | "muted";

function resolveIconTone(panel: HeroPanel, fallback: IconTone): IconTone {
	return panel.iconTone && panel.iconTone !== "default" ? panel.iconTone : fallback;
}

function iconTextClass(panel: HeroPanel, fallback: IconTone, dark = false) {
	const tone = resolveIconTone(panel, fallback);
	if (dark) {
		return tone === "accent"
			? "text-accent-300"
			: tone === "primary"
				? "text-primary-200"
				: "text-primary-300";
	}
	return tone === "accent"
		? "text-accent-600"
		: tone === "primary"
			? "text-primary-700"
			: "text-primary-500";
}

function iconTileClass(panel: HeroPanel, fallback: IconTone, dark = false) {
	const tone = resolveIconTone(panel, fallback);
	if (dark) {
		return tone === "accent"
			? "bg-accent-500/15 text-accent-300"
			: tone === "primary"
				? "bg-primary-50/10 text-primary-200"
				: "bg-primary-50/10 text-primary-300";
	}
	return tone === "accent"
		? "bg-accent-500/10 text-accent-600"
		: tone === "primary"
			? "bg-primary-700/10 text-primary-700"
			: "bg-primary-600/10 text-primary-500";
}

function iconDotClass(panel: HeroPanel, fallback: IconTone) {
	const tone = resolveIconTone(panel, fallback);
	return tone === "accent"
		? "bg-accent-500"
		: tone === "primary"
			? "bg-primary-700"
			: "bg-primary-500";
}

/** Panel interior tones per hero variant — one map so all seven layouts flip
 *  together. Ember stays the brand value (dots/bars read as marks, not type);
 *  type steps up the ramp on dark per the token rule. */
function panelTones(dark: boolean) {
	return {
		title: dark ? "text-primary-50" : "text-primary-800",
		client: dark ? "text-primary-200" : "text-primary-700",
		sub: dark ? "text-primary-300" : "text-primary-500",
		rule: dark ? "border-primary-50/10" : "border-primary-900/10",
		track: dark ? "bg-primary-50/10" : "bg-primary-900/10",
		barOff: dark ? "bg-primary-50/15" : "bg-primary-600/25",
		dotOff: dark ? "bg-primary-50/20" : "bg-primary-600/25",
		delta: dark ? "text-accent-300" : "text-accent-600",
	};
}

const FALLBACK = {
	eyebrow: "Free digital audit: find where your budget is leaking",
	headline: "Performance marketing &\ngrowth infrastructure.",
	sub: "We are a specialist performance marketing partner in paid media, measurement infrastructure, and growth strategy. Trusted by SMEs, startups, and B2B/B2C companies scaling across Africa.",
	cta: "Get Started",
} as const;

/** Fallback proof strip (legacy CMS entries without one). */
const FALLBACK_PROOF: HeroProof[] = [
	{ value: "100%", label: "campaigns tracked to conversion" },
	{ value: "7-day", label: "optimization cycle" },
	{ value: "Zero", label: "vanity metrics reported", ember: true },
];

/** Deterministic RNG so server and client render the same first frame. */
function mulberry32(seed: number) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Bars layout: cpl / roas / ctr — a falling or climbing spend story. */
function BarsPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	const bars = panel.bars?.length ? panel.bars : [100, 82, 64, 46, 31, 22, 17, 15];
	const t = panelTones(dark);
	return (
		<>
			<div className="mb-1 flex items-center justify-between">
				<span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
				<span className={iconTextClass(panel, "accent", dark)}>
					<MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
				</span>
			</div>
			{panel.subtitle ? (
				<span className={`mb-3 text-[10px] ${t.sub}`}>{panel.subtitle}</span>
			) : null}
			<div className="flex h-14 w-full items-end gap-1.5">
				{bars.map((h, i) => (
					<div
						key={`${h}-${i}`}
						style={{ height: `${h}%` }}
						className={`w-full rounded-t-sm ${i > 5 ? "bg-accent-500/80" : t.barOff}`}
					/>
				))}
			</div>
			<div className="mt-3 flex items-center justify-between text-[10px]">
				<span className={t.sub}>{panel.footer}</span>
				{panel.delta ? (
					<span className={`font-medium ${t.delta}`}>{panel.delta}</span>
				) : null}
			</div>
		</>
	);
}

/** Metric layout: leads / revenue / attribution / funnel — one big figure. */
function MetricPanel({ panel, dark, large }: { panel: HeroPanel; dark: boolean; large?: boolean }) {
	const footer = [panel.footer, panel.delta].filter(Boolean).join(" · ");
	const t = panelTones(dark);
	return (
		<div className="flex flex-col gap-1">
			<div className="flex w-full items-center justify-between">
				<span className={`text-xs font-medium ${t.client}`}>{panel.title}</span>
				<span className={iconTextClass(panel, "muted", dark)}>
					<MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
				</span>
			</div>
			{panel.value ? (
				<span
					className={`mt-1 font-medium tracking-tight ${t.title} ${large ? "text-3xl" : "text-2xl"}`}
				>
					{panel.value}
				</span>
			) : null}
			{panel.valueLabel ? (
				<span className={`text-[10px] ${t.sub}`}>{panel.valueLabel}</span>
			) : null}
			{footer ? (
				<div
					className={`mt-2 flex items-center gap-1 text-[10px] ${iconTextClass(panel, "accent", dark)}`}
				>
					<MdiIcon name="chart" size={0.6} />
					<span>{footer}</span>
				</div>
			) : null}
		</div>
	);
}

/** Progress layout: seo / audit — a figure with a completion bar. */
function ProgressPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	const t = panelTones(dark);
	return (
		<>
			<div className="flex items-start justify-between">
				<div className="flex flex-col gap-1">
					<span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
					{panel.subtitle ? (
						<span className={`text-[10px] ${t.sub}`}>{panel.subtitle}</span>
					) : null}
				</div>
				<div
					className={`h-2 w-2 rounded-full ${iconDotClass(panel, "accent")}`}
					aria-hidden
				/>
			</div>
			<div className="mt-3 flex items-baseline gap-1.5">
				{panel.value ? (
					<span className={`text-2xl font-medium ${t.title}`}>{panel.value}</span>
				) : null}
				{panel.valueLabel ? (
					<span className={`text-[10px] ${t.sub}`}>{panel.valueLabel}</span>
				) : null}
				{panel.delta ? (
					<span className={`text-[10px] font-medium ${t.delta}`}>{panel.delta}</span>
				) : null}
			</div>
			<div className={`mt-3 h-1 w-full rounded-full ${t.track}`}>
				<div
					className="h-full rounded-full bg-accent-500"
					style={{ width: `${panel.progress ?? 85}%` }}
				/>
			</div>
		</>
	);
}

/** Steps layout: process — the 90-day plan with per-step state. */
function StepsPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	const steps = panel.steps ?? [];
	const t = panelTones(dark);
	return (
		<>
			<div className={`mb-3 flex items-center gap-2 border-b pb-2 ${t.rule}`}>
				<span className={iconTextClass(panel, "accent", dark)}>
					<MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.7} />
				</span>
				<span className={`text-[10px] font-medium ${t.title}`}>{panel.title}</span>
			</div>
			<div className="flex flex-col gap-1.5 text-[11px]">
				{steps.map((step) => (
					<div
						key={step.label}
						className={`flex items-center gap-2 ${
							step.state === "active"
								? `font-medium ${t.title}`
								: step.state === "done"
									? t.client
									: t.sub
						}`}
					>
						<span
							className={`h-1.5 w-1.5 rounded-full ${
								step.state === "todo"
									? t.dotOff
									: `${iconDotClass(panel, "accent")}${step.state === "active" ? " motion-safe:animate-pulse" : ""}`
							}`}
						/>
						{step.label}
					</div>
				))}
			</div>
		</>
	);
}

/** Code layout: server-side tracking snippet, one editable line per row. */
function CodePanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	const lines = panel.codeLines ?? [];
	const t = panelTones(dark);
	return (
		<>
			<div className={`mb-3 flex items-center gap-2 border-b pb-2 ${t.rule}`}>
				<span className={iconTextClass(panel, "muted", dark)}>
					<MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.7} />
				</span>
				<span className={`text-[10px] font-medium ${t.title}`}>{panel.title}</span>
			</div>
			<div className={`flex flex-col gap-1.5 font-mono text-[10px] ${t.client}`}>
				{lines.map((line, i) => {
					if (line.trimStart().startsWith("//")) {
						return (
							<div key={`${line}-${i}`} className={t.delta}>
								{line}
							</div>
						);
					}
					if (line.trimStart().startsWith("{")) {
						return (
							<div key={`${line}-${i}`} className={`pl-3 ${t.title}`}>
								{line}
							</div>
						);
					}
					return <div key={`${line}-${i}`}>{line}</div>;
				})}
			</div>
		</>
	);
}

/** Notice layout: alert / whatsapp — an icon tile with two lines. */
function NoticePanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	const t = panelTones(dark);
	return (
		<div className="flex items-start gap-3">
			<div className={`rounded p-1.5 ${iconTileClass(panel, "accent", dark)}`}>
				<MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
			</div>
			<div className="flex flex-col gap-0.5">
				<span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
				{panel.subtitle ? (
					<span className={`text-[10px] leading-tight ${t.sub}`}>{panel.subtitle}</span>
				) : null}
			</div>
		</div>
	);
}

/** Dual layout: simkar — two side-by-side figures. */
function DualPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	const t = panelTones(dark);
	return (
		<>
			<div className="mb-3 flex items-center justify-between">
				<span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
				<span className={iconTextClass(panel, "accent", dark)}>
					<MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
				</span>
			</div>
			<div className="flex gap-5">
				{(panel.metrics ?? []).map((metric) => (
					<div key={metric.value} className="flex flex-col">
						<span className={`text-xl font-medium ${t.title}`}>{metric.value}</span>
						<span className={`text-[10px] ${t.sub}`}>{metric.label}</span>
					</div>
				))}
			</div>
		</>
	);
}

/** Logo layout: partner — the mark is the message, centred and prominent. */
function LogoPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	const t = panelTones(dark);
	const logo = dark && panel.logoDark?.src?.trim() ? panel.logoDark : panel.logo;
	return (
		<div className="flex flex-col gap-2">
			<span className={`text-xs font-medium ${t.client}`}>{panel.title}</span>
			<div className="relative flex h-16 items-center justify-center">
				<DynamicImage
					image={logo ?? null}
					className="h-full w-full object-contain"
					sizes="256px"
				/>
			</div>
			{panel.subtitle ? (
				<span className={`text-center text-[10px] ${t.sub}`}>{panel.subtitle}</span>
			) : null}
		</div>
	);
}

function PanelBody({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
	switch (panel.kind) {
		case "cpl":
		case "roas":
		case "ctr":
			return <BarsPanel panel={panel} dark={dark} />;
		case "leads":
			return <MetricPanel panel={panel} dark={dark} large />;
		case "revenue":
		case "attribution":
		case "funnel":
			return <MetricPanel panel={panel} dark={dark} />;
		case "seo":
		case "audit":
			return <ProgressPanel panel={panel} dark={dark} />;
		case "process":
			return <StepsPanel panel={panel} dark={dark} />;
		case "code":
			return <CodePanel panel={panel} dark={dark} />;
		case "alert":
		case "whatsapp":
			return <NoticePanel panel={panel} dark={dark} />;
		case "simkar":
			return <DualPanel panel={panel} dark={dark} />;
		case "partner":
			return <LogoPanel panel={panel} dark={dark} />;
	}
}

/** Partner marks rowed along the hero's foot (fallback when CMS list is empty). */
const FALLBACK_PARTNERS: HeroPartner[] = [
	{
		label: "Google Ads Partner",
		logo: { src: "/img/partners/google.svg", alt: "Google" },
		logoDark: { src: "/img/partners/google-light.svg", alt: "Google" },
	},
	{
		label: "Meta Business Partner",
		logo: { src: "/img/partners/meta.svg", alt: "Meta" },
		logoDark: { src: "/img/partners/meta-light.svg", alt: "Meta" },
	},
	{
		label: "TikTok Marketing Partner",
		logo: { src: "/img/partners/tiktok.svg", alt: "TikTok" },
		logoDark: { src: "/img/partners/tiktok-light.svg", alt: "TikTok" },
	},
	{
		label: "LinkedIn Marketing Partner",
		logo: { src: "/img/partners/linkedin.svg", alt: "LinkedIn" },
		logoDark: { src: "/img/partners/linkedin-light.svg", alt: "LinkedIn" },
	},
	{
		label: "HubSpot Solutions Partner",
		logo: { src: "/img/partners/hubspot.svg", alt: "HubSpot" },
		logoDark: { src: "/img/partners/hubspot-light.svg", alt: "HubSpot" },
	},
];

/* ------------------------------------------------------------------ */
/* HeroStage — the hero's chapters (copy, WebGL gather, proof, marquee). */
/*                                                                    */
/* The pin + portal flood live in the reusable `ScrollSection` wrapper  */
/* (see `section-renderer.tsx`): this stage renders inside its sticky  */
/* 100svh viewport and reads the wrapper's scroll progress `p` — one    */
/* framer-motion source, zero re-renders — for its choreography. Every  */
/* window below is a pure function of `p`: fully reversible.           */
/* ------------------------------------------------------------------ */

/** Supporting choreography windows (fractions of `p`). Keyed to
 *  `PORTAL_RANGE` ([0.35, 0.6] in `lib/motion/portal`): the copy rides out
 *  and parks as the flood starts opening, so nothing readable — or
 *  tappable — lingers under the covering circle. */
const CHAPTER_OUT_START = 0.22;
const CHAPTER_OUT_END = 0.35;
const TOOLBAR_FADE_START = 0.24;
const TOOLBAR_FADE_END = 0.36;
/** Past this point the copy is fully transparent, so it leaves the tab
 *  order and the pointer gives up the stage to the portal. The WebGL
 *  canvas itself stays visible — the model must be seen turning as the
 *  circle opens — and only parks its pointer interaction. */
const CONTROLS_PARK_AT = 0.36;
const FOOTER_FADE_START = 0.26;
const FOOTER_FADE_END = 0.38;
const CANVAS_SHIFT_START = 0.15;
const CANVAS_SHIFT_END = 0.33;
const CANVAS_SHIFT_AMOUNT = 0.12;
const CANVAS_GROW_START = 0.15;
const CANVAS_GROW_END = 0.45;
const CANVAS_GROW_DESKTOP = 0.28;
const CANVAS_GROW_MOBILE = 0.16;

export function HeroStage({
	hero,
	variant,
	progress,
}: {
	hero?: HeroSection;
	variant?: HeroSection["variant"];
	/** Scroll progress from the wrapping `ScrollSection` (portal runway). */
	progress?: MotionValue<number>;
}) {
	const eyebrow = hero?.eyebrow || FALLBACK.eyebrow;
	const lines = (hero?.headline || FALLBACK.headline).split("\n");
	const sub = hero?.sub || FALLBACK.sub;
	const ctaHref = hero?.ctaHref ?? "";
	const cta = hero?.cta || FALLBACK.cta;
	const proof = hero?.proof?.length ? hero.proof : FALLBACK_PROOF;
	const partners = hero?.marquee?.length ? hero.marquee : FALLBACK_PARTNERS;
	/** Explicit prop wins, then content, then the light stage. Tunnel panels
	 *  flip with the variant through `panelTones` + the icon tone helpers. */
	const dark = (variant ?? hero?.variant ?? "light") === "dark";
	const p = progress;

	/* ---- viewport size for the canvas drift ---- */
	const [isMobile, setIsMobile] = useState(false);
	/* Threshold-crossing flags only: the one acceptable state change on
	 * scroll. Everything else rides MotionValues with zero re-renders. */
	const [parked, setParked] = useState(false);
	const [footGone, setFootGone] = useState(false);
	const viewportW = useRef(0);

	useEffect(() => {
		const update = () => {
			viewportW.current = window.innerWidth;
			setIsMobile(
				window.innerWidth < 760 ||
					(window.innerHeight > window.innerWidth && window.innerWidth < 1024)
			);
		};
		update();
		window.addEventListener("resize", update);
		window.addEventListener("orientationchange", update);
		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("orientationchange", update);
		};
	}, []);

	useEffect(() => {
		if (!p) return;
		return p.on("change", (v) => {
			const nextParked = v > CONTROLS_PARK_AT;
			setParked((prev) => (prev === nextParked ? prev : nextParked));
			const nextFoot = v > FOOTER_FADE_END;
			setFootGone((prev) => (prev === nextFoot ? prev : nextFoot));
		});
	}, [p]);

	/* ---- the whole timeline as pure functions of `p` ---- */
	const fallback = useMotionValue(0);
	const src = p ?? fallback;
	const chapterOut = useTransform(src, (v) => smooth(CHAPTER_OUT_START, CHAPTER_OUT_END, v));
	const copyOpacity = useTransform(chapterOut, (v) => 1 - v);
	const copyY = useTransform(chapterOut, (v) => -v * 80);
	const toolbarOpacity = useTransform(
		src,
		(v) => 1 - smooth(TOOLBAR_FADE_START, TOOLBAR_FADE_END, v)
	);
	const footerOpacity = useTransform(
		src,
		(v) => 1 - smooth(FOOTER_FADE_START, FOOTER_FADE_END, v)
	);
	const glowOpacity = useTransform(src, (v) => 1 - smooth(CHAPTER_OUT_START, CHAPTER_OUT_END, v));
	const orbitTurn = useTransform(src, (v) => v * 140);
	const canvasX = useTransform(src, (v) =>
		isMobile
			? 0
			: -smooth(CANVAS_SHIFT_START, CANVAS_SHIFT_END, v) *
				viewportW.current *
				CANVAS_SHIFT_AMOUNT
	);
	const canvasScale = useTransform(
		src,
		(v) =>
			1 +
			smooth(CANVAS_GROW_START, CANVAS_GROW_END, v) *
				(isMobile ? CANVAS_GROW_MOBILE : CANVAS_GROW_DESKTOP)
	);

	const ground = dark ? "bg-primary-950 text-primary-100" : "bg-paper text-ink-800";

	return (
		/* The stage fills the wrapper's sticky viewport (the pin, the flood
		 * and the ground come from `ScrollSection`). It owns
		 * `overflow: hidden` so the full-bleed canvas never leaks. */
		<div
			data-hero-stage
			className={`group relative flex h-full min-h-[max(100svh,680px)] w-full flex-col overflow-hidden isolate font-sans ${ground}`}
		>
			<motion.div
				aria-hidden
				className={`absolute inset-0 -z-30 ${
					dark
						? "bg-primary-950 bg-[radial-gradient(55%_70%_at_70%_48%,rgba(240,79,38,.16),transparent_70%),radial-gradient(45%_55%_at_8%_100%,transparent_70%,transparent_70%)]"
						: "bg-paper bg-[radial-gradient(55%_70%_at_70%_48%,rgba(240,79,38,.11),transparent_70%),radial-gradient(45%_55%_at_8%_100%,transparent_70%,transparent_70%)]"
				}`}
				style={{ opacity: glowOpacity, rotate: orbitTurn }}
			/>

			<motion.div
				aria-hidden
				className="absolute inset-0"
				style={{ x: canvasX, scale: canvasScale }}
			>
				<HeroGather progress={p} />
			</motion.div>

			{/* Copy block — bottom on mobile, vertically centered on desktop.
			    Rides out on `chapterOut`, then leaves the tab order once fully
			    transparent so the portal owns the stage. */}
			<motion.div
				className="relative z-30 flex flex-1 items-end px-5 sm:px-[clamp(20px,6vw,96px)] md:items-center"
				style={{
					opacity: copyOpacity,
					y: copyY,
					visibility: parked ? "hidden" : "visible",
				}}
			>
				<div className="mx-auto w-full max-w-7xl pb-3 md:pb-1">
					<div className="w-full max-w-[760px]">
						<Link
							href={ctaHref}
							className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all ${
								dark
									? "border-primary-50/15 bg-primary-900/80 text-accent-400 hover:border-accent-500/40 hover:text-accent-300"
									: "border-primary-900/15 bg-paper/80 text-accent hover:border-accent-500/40 hover:text-accent-600"
							}`}
							style={{
								boxShadow: "0 2px 10px rgb(var(--color-primary-600) / 0.06)",
							}}
						>
							{eyebrow}
							<MdiIcon name="arrowRight" className="text-accent-300" size={0.55} />
						</Link>

						<h1
							className={`font-display text-[clamp(1.6rem,4.2vw,3.6rem)] font-bold leading-[1.02] tracking-tightest ${
								dark ? "text-primary-50" : "text-primary-800"
							}`}
						>
							{lines.map(
								(line, i) =>
									line && (
										<TextReveal
											as="span"
											className={`block whitespace-nowrap ${i === lines.length - 1 ? (dark ? "text-accent-400" : "text-accent-600") : ""}`}
											text={line}
											delay={i * 0.1}
											key={`${line}-${i}`}
										/>
									)
							)}
						</h1>

						{sub && (
							<p
								className={`mt-[10px] md:mt-[18px] max-w-[30em] text-sm md:text-base md:leading-relaxed sm:mt-6 ${dark ? "text-primary-200" : "text-ink-500"}`}
							>
								{sub}
							</p>
						)}

						{ctaHref && (
							<motion.div
								data-rise
								className="mt-4 md:mt-[26px] flex flex-wrap items-center gap-4 sm:gap-[22px]"
								style={{ opacity: toolbarOpacity }}
							>
								<GlowButton
									data={{ label: cta, href: ctaHref, leadIcon: "message" }}
									className="w-auto"
                                    tone="ember"
								/>
							</motion.div>
						)}

						<motion.div
							className="mt-[10px] md:mt-11"
							style={{ opacity: toolbarOpacity }}
						>
							<div
								aria-hidden
								className="mb-5 h-0 lg:h-px bg-accent-500 sm:mb-[16px]"
								style={{
									maskImage:
										"linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
									WebkitMaskImage:
										"linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
								}}
							/>
							<div className="grid grid-cols-3 gap-4 md:grid-cols-[repeat(3,auto)] md:justify-start md:gap-14">
								{proof.map((item, i) => {
									const m = /^(-?)(\d+)(.*)$/.exec(item.value);
									return (
										<div data-rise key={`${item.value}-${i}`}>
											<b
												{...(m
													? {
															"data-to": m[2],
															"data-pre": m[1],
															"data-suf": m[3],
														}
													: {})}
												className={`block font-display text-[clamp(1.35rem,2.2vw,1.2rem)] md:text-[clamp(1.35rem,2.2vw,1.9rem)] text-center mdfont-bold tracking-tightest ${dark ? "text-primary-50" : ""}`}
											>
												{item.value}
											</b>
											<span
												className={`mt-0.5 block max-w-[11em] text-xs md:text-[.78rem] leading-snug text-center ${dark ? "text-primary-300" : "text-ink-400"}`}
											>
												{item.label}
											</span>
										</div>
									);
								})}
							</div>
						</motion.div>
					</div>
				</div>
			</motion.div>

			{/* Partner marquee — bottom of the hero; rides out as the footer cue */}
			<motion.div
				className={`relative z-30 mx-auto w-full max-w-7xl overflow-hidden  py-5 px-5 sm:px-[clamp(20px,6vw,96px)] ${dark ? "border-primary-50/15" : "border-primary-900/15"}`}
				aria-label="Partners"
				style={{
					maskImage:
						"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
					opacity: footerOpacity,
					visibility: footGone ? "hidden" : "visible",
				}}
			>
				<div className="flex w-max animate-marquee motion-reduce:animate-none">
					{[0, 1].map((copy) => (
						<div
							key={copy}
							aria-hidden={copy === 1}
							className="flex items-center gap-16 pr-16"
						>
							{partners.map((p, i) => {
								const logo = dark && p.logoDark?.src?.trim() ? p.logoDark : p.logo;
								return (
									<div
										key={`${p.label}-${i}`}
										className="flex items-center gap-3"
									>
										<img
											src={logo.src}
											alt={copy === 0 ? logo.alt : ""}
											className="h-4 w-auto opacity-80 transition-opacity hover:opacity-100 md:h-6"
										/>
										<span
											className={`whitespace-nowrap text-xs md:text-sm font-medium tracking-tight ${dark ? "text-primary-200" : "text-primary-700"}`}
										>
											{p.label}
										</span>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
