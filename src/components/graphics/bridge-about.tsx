'use client';

import { useId, useMemo, useState } from 'react';

import { InViewTitle } from '@/components/graphics/in-view-title';
import type { AboutSection } from '@/lib/content/types';

/**
 * BridgeAbout — the about-us figure: headline + intro + signal plot.
 *
 * Headline left, intro right (bottoms aligned), then the signal plot: raw
 * noise resolving left-to-right into measured growth. The line is generated
 * deterministically (seeded, documented as illustrative) — everything a
 * reader sees is content-editable through `data`. Points on the line select
 * the readout below (click, hover, or keyboard focus); the readout is
 * `aria-live` so the decision behind each point is announced.
 *
 * The flood owns `pointer-events: none`, so the markers re-enable pointer
 * events for themselves. `live` plays the draw-in (line wipe, staggered
 * marker pops); the global reduced-motion rules park all of it.
 */

const W = 1200;
const H = 380;
const BASE = 250;
const N = 260;

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

const sstep = (a: number, b: number, t: number) => {
  t = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function BridgeAbout({ data, live }: { data: AboutSection; live: boolean }) {
  const uid = useId().replace(/:/g, '');
  const moves = data.moves ?? [];
  const [selected, setSelected] = useState(moves.length ? moves.length - 1 : null);
  const current =
    selected == null || !moves.length ? undefined : moves[Math.min(selected, moves.length - 1)];

  /* Noisy early on, converging into a clean upward trend — illustrative. */
  const plot = useMemo(() => {
    const rnd = mulberry32(11);
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const trend = BASE - 190 * Math.pow(t, 1.5);
      const amp = 62 * (1 - sstep(0.04, 0.8, t)) + 2.5;
      const spike = rnd() > 0.88 ? 1.7 : 0.75;
      let y = trend + (rnd() * 2 - 1) * spike * amp;
      if (i === 0) y = BASE;
      pts.push([t * W, Math.min(H - 16, Math.max(16, y))]);
    }
    const line = pts.map((pt, i) => `${i ? 'L' : 'M'}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ');
    return {
      line,
      area: `${line} L${W} ${H} L0 ${H} Z`,
      yAt: (x: number) => pts[Math.round(Math.min(1, Math.max(0, x)) * N)]?.[1] ?? BASE,
    };
  }, []);

  return (
		<div className="max-h-full w-full max-w-7xl overflow-hidden px-1 py-8">
			{/* Head: headline left, copy right, bottoms aligned. */}
			<div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12">
				<div>
					{data.tag ? <p className="label text-primary-300">{data.tag}</p> : null}
					{data.title ? (
						<InViewTitle
							variant="wipe"
							as="h2"
							text={data.title}
							once={false}
							className="title mt-4 text-[clamp(1.9rem,3.4vw,3.4rem)] text-primary-50"
						/>
					) : null}
				</div>
				{data.introLead || data.description ? (
					<p className="body max-w-[46ch] lg:pb-2">
						{data.introLead ? (
							<b className="font-medium text-primary-50">{data.introLead} </b>
						) : null}
						{data.description}
					</p>
				) : null}
			</div>

			{/* Plot: raw signals resolve into measured growth. */}
			{moves.length || data.axisLeft || data.axisRight ? (
				<div className="mt-8 lg:mt-10">
					<div className="relative h-44 sm:h-56 xl:h-64">
						<svg
							viewBox={`0 0 ${W} ${H}`}
							preserveAspectRatio="none"
							aria-hidden="true"
							className={`absolute inset-0 h-full w-full overflow-visible transition-[clip-path] duration-[2200ms] ease-[cubic-bezier(.55,.1,.25,1)] ${
								live
									? "[clip-path:inset(-10%_0_-10%_0)]"
									: "[clip-path:inset(-10%_100%_-10%_0)]"
							}`}
						>
							<defs>
								<linearGradient
									id={`${uid}-stroke`}
									gradientUnits="userSpaceOnUse"
									x1="0"
									y1="0"
									x2={W}
									y2="0"
								>
									<stop offset="0" stopColor="rgb(var(--color-primary-300))" />
									<stop offset=".38" stopColor="rgb(var(--color-primary-300))" />
									<stop offset=".66" stopColor="rgb(var(--color-accent-500))" />
									<stop offset="1" stopColor="rgb(var(--color-accent-500))" />
								</linearGradient>
								<linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="0"
										stopColor="rgb(var(--color-accent-500))"
										stopOpacity=".26"
									/>
									<stop
										offset="1"
										stopColor="rgb(var(--color-accent-500))"
										stopOpacity="0"
									/>
								</linearGradient>
								<linearGradient id={`${uid}-fadeX`} x1="0" y1="0" x2="1" y2="0">
									<stop offset=".3" stopColor="#fff" stopOpacity="0" />
									<stop offset=".7" stopColor="#fff" stopOpacity="1" />
								</linearGradient>
								<mask id={`${uid}-m`}>
									<rect width={W} height={H} fill={`url(#${uid}-fadeX)`} />
								</mask>
							</defs>
							<path
								d={plot.area}
								fill={`url(#${uid}-fill)`}
								mask={`url(#${uid}-m)`}
							/>
							<path
								d={plot.line}
								fill="none"
								stroke={`url(#${uid}-stroke)`}
								strokeWidth="2.5"
								strokeLinejoin="round"
								strokeLinecap="round"
								vectorEffect="non-scaling-stroke"
							/>
						</svg>

						{/* Dashed starting line. */}
						<div
							aria-hidden="true"
							className="absolute inset-x-0 border-t border-dashed border-primary-50/25"
							style={{ top: `${(BASE / H) * 100}%` }}
						>
							{data.baseLabel ? (
								<span className="absolute right-0 top-2 hidden text-[13px] text-primary-300 sm:block">
									{data.baseLabel}
								</span>
							) : null}
						</div>

						{/* Selectable points riding the line itself. */}
						{moves.map((m, i) => (
							<button
								key={`${m.move}-${i}`}
								type="button"
								aria-pressed={i === selected}
								aria-label={m.move}
								onClick={() => setSelected(i)}
								onMouseEnter={() => setSelected(i)}
								onFocus={() => setSelected(i)}
								style={{
									left: `${m.x * 100}%`,
									top: `${(plot.yAt(m.x) / H) * 100}%`,
									transitionDelay: live ? `${m.x * 2000}ms` : "0ms",
								}}
								className={`pointer-events-auto absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center transition-[opacity,transform] duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] focus-visible:outline-2 focus-visible:outline-primary-50 ${
									live ? "opacity-100 scale-100" : "opacity-0 scale-50"
								}`}
							>
								<span
									aria-hidden="true"
									className={`block h-4 w-4 rounded-full border-2 border-accent-500 bg-primary-700 transition-all hover:shadow-[0_0_0_6px_rgb(var(--color-accent-500)/0.2)] ${
										i === selected
											? "bg-accent-500 shadow-[0_0_0_8px_rgb(var(--color-accent-500)/0.25)]"
											: ""
									}`}
								/>
							</button>
						))}
					</div>

					{(data.axisLeft || data.axisRight) && (
						<div className="mt-3 flex justify-between text-[13px] text-primary-300">
							<span>{data.axisLeft}</span>
							<span>{data.axisRight}</span>
						</div>
					)}

					{current && (
						<div
							aria-live="polite"
							className="mt-5 grid gap-5 border-t border-primary-50/15 pt-4 sm:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] sm:gap-10"
						>
							<div>
								{data.moveLabel ? (
									<h3 className="text-sm font-normal text-primary-300 font-mono">
										{data.moveLabel}
									</h3>
								) : null}
								<p className="mt-2 min-h-[2.4em] font-display text-[clamp(1.05rem,1.8vw,1.5rem)] font-semibold leading-snug text-primary-50">
									{current.move}
								</p>
							</div>
							<div>
								{data.resultLabel ? (
									<h3 className="text-sm font-normal text-primary-300">
										{data.resultLabel}
									</h3>
								) : null}
								<p className="mt-2 min-h-[2.4em] font-display text-[clamp(1.05rem,1.8vw,1.5rem)] font-semibold leading-snug text-accent-300">
									{current.result}
								</p>
							</div>
						</div>
					)}

					{data.hint && moves.length ? (
						<p className="mt-4 text-sm text-primary-300 font-mono">{data.hint}</p>
					) : null}
				</div>
			) : null}
		</div>
  );
}
