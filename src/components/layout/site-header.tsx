"use client";

import {
	forwardRef,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import type {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	HTMLAttributes,
	KeyboardEvent as ReactKeyboardEvent,
	MouseEvent as ReactMouseEvent,
	PointerEvent as ReactPointerEvent,
	ReactNode,
	RefObject,
} from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useIsPresent, useReducedMotion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import { MdiIcon } from "@/lib/icons/resolve-icon";
import { motionTokens } from "@/lib/motion/motion-tokens";
import { aboutRevealDistance } from "@/lib/motion/portal";
import { useScrolled } from "@/lib/hooks";
import type { ContentImage, LayoutContent } from "@/lib/content/types";
import { s } from "framer-motion/client";

export type SiteHeaderVariant = "simple" | "centered" | "mega";

/** One destination inside a mega menu panel. */
export interface SiteHeaderLink {
	label: string;
	/** One short line under the label. */
	description?: string;
	/** A plain decorative icon beside the label. */
	icon?: ReactNode;
	href?: string;
}

/** A card beside the links in a mega menu panel. */
export interface SiteHeaderFeature {
	title: string;
	description?: string;
	href?: string;
	image?: { src: string; alt: string };
}

/** A top level destination. With `links` and the mega variant it opens a panel; otherwise it is a plain link. */
export interface SiteHeaderItem {
	/** Stable value, also used for `current`. */
	value: string;
	label: string;
	href?: string;
	links?: SiteHeaderLink[];
	feature?: SiteHeaderFeature;
}

export interface SiteHeaderAction {
	label: string;
	href?: string;
	onClick?: () => void;
}

/** What `onNavigate` receives. */
export interface SiteHeaderDestination {
	label: string;
	href?: string;
	/** The top level item the destination belongs to. */
	section?: string;
}

export interface SiteHeaderClasses {
	root?: string;
	nav?: string;
	navList?: string;
	navItem?: string;
	navItemButton?: string;
	navItemLink?: string;
	navItemIndicator?: string;
	navItemHover?: string;
	panel?: string;
	panelFace?: string;
	panelLink?: string;
	panelLinkIcon?: string;
	panelLinkLabel?: string;
	panelLinkDescription?: string;
	panelFeature?: string;
	panelFeatureImage?: string;
	panelFeatureTitle?: string;
	panelFeatureDescription?: string;
	panelFeatureLink?: string;
}
export interface SiteHeaderProps {
	/** `simple` puts links beside the brand, `centered` centers them in a quiet capsule, `mega` opens panels for items with links. */
	variant?: SiteHeaderVariant;
	brand?: { name: string; href?: string; mark?: ReactNode };
	/** Wordmark shown when the header is transparent (`data-scrolled` absent). */
	logo?: ContentImage;
	/** Wordmark shown once the header turns solid (`data-scrolled` present). */
	logoAlt?: ContentImage;
	items?: SiteHeaderItem[];
	/** Value of the item that holds the current page (controlled). */
	current?: string;
	/** Initial current item when uncontrolled. */
	defaultCurrent?: string;
	/** Called when a destination inside an item is chosen, with that item's value. */
	onCurrentChange?: (value: string) => void;
	/** Called for every destination: items, panel links, the brand, and actions with an href. */
	onNavigate?: (destination: SiteHeaderDestination) => void;
	/** A quiet action before the primary one, such as Sign in. Pass null to hide it. */
	secondaryAction?: SiteHeaderAction | null;
	/** The one primary action at the end of the bar. Pass null to hide it. */
	primaryAction?: SiteHeaderAction | null;
	/** Sticks to the top of its scroll container. Defaults to true. */
	sticky?: boolean;
	/** The element that scrolls, when it is not the window. The header turns solid once it scrolls. */
	scrollContainer?: RefObject<HTMLElement | null>;
	/** Pixels of scroll before the background turns solid. Defaults to the
	 *  About-bridge reveal distance when the hero portal is on the page
	 *  (the header turns solid as the flood starts carrying the bridge),
	 *  else 256. */
	scrollThreshold?: number;
	/** Accessible name of the navigation landmark. */
	label?: string;
	className?: string;
	classes?: SiteHeaderClasses;
}

type Bezier = [number, number, number, number];
const enter = [...motionTokens.ease.enter] as Bezier;
const standard = [...motionTokens.ease.standard] as Bezier;
/** Duration based springs restated as stiffness and damping, so a retarget keeps the velocity already in flight. */
const physical = (visualDuration: number, bounce: number): Transition => {
	const root = (2 * Math.PI) / (visualDuration * 1.2);
	return { type: "spring", stiffness: root * root, damping: 2 * (1 - bounce) * root, mass: 1 };
};
const GROW = physical(0.44, 0.12),
	SHRINK = physical(0.34, 0),
	GLIDE = physical(0.3, 0.1),
	SLIDE = physical(0.4, 0.06);
const HOVER_INTENT = 70,
	LEAVE_GRACE = 180,
	TRAVEL = 36;
/** Matches the named-container responsive breakpoint used by the header. */
const COLLAPSE_BELOW = 760;

/** Panel content slides in from the side of the newly opened item; opening from closed drops in from the bar. */
const faceVariants: Variants = {
	hidden: (direction: number) => ({
		opacity: 0,
		x: direction * TRAVEL,
		y: direction ? 0 : -6,
		filter: `blur(${motionTokens.blur.subtle}px)`,
	}),
	shown: {
		opacity: 1,
		x: 0,
		y: 0,
		filter: "blur(0px)",
		transition: {
			x: SLIDE,
			y: SLIDE,
			opacity: { duration: motionTokens.duration.fast, ease: enter, delay: 0.02 },
			filter: { duration: motionTokens.duration.standard, ease: enter },
		},
	},
	gone: (direction: number) => ({
		opacity: 0,
		x: direction * -TRAVEL * 0.6,
		filter: `blur(${motionTokens.blur.subtle}px)`,
		transition: {
			x: SLIDE,
			opacity: { duration: motionTokens.duration.instant, ease: standard },
			filter: { duration: motionTokens.duration.instant, ease: standard },
		},
	}),
};
const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	shown: { opacity: 1, transition: { duration: motionTokens.duration.fast } },
	gone: { opacity: 0, transition: { duration: motionTokens.duration.instant } },
};

