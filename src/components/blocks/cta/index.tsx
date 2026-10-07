"use client";

import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
	AnimatePresence,
	animate,
	motion,
	useInView,
	useMotionValue,
	useReducedMotion,
} from "framer-motion";
import Icon from "@mdi/react";
import { mdiArrowRight, mdiCheck, mdiClose } from "@mdi/js";
import styles from "./cta-section.module.css";
import { Button } from "@/components/button";
import { motionTokens } from "@/lib/motion/motion-tokens";

export interface CtaAction {
	label: string;
	/** Renders a link. */
	href?: string;
	onClick?: () => void;
	/** With no href or onClick, the button confirms in place with this label, which suits previews. */
	confirmedLabel?: string;
}

export const ctaCopy = {
	centered: {
		title: "Start building in minutes",
		description:
			"Set up a workspace, invite your team, and ship the first project this week. Free for 14 days.",
		primary: { label: "Start free trial", confirmedLabel: "Trial started" },
		secondary: { label: "Talk to sales", confirmedLabel: "We'll email you" },
		note: "No credit card required",
	},
	split: {
		title: "Your team, set up before lunch",
		description:
			"Import your projects, bring everyone in, and keep working the way you already do.",
		primary: { label: "Create a workspace", confirmedLabel: "Workspace created" },
		secondary: { label: "Book a demo", confirmedLabel: "Demo requested" },
		points: [
			"Import from any tracker in one step",
			"Single sign-on and audit logs included",
			"Cancel anytime from settings",
		],
	},
	banner: {
		title: "Workflows are here",
		description: "Automate handoffs between teams with no code.",
		primary: { label: "See how it works", confirmedLabel: "Opened" },
	},
} satisfies Record<
	string,
	{
		title: string;
		description: string;
		primary: CtaAction;
		secondary?: CtaAction;
		note?: string;
		points?: string[];
	}
>;




export type CtaVariant = "centered" | "split" | "banner";

export interface CtaSectionProps {
	/** `centered` is a closing section, `split` sits beside a product visual, `banner` is one dismissible line. */
	variant?: CtaVariant;
	title?: string;
	description?: string;
	primaryAction?: CtaAction;
	/** Not shown in the banner variant. Pass null to hide it. */
	secondaryAction?: CtaAction | null;
	/** Small print under the actions in the centered variant, such as "No credit card required". */
	note?: string;
	/** Faces beside the note in the centered variant. Pass an empty array to hide them. */
	faces?: string[];
	/** Short benefit lines in the split variant. */
	points?: string[];
	/** Replaces the split variant's setup card. */
	visual?: ReactNode;
	/** Banner only: shows a dismiss button and calls this after it closes. */
	onDismiss?: () => void;
	className?: string;
}

type Bezier = [number, number, number, number];
const enter = [...motionTokens.ease.enter] as Bezier;
const standard = [...motionTokens.ease.standard] as Bezier;

/** A link, a callback, or (with neither) a button that confirms in place, so previews always answer a click. */
function Action({
	action,
	variant,
	size = "lg",
	arrow,
}: {
	action: CtaAction;
	variant: "primary" | "secondary";
	size?: "sm" | "md" | "lg";
	arrow?: boolean;
}) {
	const [confirmed, setConfirmed] = useState(false);
	if (action.href) {
		return (
			<a
				className={styles.linkAction}
				data-variant={variant}
				data-size={size}
				href={action.href}
			>
				{action.label}
                {arrow && (
                    <Icon path={mdiArrowRight}
                    title="arrow right"
                    size={1}
                    className={styles.arrow}
                    aria-hidden="true"
                  />
				)}
			</a>
		);
	}
	const simulated = !action.onClick;
	return (
		<Button
			className={styles.action}
			variant={variant}
			size={size}
			aria-live={simulated ? "polite" : undefined}
			onClick={() => {
				if (action.onClick) action.onClick();
				else setConfirmed((value) => !value);
			}}
		>
			{confirmed ? (
				<>
					<Icon
						path={mdiCheck}
						title="check"
						size={1}
						aria-hidden="true"
					/>
					{action.confirmedLabel ?? action.label}
				</>
			) : (
				<>
					{action.label}
					{arrow && (
						<Icon
							path={mdiArrowRight}
							className={styles.arrow}
							size={1}
							aria-hidden="true"
						/>
					)}
				</>
			)}
		</Button>
	);
}

