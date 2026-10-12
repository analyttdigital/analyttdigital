"use client";
import { Fragment, type CSSProperties } from "react";
import { motionTokens } from "@/lib/motion/motion-tokens";

/**
 * Reveals a short headline or sentence once, as it mounts: each word rises out of its own clip while it sharpens from a soft blur.
 * The entrance runs in CSS, so it starts on first paint, never waits for hydration, and never leaves text hidden when scripts are slow.
 * Use `\n` in `text` for a deliberate line break and change the element's `key` to replay it.
 */
export interface TextRevealProps {
	text: string;
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "em" | "b" | "i" | "small" | "mark" | "del" | "ins" | "sub" | "sup" | "abbr" | "cite" | "q" | "dfn" | "time" | "code" | "var" | "samp" | "kbd" | "s" | "u" | "bdi" | "bdo" | "ruby" | "rt" | "rp" | "div";
	className?: string;
	id?: string;
	/** Seconds to wait before the first word rises. Defaults to 0. */ delay?: number;
}
/** Total stagger stays under this many seconds, however long the text is. */
const MAX_STAGGER = motionTokens.duration.considered;

export function TextReveal({ text, as = "h2", className, id, delay = 0 }: TextRevealProps) {
	const Tag = as;
	const lines = text.split("\n").map((line) => line.split(" ").filter(Boolean));
	const count = lines.reduce((total, words) => total + words.length, 0);
	const step = Math.min(motionTokens.stagger.word, MAX_STAGGER / Math.max(count, 1));
	const blur = as === "p" ? motionTokens.blur.soft : motionTokens.blur.text;
	let index = 0;
	return (
		<Tag
			id={id}
			className={`max-w-[24ch] m-0 overflow-visible text-balance ${className ?? ""}`}
			style={{ "--reveal-blur": `${blur}px` } as CSSProperties}
		>
			<span className={`sr-only`}>{text.replace(/\n/g, " ")}</span>
			{lines.map((words, lineIndex) => (
				<Fragment key={lineIndex}>
					<span className={`block`} aria-hidden="true">
						{words.map((word, wordIndex) => {
							const position = index++;
							return (
								<Fragment key={`${word}-${position}`}>
									<span
										className={`inline-block align-top pt-[0.1em] px-[0.16em] pb-[0.24em] -mt-[0.1em] -mx-[0.16em] -mb-[0.24em] [mask-image:linear-gradient(#000_calc(100%_-_0.18em),transparent)]`}
									>
										<span
											className={`inline-block [animation:rise_.76s_var(--ease-enter)_var(--reveal-delay,_0s)_backwards,fade_.44s_var(--ease-standard)_var(--reveal-delay,_0s)_backwards,focus_.58s_var(--ease-enter)_var(--reveal-delay,_0s)_backwards] `}
											style={
												{
													"--reveal-delay": `${delay + position * step + lineIndex * step}s`,
												} as CSSProperties
											}
										>
											{word}
										</span>
									</span>
									{wordIndex < words.length - 1 ? " " : null}
								</Fragment>
							);
						})}
					</span>
					{lineIndex < lines.length - 1 ? " " : null}
				</Fragment>
			))}
		</Tag>
	);
}

export default TextReveal;