export function ArcMark(props: { className?: string }) {
	return (
		<svg
			className={props.className}
			viewBox="0 0 64 64"
			fill="none"
			stroke="currentColor"
			strokeWidth="5.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M9 48V29C9 15 19 7 32 7s23 8 23 22v19" />
			<path d="M20 48V31c0-8 5-13 12-13s12 5 12 13v17" />
			<path d="M32 38v10" />
		</svg>
	);
}


export const siteHeaderExampleItems: SiteHeaderItem[] = [
	{
		value: "product",
		label: "Product",
		links: [
			{
				label: "Components",
				description: "140 interactive React components",
				icon: <MdiIcon name="widgets" size={16 / 24} />,
			},
			{
				label: "Blocks",
				description: "Complete sections, ready to ship",
				icon: <MdiIcon name="panels" size={16 / 24} />,
			},
			{
				label: "Templates",
				description: "Starter sites with every page",
				icon: <MdiIcon name="template" size={16 / 24} />,
			},
			{
				label: "Themes",
				description: "Tune color, radius, and motion",
				icon: <MdiIcon name="palette" size={16 / 24} />,
			},
		],
		feature: {
			title: "What's new in 2.4",
			description: "Site headers, footers, and hero sections.",
			image: { src: '/media/banner1.png', alt: 'Whats new in 2.4' },
		},
	},
	{
		value: "resources",
		label: "Resources",
		links: [
			{
				label: "Documentation",
				description: "Install, theme, and compose",
				icon: <MdiIcon name="book" size={16 / 24} />,
			},
			{
				label: "Guides",
				description: "Patterns for real product work",
				icon: <MdiIcon name="route" size={16 / 24} />,
			},
			{
				label: "Changelog",
				description: "Every release, week by week",
				icon: <MdiIcon name="history" size={16 / 24} />,
			},
			{
				label: "Community",
				description: "Questions, answers, and showcases",
				icon: <MdiIcon name="forum" size={16 / 24} />,
			},
		],
	},
	{ value: "pricing", label: "Pricing" },
	{ value: "customers", label: "Customers" },
];

/** Fallback wordmarks, matching the layout content defaults. */
export const siteHeaderDefaultLogo: ContentImage = { src: "/img/logo-alt.svg", alt: "Analytt Digital" };
export const siteHeaderDefaultLogoAlt: ContentImage = { src: "/img/logo-alt-light.svg", alt: "Analytt Digital" };

function pickImage(
	layoutImage: ContentImage | undefined,
	overrideImage: ContentImage | undefined,
	fallback: ContentImage
): ContentImage {
	if (layoutImage?.src?.trim()) return layoutImage;
	if (overrideImage?.src?.trim()) return overrideImage;
	return fallback;
}

/**
 * Derive `SiteHeader` props from the shared layout content (Keystatic
 * `layout-<locale>` singleton merged over code defaults by the reader).
 *
 * Layout values take priority over `overrides`: pass through props (tests,
 * previews, one-off pages) only win where the layout has nothing to say
 * (empty nav list, missing brand href). The nav links become plain header
 * items (`value` is the href, falling back to the label) and the nav CTA
 * becomes the primary action; an empty CMS CTA hides it (`null`).
 */
export function siteHeaderPropsFromLayout(
	layout?: LayoutContent,
	overrides: Partial<SiteHeaderProps> = {}
): SiteHeaderProps {
	const brandName =
		layout != null
			? `${layout.brand ?? ""} ${layout.brandEmphasis ?? ""}`.trim()
			: (overrides.brand?.name ?? "Brand");
	const items =
		layout?.navLinks?.length
			? layout.navLinks.map((link) => ({
					value: link.href || link.label,
					label: link.label,
					href: link.href || undefined,
					// Submenu entries become mega-panel links (same shape, no
					// descriptions); an item without children stays a plain link.
					...(link.children?.length
						? {
								links: link.children.map((child) => ({
									label: child.label,
									href: child.href || undefined,
								})),
							}
						: null),
				}))
			: (overrides.items ?? siteHeaderExampleItems);
	const primaryAction = layout
		? layout.navCta
			? { label: layout.navCta, href: layout.navCtaHref || undefined }
			: null
		: (overrides.primaryAction ?? { label: "Get Quote" });
	return {
		variant:
			overrides.variant ?? (items.some((item) => item.links?.length) ? "mega" : "centered"),
		brand: { ...overrides.brand, name: brandName, href: overrides.brand?.href ?? "/" },
		logo: pickImage(layout?.logo, overrides.logo, siteHeaderDefaultLogo),
		logoAlt: pickImage(layout?.logoAlt, overrides.logoAlt, siteHeaderDefaultLogoAlt),
		items,
		secondaryAction: overrides.secondaryAction ?? null,
		primaryAction,
		sticky: overrides.sticky,
		scrollContainer: overrides.scrollContainer,
		scrollThreshold: overrides.scrollThreshold,
		label: overrides.label,
		className: overrides.className,
		classes: overrides.classes,
	};
}