function Faces({ faces }: { faces: string[] }) {
	if (!faces.length) return null;
	return (
		<span className={styles.faces} aria-hidden="true">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			{faces.slice(0, 4).map((src) => (
				<img key={src} src={src} alt="" width={26} height={26} />
			))}
		</span>
	);
}

/**
 * A call to action in three shapes: a centered closing section, a split layout beside a setup card that completes
 * itself in view, and a compact banner that closes its gap when dismissed.
 */
export const CtaSection = forwardRef<HTMLElement, CtaSectionProps>(function CtaSection(
	{
		variant = "centered",
		title,
		description,
		primaryAction,
		secondaryAction,
		note,
		faces = [],
		points,
		visual,
		onDismiss,
		className,
	},
	ref
) {
	const id = useId();
	const reduced = !!useReducedMotion();
	const [open, setOpen] = useState(true);
	const copy = ctaCopy[variant];
	const heading = title ?? copy.title;
	const text = description ?? copy.description;
	const primary = primaryAction ?? copy.primary;
	const secondary =
		secondaryAction === null
			? null
			: (secondaryAction ?? ("secondary" in copy ? copy.secondary : undefined));
	const classes = [styles.cta, className].filter(Boolean).join(" ");

	if (variant === "banner") {
		return (
			<section
				ref={ref}
				className={classes}
				data-variant="banner"
				aria-labelledby={`${id}-title`}
			>
				<AnimatePresence initial={false} onExitComplete={onDismiss}>
					{open && (
						<motion.div
							key="banner"
							className={styles.bannerWrap}
							exit={
								reduced
									? {
											opacity: 0,
											transition: { duration: motionTokens.duration.instant },
										}
									: {
											opacity: 0,
											height: 0,
											transition: {
												height: motionTokens.spring.smooth,
												opacity: {
													duration: motionTokens.duration.fast,
													ease: standard,
												},
											},
										}
							}
						>
							<div className={styles.bannerPad}>
								<div className={styles.banner}>
									<p className={styles.bannerText}>
										<strong id={`${id}-title`}>{heading}</strong>
										<span>{text}</span>
									</p>
									<div className={styles.bannerActions}>
										<Action
											action={primary}
											variant="primary"
											size="sm"
											arrow
										/>
										{onDismiss !== undefined && (
											<button
												type="button"
												className={styles.dismiss}
												aria-label="Dismiss"
												onClick={() => setOpen(false)}
											>
												<Icon
													path={mdiClose}
													title="close"
													aria-hidden="true"
												/>
											</button>
										)}
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</section>
		);
	}

	if (variant === "split") {
		const list = points ?? ctaCopy.split.points;
		return (
			<section
				ref={ref}
				className={classes}
				data-variant="split"
				aria-labelledby={`${id}-title`}
			>
				<div className={styles.split}>
					<div className={styles.splitCopy}>
						<h2 id={`${id}-title`} className={styles.title}>
							{heading}
						</h2>
						<p className={styles.description}>{text}</p>
						{list.length > 0 && (
							<ul className={styles.points}>
								{list.map((point) => (
									<li key={point}>
										<Icon
											path={mdiCheck}
											title="check"
											size={1}
											aria-hidden="true"
										/>
										{point}
									</li>
								))}
							</ul>
						)}
						<div className={styles.actions}>
							<Action action={primary} variant="primary" arrow />
							{secondary && <Action action={secondary} variant="secondary" />}
						</div>
					</div>
				</div>
			</section>
		);
	}

	const small = note ?? ctaCopy.centered.note;
	return (
		<section
			ref={ref}
			className={classes}
			data-variant="centered"
			aria-labelledby={`${id}-title`}
		>
			<div className={styles.centeredWrap}>
				<div className={styles.centered}>
					<h2 id={`${id}-title`} className={styles.title}>
						{heading}
					</h2>
					<p className={styles.description}>{text}</p>
					<div className={styles.actions}>
						<Action action={primary} variant="primary" arrow />
						{secondary && <Action action={secondary} variant="secondary" />}
					</div>
					{(small || faces.length > 0) && (
						<p className={styles.note}>
							<Faces faces={faces} />
							{small}
						</p>
					)}
				</div>
			</div>
		</section>
	);
});

CtaSection.displayName = "CtaSection";

export default CtaSection;