/** A panel face reports its natural height while current; a leaving face floats out of flow and turns inert. */
function Face({
	direction,
	reduced,
	onHeight,
	className,
	children,
}: {
	direction: number;
	reduced: boolean;
	onHeight: (height: number) => void;
	className?: string;
	children: ReactNode;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const present = useIsPresent();
	useLayoutEffect(() => {
		const node = ref.current;
		if (!node || !present) return;
		onHeight(node.offsetHeight);
		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(() => onHeight(node.offsetHeight));
		observer.observe(node);
		return () => observer.disconnect();
	}, [present, onHeight]);
	return (
		<motion.div
			ref={ref}
			className={`relative p-3 ${className ?? ""}`}
			data-face=""
			data-leaving={present ? undefined : ""}
			inert={!present}
			custom={direction}
			variants={reduced ? fadeVariants : faceVariants}
			initial="hidden"
			animate="shown"
			exit="gone"
		>
			{children}
		</motion.div>
	);
}

type DestinationProps = Omit<HTMLAttributes<HTMLElement>, "onClick" | "children"> & {
	link: { href?: string; label: string };
	onChoose: (event: ReactMouseEvent) => void;
	children: ReactNode;
};
/** Renders an anchor when the destination has an href and a button otherwise, so demos and real sites share one path. */
function Destination({ link, onChoose, children, ...rest }: DestinationProps) {
	return link.href ? (
		<a
			{...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
			href={link.href}
			onClick={onChoose}
		>
			{children}
		</a>
	) : (
		<button
			{...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
			type="button"
			onClick={onChoose}
		>
			{children}
		</button>
	);
}

/**
 * A website header in three layouts. It sticks to the top and turns solid once the page scrolls, marks the current section
 * with an indicator that glides between links, opens springy mega menu panels whose content slides in from the side you
 * moved toward, and folds into a menu sheet on narrow containers.
 */
export const SiteHeader = forwardRef<HTMLElement, SiteHeaderProps>(function SiteHeader(
    {
        variant = "centered",
        brand = { name: "Brand" },
        logo = siteHeaderDefaultLogo,
        logoAlt = siteHeaderDefaultLogoAlt,
        items = siteHeaderExampleItems,
        current: currentProp,
        defaultCurrent,
        onCurrentChange,
        onNavigate,
        secondaryAction,
        primaryAction = { label: "Get Quote" },
        sticky = true,
        scrollContainer,
        scrollThreshold,
        label = "Main",
        className,
        classes,
	},
	ref
) {
	const id = useId();
	const reduced = !!useReducedMotion();
	/* Without an explicit threshold, the header turns solid once the About
	 * bridge starts revealing inside the hero portal flood (measured from
	 * the portal runway, so it tracks viewport height and layout). Falls
	 * back to 256px when no hero portal is on the page. */
	const [bridgeAt, setBridgeAt] = useState<number | null>(null);
	useEffect(() => {
		if (scrollThreshold != null) return;
        const measure = () => {
            const distance = aboutRevealDistance();
            setBridgeAt(distance || 0 + 25);
        };
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, [scrollThreshold]);
	const scrolled = useScrolled(scrollThreshold ?? bridgeAt ?? 256, scrollContainer);
	const [innerCurrent, setInnerCurrent] = useState(defaultCurrent);
	const current = currentProp ?? innerCurrent;
	const [hovered, setHovered] = useState<string | null>(null);
	const [open, setOpen] = useState<{ value: string; direction: number } | null>(null);
	const [panel, setPanel] = useState<{ height: number | null; grow: boolean }>({
		height: null,
		grow: true,
	});
	const [menuOpen, setMenuOpen] = useState(false);
	const [expanded, setExpanded] = useState<string | null>(null);
	const rootRef = useRef<HTMLElement | null>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const triggerRefs = useRef(new Map<string, HTMLButtonElement | HTMLAnchorElement>());
	const panelRef = useRef<HTMLDivElement>(null);
	const openTimer = useRef<number | undefined>(undefined),
		closeTimer = useRef<number | undefined>(undefined);
	const focusFirst = useRef(false);
	const hasPanels = variant === "mega";
	const openItem = open ? items.find((item) => item.value === open.value) : undefined;

	const setRefs = useCallback(
		(node: HTMLElement | null) => {
			rootRef.current = node;
			if (typeof ref === "function") ref(node);
			else if (ref) ref.current = node;
		},
		[ref]
	);

	const clearTimers = useCallback(() => {
		window.clearTimeout(openTimer.current);
		window.clearTimeout(closeTimer.current);
	}, []);
	useEffect(() => clearTimers, [clearTimers]);

	const openPanel = useCallback(
		(value: string | null) => {
			setOpen((previous) => {
				if (!value) return null;
				if (previous?.value === value) return previous;
				const from = previous
					? items.findIndex((item) => item.value === previous.value)
					: -1;
				const to = items.findIndex((item) => item.value === value);
				return { value, direction: from < 0 ? 0 : Math.sign(to - from) };
			});
			if (!value) setPanel({ height: null, grow: true });
		},
		[items]
	);

	const close = useCallback(
		(restoreFocus = false) => {
			clearTimers();
			const was = open?.value;
			openPanel(null);
			if (restoreFocus && was) triggerRefs.current.get(was)?.focus();
		},
		[open, openPanel, clearTimers]
	);

	const closeMenu = useCallback((restoreFocus = false) => {
		setMenuOpen(false);
		setExpanded(null);
		if (restoreFocus) menuButtonRef.current?.focus();
	}, []);

	const choose = useCallback(
		(destination: SiteHeaderDestination, section: string | undefined) => {
			if (section) {
				if (currentProp === undefined) setInnerCurrent(section);
				onCurrentChange?.(section);
			}
			onNavigate?.(destination);
			close();
			closeMenu();
		},
		[close, closeMenu, currentProp, onCurrentChange, onNavigate]
	);

	// Outside presses and Escape close whichever layer is open.
	useEffect(() => {
		if (!open && !menuOpen) return;
		const onPointer = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				close();
				closeMenu();
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				if (open) close(true);
				else closeMenu(true);
			}
		};
		document.addEventListener("pointerdown", onPointer);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onPointer);
			document.removeEventListener("keydown", onKey);
		};
	}, [open, menuOpen, close, closeMenu]);

	// The sheet belongs to narrow layouts: widening the container closes it, and it holds the page still while open.
	useEffect(() => {
		const node = rootRef.current;
		if (!node || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return;
			if (entry.contentRect.width >= COLLAPSE_BELOW) {
				setMenuOpen(false);
				setExpanded(null);
			} else setOpen(null);
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	useEffect(() => {
		if (!menuOpen) return;
		const scroller: HTMLElement = scrollContainer?.current ?? document.documentElement;
		const previous = scroller.style.getPropertyValue("overflow");
		scroller.style.setProperty("overflow", "hidden");
		return () => {
			if (previous) scroller.style.setProperty("overflow", previous);
			else scroller.style.removeProperty("overflow");
		};
	}, [menuOpen, scrollContainer]);

	useEffect(() => {
		if (!open || !focusFirst.current) return;
		focusFirst.current = false;
		const frame = requestAnimationFrame(() =>
			panelRef.current?.querySelector<HTMLElement>("[data-panel-link]")?.focus()
		);
		return () => cancelAnimationFrame(frame);
	}, [open]);

	function onTriggerPointerEnter(event: ReactPointerEvent, value: string) {
		if (event.pointerType !== "mouse") return;
		window.clearTimeout(closeTimer.current);
		window.clearTimeout(openTimer.current);
		if (open) openPanel(value);
		else openTimer.current = window.setTimeout(() => openPanel(value), HOVER_INTENT);
	}
	function onRegionPointerLeave(event: ReactPointerEvent) {
		if (event.pointerType !== "mouse") return;
		window.clearTimeout(openTimer.current);
		closeTimer.current = window.setTimeout(() => openPanel(null), LEAVE_GRACE);
	}
	function onRegionPointerEnter(event: ReactPointerEvent) {
		if (event.pointerType === "mouse") window.clearTimeout(closeTimer.current);
	}

	function onNavKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
		const triggers = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>("[data-nav-item]")
		);
		const index = triggers.indexOf(document.activeElement as HTMLElement);
		if (index < 0) return;
		event.preventDefault();
		const nextIndex =
			(index + (event.key === "ArrowRight" ? 1 : -1) + triggers.length) % triggers.length;
		triggers[nextIndex]!.focus();
		if (open) {
			const item = items[nextIndex];
			openPanel(item && hasPanels && item.links?.length ? item.value : null);
		}
	}
	function onTriggerKeyDown(event: ReactKeyboardEvent, value: string) {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			focusFirst.current = true;
			openPanel(value);
			if (open?.value === value)
				panelRef.current?.querySelector<HTMLElement>("[data-panel-link]")?.focus();
		}
	}
	function onPanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
		if (
			event.key !== "ArrowDown" &&
			event.key !== "ArrowUp" &&
			event.key !== "Home" &&
			event.key !== "End"
		)
			return;
		const unique = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>(
				"[data-face]:not([data-leaving]) [data-panel-link]"
			)
		);
		if (!unique.length) return;
		event.preventDefault();
		const index = unique.indexOf(document.activeElement as HTMLElement);
		const next =
			event.key === "Home"
				? 0
				: event.key === "End"
					? unique.length - 1
					: event.key === "ArrowDown"
						? Math.min(index + 1, unique.length - 1)
						: index - 1;
		if (next < 0) {
			close(true);
			return;
		}
		unique[next]?.focus();
	}

	// Growing carries a little life; shrinking settles without overshoot.
	const onHeight = useCallback(
		(height: number) =>
			setPanel((previous) =>
				previous.height === height
					? previous
					: { height, grow: previous.height === null || height > previous.height }
			),
		[]
	);

	const actionNode = (action: SiteHeaderAction, kind: "secondary" | "primary", extra = "") => {
		const onClick = () => {
			action.onClick?.();
			if (action.href) onNavigate?.({ label: action.label, href: action.href });
			closeMenu();
		};
		return action.href ? (
			<a className={`inline-flex h-9 cursor-pointer items-center justify-center whitespace-nowrap border border-transparent px-3.5 text-sm font-medium rounded-full no-underline transition-[transform,background-color,opacity] duration-150 active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none ${kind === "secondary" ? "bg-transparent text-primary-500 hover:bg-primary-800 hover:text-paper" : "bg-accent text-paper hover:opacity-90"} ${extra}`} href={action.href} onClick={onClick}>
				{action.label}
			</a>
		) : (
			<button type="button" className={`inline-flex h-9 cursor-pointer items-center justify-center whitespace-nowrap border border-transparent px-3.5 text-sm font-medium rounded-full no-underline transition-[transform,background-color,opacity] duration-150 active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none ${kind === "secondary" ? "bg-transparent text-primary-500 hover:bg-primary-800 hover:text-paper" : "bg-accent text-paper hover:opacity-90"} ${extra}`} onClick={onClick}>
				{action.label}
			</button>
		);
	};

	const brandNode = (
		<Destination
			link={{ label: brand.name, href: brand.href }}
			className={`relative inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent py-2 pr-2 text-base font-medium text-primary no-underline ${scrolled || menuOpen || !!open ? "hover:text-primary-300" : "hover:text-primary-500"} ${classes?.navItem ?? ""}`}
			aria-label={brand.name}
			onChoose={() => {
				onNavigate?.({ label: brand.name, href: brand.href });
				close();
				closeMenu();
			}}
		>
			{logo?.src?.trim() ? (
				/* Both marks ride stacked at identical size and crossfade with
				 * `data-scrolled`, so the swap never shifts layout. */
				<span className="relative flex shrink-0 items-center">
					<Image
						src={logo.src}
						alt={logo.alt || brand.name}
						width={160}
						height={40}
						priority={true}
						className={`h-7 w-auto transition-opacity duration-300 ${scrolled || menuOpen || !!open ? "opacity-0" : "opacity-100"}`}
						aria-hidden={scrolled || menuOpen || !!open}
					/>
					<Image
						src={logoAlt?.src?.trim() ? logoAlt.src : logo.src}
						alt=""
						width={160}
						height={40}
						priority={true}
						className={`absolute inset-0 h-7 w-auto transition-opacity duration-300 ${scrolled || menuOpen || !!open ? "opacity-100" : "opacity-0"}`}
						aria-hidden={!(scrolled || menuOpen || !!open)}
					/>
				</span>
			) : (
				<>
					{brand.mark ?? <ArcMark className="h-[22px] w-[22px] shrink-0" />}
					{brand.name && <span>{brand.name}</span>}
				</>
			)}
		</Destination>
	);

	return (
		<header
			ref={setRefs}
			className={[
				"relative z-20 [container-type:inline-size] [container-name:site-header] bg-transparent font-sans text-ink transition-colors duration-200 data-[scrolled]:backdrop-blur-lg data-[scrolled]:bg-primary-900 data-[scrolled]:text-paper motion-reduce:transition-none",
				sticky ? "sticky top-0" : "",
				className,
				classes?.root,
			]
				.filter(Boolean)
				.join(" ")}
			data-variant={variant}
			data-scrolled={scrolled || menuOpen || !!open ? "" : undefined}
		>
			<div
				className="relative mx-auto max-w-[1200px] px-6 [@container_site-header_(max-width:759px)]:px-4"
				onPointerLeave={onRegionPointerLeave}
				onPointerEnter={onRegionPointerEnter}
			>
				<div
					className={`flex h-16 items-center gap-2 ${variant === "centered" ? "grid-cols-[1fr_auto_1fr] [@container_site-header_(max-width:759px)]:flex" : ""}`}
				>
					<div className="flex min-w-0">{brandNode}</div>
					<LayoutGroup id={id}>
						<nav
							className={`min-w-0 [@container_site-header_(max-width:759px)]:hidden ${variant === "centered" ? "mx-auto" : "ml-4 "} ${classes?.nav ?? ""}`}
							aria-label={label}
							onKeyDown={onNavKeyDown}
							onPointerLeave={() => setHovered(null)}
						>
							<ul
								className={`m-0 flex flex-1 list-none items-center gap-0.5 p-0 ${variant === "centered" ? "" : ""} ${classes?.navList ?? ""}`}
							>
								{items.map((item) => {
									const isCurrent = current === item.value;
									const withPanel = hasPanels && !!item.links?.length;
									const isOpen = open?.value === item.value;
									const panelId = `${id}-panel`;
									const common = {
										className: `group relative isolate inline-flex h-9 cursor-pointer select-none items-center gap-1 whitespace-nowrap border-0 bg-transparent px-3 text-sm font-medium no-underline transition-colors duration-150 hover:text-paper-500 data-[current]:text-accent data-[open]:text-accent motion-reduce:transition-none ${variant === "centered" ? "h-8 rounded-full px-3.5" : ""} ${classes?.navItem ?? ""}`,
										"data-nav-item": "",
										"data-current": isCurrent ? "" : undefined,
										"data-open": isOpen ? "" : undefined,
										"data-scrolled": scrolled,
										onPointerEnter: (event: ReactPointerEvent) => {
											if (event.pointerType === "mouse")
												setHovered(item.value);
											if (withPanel) onTriggerPointerEnter(event, item.value);
											else if (event.pointerType === "mouse" && open)
												closeTimer.current = window.setTimeout(
													() => openPanel(null),
													LEAVE_GRACE
												);
										},
										onFocus: () => setHovered(null),
									};
									const decorations = (
										<>
											{hovered === item.value && variant !== "centered" && (
												<motion.span
													key={`hover-${variant}`}
													layoutId={`hover-${variant}`}
													className={`absolute inset-0 -z-10 bg-primary-800 ${classes?.navItemHover ?? ""}`}
													transition={reduced ? { duration: 0 } : GLIDE}
													aria-hidden="true"
												/>
											)}
											{isCurrent && (
												<motion.span
													key={`current-${variant}`}
													layoutId={`current-${variant}`}
													className={`absolute inset-x-3 bottom-1 h-0.5 bg-accent-500 ${variant === "centered" ? "inset-0 z-[-1] h-auto rounded-full border border-primary-700 bg-primary-800" : withPanel ? "right-[calc(0.75rem+18px)]" : ""} ${classes?.navItemIndicator ?? ""}`}
													transition={
														reduced
															? { duration: 0 }
															: motionTokens.spring.morph
													}
													aria-hidden="true"
												/>
											)}
										</>
									);
									return (
										<li key={item.value} className="flex">
											{withPanel ? (
												<button
													{...common}
													className={`${common.className} ${classes?.navItemButton ?? ""}`}
													ref={(node: HTMLButtonElement | null) => {
														if (node)
															triggerRefs.current.set(
																item.value,
																node
															);
														else triggerRefs.current.delete(item.value);
													}}
													type="button"
													aria-expanded={isOpen}
													aria-controls={isOpen ? panelId : undefined}
													onClick={() => {
														clearTimers();
														openPanel(isOpen ? null : item.value);
													}}
													onKeyDown={(event) =>
														onTriggerKeyDown(event, item.value)
													}
												>
													{decorations}
													<span className="relative">{item.label}</span>
													<MdiIcon
														name="chevronDown"
														size={14 / 24}
														className="text-primary-400 transition-transform duration-200 group-data-[open]:rotate-180"
													/>
												</button>
											) : (
												<Destination
													link={item}
													{...common}
													className={`${common.className} ${classes?.navItemLink ?? ""}`}
													aria-current={isCurrent ? "page" : undefined}
													onChoose={() =>
														choose(
															{
																label: item.label,
																href: item.href,
																section: item.value,
															},
															item.value
														)
													}
												>
													{decorations}
													<span className="relative">{item.label}</span>
												</Destination>
											)}
										</li>
									);
								})}
							</ul>
						</nav>
					</LayoutGroup>
					<div
						className={`ml-auto flex items-center gap-2 ${variant === "centered" ? "justify-self-end" : ""}`}
					>
						{secondaryAction &&
							actionNode(
								secondaryAction,
								"secondary",
								"[@container_site-header_(max-width:759px)]:hidden"
							)}
						{primaryAction && actionNode(primaryAction, "primary")}
						<button
							ref={menuButtonRef}
							type="button"
							className={`relative hidden h-10 w-10 cursor-pointer place-items-center border-0 bg-transparent active:bg-primary-800 [@container_site-header_(max-width:759px)]:grid ${scrolled ? " text-primary-100" : " text-primary-700"}`}
							aria-expanded={menuOpen}
							aria-controls={`${id}-sheet`}
							aria-label={menuOpen ? "Close menu" : "Open menu"}
							onClick={() => {
								if (menuOpen) closeMenu();
								else setMenuOpen(true);
							}}
						>
							<AnimatePresence initial={false} mode="popLayout">
								<motion.span
									key={menuOpen ? "close" : "open"}
									className="grid place-items-center"
									initial={
										reduced
											? { opacity: 0 }
											: {
													opacity: 0,
													rotate: menuOpen ? -45 : 45,
													scale: 0.8,
												}
									}
									animate={{ opacity: 1, rotate: 0, scale: 1 }}
									exit={
										reduced
											? { opacity: 0 }
											: {
													opacity: 0,
													rotate: menuOpen ? 45 : -45,
													scale: 0.8,
												}
									}
									transition={
										reduced
											? { duration: 0 }
											: {
													...motionTokens.spring.snappy,
													opacity: {
														duration: motionTokens.duration.instant,
													},
												}
									}
								>
									{menuOpen ? (
										<MdiIcon name="close" size={20 / 24} />
									) : (
										<MdiIcon name="menu" size={20 / 24} />
									)}
								</motion.span>
							</AnimatePresence>
						</button>
					</div>
				</div>

				{hasPanels && (
					<AnimatePresence>
						{openItem?.links && (
							<motion.div
								key="panel"
								id={`${id}-panel`}
								ref={panelRef}
								className={`absolute left-6 right-6 top-[calc(100%-4px)] origin-top overflow-hidden border border-primary-700 bg-primary-900 [@container_site-header_(max-width:759px)]:hidden ${classes?.panel ?? ""}`}
								role="region"
								aria-label={openItem.label}
								onKeyDown={onPanelKeyDown}
								initial={
									reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.985 }
								}
								animate={{
									opacity: 1,
									y: 0,
									scale: 1,
									height: panel.height ?? "auto",
								}}
								exit={
									reduced
										? {
												opacity: 0,
												transition: {
													duration: motionTokens.duration.instant,
												},
											}
										: {
												opacity: 0,
												y: -4,
												scale: 0.99,
												transition: {
													duration: motionTokens.duration.exit,
													ease: standard,
												},
											}
								}
								transition={
									reduced
										? { duration: 0 }
										: {
												height: panel.grow ? GROW : SHRINK,
												y: GROW,
												scale: GROW,
												opacity: {
													duration: motionTokens.duration.fast,
													ease: enter,
												},
											}
								}
							>
								<AnimatePresence initial={false} custom={open?.direction ?? 0}>
									<Face
										key={openItem.value}
										direction={open?.direction ?? 0}
										reduced={reduced}
										onHeight={onHeight}
										className={classes?.panelFace}
									>
										<div
											className={`grid gap-2 ${openItem.feature ? "grid-cols-[minmax(0,1fr)_minmax(200px,260px)]" : ""}`}
											data-featured={openItem.feature ? "" : undefined}
										>
											<ul className="m-0 grid list-none grid-cols-2 gap-0.5 p-0">
												{openItem.links.map((link) => (
													<li key={link.label}>
														<Destination
															link={link}
															className={`flex h-full w-full cursor-pointer items-start gap-3 border-0 bg-transparent p-3 text-left text-primary-100 no-underline transition-colors duration-150 hover:bg-primary-800 focus-visible:bg-primary-800 motion-reduce:transition-none ${classes?.panelLink ?? ""}`}
															data-panel-link=""
															onChoose={() =>
																choose(
																	{
																		label: link.label,
																		href: link.href,
																		section: openItem.value,
																	},
																	openItem.value
																)
															}
														>
															{link.icon && (
																<span
																	className={`mt-0.5 flex shrink-0 text-primary-300 ${classes?.panelLinkIcon ?? ""}`}
																>
																	{link.icon}
																</span>
															)}
															<span className="grid min-w-0 gap-0.5">
																<span
																	className={`text-sm font-medium ${classes?.panelLinkLabel ?? ""}`}
																>
																	{link.label}
																</span>
																{link.description && (
																	<span
																		className={`text-sm text-primary-400 ${classes?.panelLinkDescription ?? ""}`}
																	>
																		{link.description}
																	</span>
																)}
															</span>
														</Destination>
													</li>
												))}
											</ul>
											{openItem.feature && (
												<div
													className={`grid gap-1.5 bg-primary-800 p-2 ${classes?.panelFeature ?? ""}`}
												>
													<Destination
														link={{
															label: openItem.feature.title,
															href: openItem.feature.href,
														}}
														className={`group grid w-full cursor-pointer content-start gap-1.5 border-0 bg-transparent p-0 text-left text-primary-100 no-underline ${classes?.panelFeatureLink ?? ""}`}
														data-panel-link=""
														onChoose={() =>
															choose(
																{
																	label: openItem.feature!.title,
																	href: openItem.feature!.href,
																	section: openItem.value,
																},
																openItem.value
															)
														}
													>
														{openItem.feature.image && (
															<span
																className={`relative mb-1 block aspect-[16/10] overflow-hidden bg-primary-700 [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.03] motion-reduce:[&_img]:transition-none ${classes?.panelFeatureImage ?? ""}`}
															>
																<Image
																	src={openItem.feature.image.src}
																	alt={openItem.feature.image.alt}
																	fill
																	sizes="260px"
																/>
															</span>
														)}
														<span
															className={`inline-flex items-center gap-1.5 px-1 text-sm font-medium [&_svg]:text-primary-400 [&_svg]:transition-transform [&_svg]:duration-150 group-hover:[&_svg]:translate-x-0.5 motion-reduce:[&_svg]:transition-none ${classes?.panelFeatureTitle ?? ""}`}
														>
															{openItem.feature.title}
															<MdiIcon
																name="arrowRight"
																size={14 / 24}
															/>
														</span>
														{openItem.feature.description && (
															<span
																className={`px-1 text-sm text-primary-300 ${classes?.panelFeatureDescription ?? ""}`}
															>
																{openItem.feature.description}
															</span>
														)}
													</Destination>
												</div>
											)}
										</div>
									</Face>
								</AnimatePresence>
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</div>

			<AnimatePresence>
				{menuOpen && (
					<>
						<motion.div
							key="scrim"
							className="absolute left-0 right-0 top-full h-dvh bg-black/20 [@container_site-header_(min-width:760px)]:hidden"
							onClick={() => closeMenu()}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: reduced ? 0 : motionTokens.duration.standard,
								ease: standard,
							}}
							aria-hidden="true"
						/>
						<motion.div
							key="sheet"
							id={`${id}-sheet`}
							className="absolute left-0 right-0 top-full overflow-hidden border-b border-primary-700 bg-primary-950 [@container_site-header_(min-width:760px)]:hidden"
							initial={reduced ? { opacity: 0 } : { height: 0 }}
							animate={reduced ? { opacity: 1 } : { height: "auto" }}
							exit={reduced ? { opacity: 0 } : { height: 0, transition: SHRINK }}
							transition={reduced ? { duration: 0 } : GROW}
						>
							<nav
								className="max-h-[var(--site-header-sheet-max,calc(100dvh-65px))] overflow-y-auto overscroll-contain px-4 pb-5 pt-2"
								aria-label={label}
							>
								<ul className="m-0 list-none p-0">
									{items.map((item, index) => {
										const isCurrent = current === item.value;
										const group = !!item.links?.length && variant === "mega";
										const isExpanded = expanded === item.value;
										const rowMotion = {
											initial: reduced ? false : { opacity: 0, y: -6 },
											animate: { opacity: 1, y: 0 },
											transition: {
												duration: motionTokens.duration.standard,
												ease: enter,
												delay: reduced
													? 0
													: 0.04 + index * motionTokens.stagger.item,
											},
										} as const;
										return (
											<motion.li
												key={item.value}
												className="border-b border-primary-800"
												{...rowMotion}
											>
												{group ? (
													<>
														<button
															type="button"
															className="group flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-1 text-left text-base font-medium text-primary-100 no-underline"
															data-current={
																isCurrent ? "" : undefined
															}
															aria-expanded={isExpanded}
															aria-controls={`${id}-group-${item.value}`}
															onClick={() =>
																setExpanded(
																	isExpanded ? null : item.value
																)
															}
														>
															<span>{item.label}</span>
															<MdiIcon
																name="chevronDown"
																size={18 / 24}
																className="text-primary-400 transition-transform duration-200 group-aria-expanded:rotate-180"
															/>
														</button>
														<AnimatePresence initial={false}>
															{isExpanded && (
																<motion.div
																	key="group"
																	id={`${id}-group-${item.value}`}
																	className="overflow-hidden"
																	initial={
																		reduced
																			? { opacity: 0 }
																			: {
																					height: 0,
																					opacity: 0,
																				}
																	}
																	animate={
																		reduced
																			? { opacity: 1 }
																			: {
																					height: "auto",
																					opacity: 1,
																				}
																	}
																	exit={
																		reduced
																			? { opacity: 0 }
																			: {
																					height: 0,
																					opacity: 0,
																				}
																	}
																	transition={
																		reduced
																			? { duration: 0 }
																			: {
																					height: motionTokens
																						.spring
																						.smooth,
																					opacity: {
																						duration:
																							motionTokens
																								.duration
																								.fast,
																					},
																				}
																	}
																>
																	<ul className="m-0 grid list-none gap-0 p-0 pb-3">
																		{item.links!.map((link) => (
																			<li key={link.label}>
																				<Destination
																					link={link}
																					className="group flex min-h-11 w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-2 text-left text-sm text-primary-300 no-underline active:bg-primary-800 active:text-primary-50"
																					onChoose={() =>
																						choose(
																							{
																								label: link.label,
																								href: link.href,
																								section:
																									item.value,
																							},
																							item.value
																						)
																					}
																				>
																					{link.icon}
																					<span>
																						{link.label}
																					</span>
																				</Destination>
																			</li>
																		))}
																	</ul>
																</motion.div>
															)}
														</AnimatePresence>
													</>
												) : (
													<Destination
														link={item}
														className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-1 text-left text-base font-medium text-primary-100 no-underline"
														data-current={isCurrent ? "" : undefined}
														aria-current={
															isCurrent ? "page" : undefined
														}
														onChoose={() =>
															choose(
																{
																	label: item.label,
																	href: item.href,
																	section: item.value,
																},
																item.value
															)
														}
													>
														<span>{item.label}</span>
														{isCurrent && (
															<span
																className="h-1.5 w-1.5 rounded-full bg-accent-500"
																aria-hidden="true"
															/>
														)}
													</Destination>
												)}
											</motion.li>
										);
									})}
								</ul>
								{(secondaryAction || primaryAction) && (
									<motion.div
										className="mt-5 grid grid-cols-2 gap-2 [&>*]:h-10"
										initial={reduced ? false : { opacity: 0, y: -6 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: motionTokens.duration.standard,
											ease: enter,
											delay: reduced
												? 0
												: 0.04 + items.length * motionTokens.stagger.item,
										}}
									>
										{secondaryAction &&
											actionNode(
												secondaryAction,
												"secondary",
												"border-primary-700"
											)}
										{primaryAction && actionNode(primaryAction, "primary")}
									</motion.div>
								)}
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</header>
	);
});

SiteHeader.displayName = "SiteHeader";


export default SiteHeader;
