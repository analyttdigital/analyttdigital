"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MdiIcon } from "@/lib/icons/resolve-icon";
import type { TerrainData, TerrainMetricKey } from "@/lib/content/types";

/**
 * ActivityTerrain — reusable interactive 3D bar terrain on a 2D canvas.
 *
 * A week of hourly values (24 × 7 bars) drawn as a shaded block field with an
 * orbiting camera: drag/touch to orbit, pinch or Ctrl+scroll to zoom, click a
 * bar to fly in, full keyboard control on the focused canvas. Metric and
 * camera presets are segmented controls; a legend, stat readout and an
 * sr-only data table keep the same information available to everyone.
 *
 * Reuse: `<ActivityTerrain data={terrain} id="unique-prefix" />` — every
 * aria id is prefixed, so several instances can share a page. All copy comes
 * from `data` (Keystatic-editable); the hourly grids are generated
 * deterministically in code and labelled illustrative, exactly as the caption
 * says. Palette steps are read from the `globals.css` token channels, so the
 * ramp follows the theme instead of forking it.
 */

const COLS = 24;
const ROWS = 7;
const HALF = 0.41;
const THRESH = [0.16, 0.32, 0.5, 0.68, 0.85];
const FACE_SHADE = [1, 0.8, 0.72, 0.6, 0.6];
/** Bucket ramp, light → ember, as token channels (see `globals.css`). */
const RAMP_VARS = [
	"--color-primary-200",
	"--color-primary-300",
	"--color-primary-400",
	"--color-primary-500",
	"--color-primary-600",
	"--color-accent-500",
];
/** Floor-slab faces: top, front, left, right, back. */
const SLAB_VARS = [
	"--color-primary-50",
	"--color-primary-100",
	"--color-primary-200",
	"--color-primary-100",
	"--color-primary-200",
];
const FALLBACK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FALLBACK_DAY_NAMES = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

type Bar = {
	r: number;
	c: number;
	x: number;
	z: number;
	h: number;
	hv: number;
	ht: number;
	delay: number;
	v: number;
	norm: number;
	bucket: number;
	d: number;
	np: number;
	pp: [Float32Array, Float32Array, Float32Array];
};

type ViewName = "persp" | "top" | "custom";

function pad(n: number) {
	return `0${n}`.slice(-2);
}
function fmtN(n: number) {
	return Number(n).toLocaleString("en-US");
}
function clamp(v: number, a: number, b: number) {
	return Math.max(a, Math.min(b, v));
}
/** Deterministic RNG so every visitor (and SSR-free first paint) agrees. */
function mulberry(seed: number) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
/** Read a `--color-*` space-separated channel into [r, g, b]. */
function tokenChannels(name: string, fallback: [number, number, number]): [number, number, number] {
	const raw =
		typeof document === "undefined"
			? ""
			: getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	const parts = raw.split(/\s+/).map(Number);
	return parts.length === 3 && parts.every((n) => Number.isFinite(n))
		? [parts[0], parts[1], parts[2]]
		: fallback;
}
function mixRGB(a: number[], b: number[], t: number) {
	return [0, 1, 2].map((i) => Math.round(b[i] + (a[i] - b[i]) * t));
}
function rgb(a: number[]) {
	return `rgb(${a[0]},${a[1]},${a[2]})`;
}

export function ActivityTerrain({
	data,
	id = "activity-terrain",
	className,
}: {
	data: TerrainData;
	/** Prefix for every aria id, so instances never collide on one page. */
	id?: string;
	className?: string;
}) {
	const dataRef = useRef(data);
	dataRef.current = data;

	const plotRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const tipRef = useRef<HTMLDivElement>(null);

	const metrics = data.metrics.length ? data.metrics : [];
	const days = data.days.length >= ROWS ? data.days : FALLBACK_DAYS;
	const dayNames = data.dayNames.length >= ROWS ? data.dayNames : FALLBACK_DAY_NAMES;

	const [metricKey, setMetricKey] = useState<TerrainMetricKey>(metrics[0]?.key ?? "leads");
	const [view, setViewState] = useState<ViewName>("persp");
	const [sel, setSel] = useState<{ r: number; c: number } | null>(null);
	const [coarse, setCoarse] = useState(false);

	const cfg = metrics.find((m) => m.key === metricKey) ?? metrics[0];
	const isCpl = cfg?.key === "cpl";

	/* ---------- Seeded sample grids (illustrative, per the caption) ---------- */
	const dataset = useMemo(() => {
		const rnd = mulberry(20260921);
		const bell = (h: number, c: number, s: number) => {
			const d = (h - c) / s;
			return Math.exp(-0.5 * d * d);
		};
		const dayF = [0.92, 0.97, 1, 0.96, 0.86, 0.55, 0.42];
		const build = (kind: TerrainMetricKey) => {
			const grid: number[][] = [];
			for (let r = 0; r < ROWS; r++) {
				const row: number[] = [];
				const wk = r < 5;
				for (let c = 0; c < COLS; c++) {
					const act = wk
						? bell(c, 14.5, 3.1) + 0.42 * bell(c, 20.5, 1.7) + 0.06
						: 0.8 * bell(c, 15.5, 3.8) + 0.55 * bell(c, 20.5, 2) + 0.07;
					if (kind === "leads")
						row.push(Math.round(46 * dayF[r] * act * (0.86 + rnd() * 0.28)));
					else if (kind === "clicks")
						row.push(
							Math.round(1000 * dayF[r] * (act * 0.85 + 0.04) * (0.88 + rnd() * 0.24))
						);
					else
						row.push(
							Math.round(
								(250 + 380 * Math.pow(1 - Math.min(1, act), 1.7)) *
									(0.93 + rnd() * 0.14)
							)
						);
				}
				grid.push(row);
			}
			return grid;
		};
		const grids = { leads: build("leads"), clicks: build("clicks"), cpl: build("cpl") };
		const range = (g: number[][]) => {
			let lo = Infinity;
			let hi = -Infinity;
			g.forEach((row) =>
				row.forEach((v) => {
					if (v < lo) lo = v;
					if (v > hi) hi = v;
				})
			);
			return { lo, hi };
		};
		return {
			grids,
			ranges: {
				leads: range(grids.leads),
				clicks: range(grids.clicks),
				cpl: range(grids.cpl),
			},
		};
	}, []);

	const fmtVal = (key: TerrainMetricKey, v: number, noun: string) =>
		key === "cpl" ? `KES ${fmtN(v)}` : `${fmtN(v)} ${noun}`;

	/* ---------- Declarative stats + table (same numbers the canvas shows) ---------- */
	const summary = useMemo(() => {
		if (!cfg) return null;
		const g = dataset.grids[cfg.key];
		const cells: { r: number; c: number; v: number }[] = [];
		for (let r = 0; r < ROWS; r++)
			for (let c = 0; c < COLS; c++) cells.push({ r, c, v: g[r][c] });
		let total = 0;
		const dayStat: number[] = [];
		const dayWork: number[] = [];
		if (isCpl) {
			let sw = 0;
			let sl = 0;
			for (let r = 0; r < ROWS; r++) {
				let dw = 0;
				let dl = 0;
				for (let c = 0; c < COLS; c++) {
					dw += dataset.grids.cpl[r][c] * dataset.grids.leads[r][c];
					dl += dataset.grids.leads[r][c];
				}
				dayStat.push(dw / dl);
				sw += dw;
				sl += dl;
			}
			total = Math.round(sw / sl);
		} else {
			for (let r = 0; r < ROWS; r++) {
				let s = 0;
				let w = 0;
				for (let c = 0; c < COLS; c++) {
					s += g[r][c];
					if (c >= 8 && c < 18) w += g[r][c];
				}
				dayStat.push(s);
				dayWork.push(w);
				total += s;
			}
		}
		cells.sort((a, b) => (isCpl ? a.v - b.v : b.v - a.v));
		let bi = 0;
		for (let r = 1; r < ROWS; r++) {
			if (isCpl ? dayStat[r] < dayStat[bi] : dayStat[r] > dayStat[bi]) bi = r;
		}
		const up = cfg.delta > 0;
		return {
			totalLabel: isCpl ? `KES ${fmtN(total)}` : fmtN(total),
			up,
			good: isCpl ? cfg.delta < 0 : cfg.delta > 0,
			peaks: cells.slice(0, 3).map((x) => ({
				key: `${x.r}-${x.c}`,
				when: `${days[x.r]} ${pad(x.c)}:00`,
				value: isCpl ? `KES ${fmtN(x.v)}` : fmtN(x.v),
			})),
			bestDay: dayNames[bi],
			daySub: isCpl
				? `KES ${fmtN(Math.round(dayStat[bi]))} ${data.avgNote}, ${Math.round((1 - dayStat[bi] / total) * 100)}% ${data.belowNote}.`
				: `${fmtN(dayStat[bi])} ${cfg.noun}, ${((dayWork[bi] / dayStat[bi]) * 100).toFixed(1)}% ${data.betweenNote}.`,
		};
	}, [dataset, cfg, isCpl, days, dayNames, data.avgNote, data.belowNote, data.betweenNote]);

	/* ---------- Canvas engine (imperative; React owns the chrome around it) ---------- */
	const engineRef = useRef<{
		applyMetric: (key: TerrainMetricKey) => void;
		setView: (v: Exclude<ViewName, "custom">) => void;
		selectBar: (r: number, c: number) => void;
		clearSelection: () => void;
	} | null>(null);

	useEffect(() => {
		const plot = plotRef.current;
		const canvas = canvasRef.current;
		const tip = tipRef.current;
		if (!plot || !canvas || !tip) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		const ctx: CanvasRenderingContext2D = context;

		const d = () => dataRef.current;
		const cfgOf = (key: TerrainMetricKey) =>
			d().metrics.find((m) => m.key === key) ?? d().metrics[0];
		const dayList = () => (d().days.length >= ROWS ? d().days : FALLBACK_DAYS);

		/* Token palette — the ramp follows globals.css instead of forking it. */
		const ramp = RAMP_VARS.map((v, i) =>
			tokenChannels(
				v,
				[
					[214, 209, 231],
					[181, 173, 207],
					[145, 135, 178],
					[108, 97, 140],
					[79, 75, 99],
					[240, 79, 38],
				][i] as [number, number, number]
			)
		);
		const ink = tokenChannels("--color-ink-800", [42, 40, 56]);
		const slabBase = SLAB_VARS.map((v, i) =>
			tokenChannels(
				v,
				[
					[246, 245, 250],
					[233, 230, 243],
					[214, 209, 231],
					[233, 230, 243],
					[214, 209, 231],
				][i] as [number, number, number]
			)
		);
		const axisInk = rgb(tokenChannels("--color-primary-500", [108, 97, 140]));
		const edgeInk = rgb(tokenChannels("--color-primary-900", [27, 22, 41]));
		const slabShadow = `rgba(${tokenChannels("--color-primary-600", [79, 75, 99]).join(",")},0.20)`;
		const PAL = ramp.map((b) => FACE_SHADE.map((f) => rgb(mixRGB(b, ink, f))));
		const PAL_HOVER = ramp.map((b) =>
			FACE_SHADE.map((f) => rgb(mixRGB(mixRGB([255, 255, 255], b, 0.28), ink, f)))
		);
		const SLAB = slabBase.map((b) => rgb(b));
		const bucketOf = (n: number) => {
			let i = 0;
			while (i < THRESH.length && n >= THRESH[i]) i++;
			return i;
		};

		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const bars: Bar[] = [];
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				bars.push({
					r,
					c,
					x: c - (COLS - 1) / 2,
					z: (ROWS - 1) / 2 - r,
					h: 0,
					hv: 0,
					ht: 0.08,
					delay: 0,
					v: 0,
					norm: 0,
					bucket: 0,
					d: 0,
					np: 0,
					pp: [new Float32Array(8), new Float32Array(8), new Float32Array(8)],
				});
			}
		}

		const state = {
			metric: d().metrics[0]?.key ?? ("leads" as TerrainMetricKey),
			view: "persp" as ViewName,
			sel: null as Bar | null,
			hover: null as Bar | null,
			order: [] as Bar[],
		};
		const cam = { yaw: -0.62, pitch: 0.62, dist: 38, tx: 0, ty: 0, tz: 0 };
		const goal = { ...cam };
		let W = 1;
		let H = 1;
		let dpr = 1;
		let F = 800;
		let narrow = false;
		let laidOut = false;
		let visible = false;
		let dirty = true;
		let raf = 0;
		let last = 0;
		let yawVel = 0;
		let MAXH = 4.6;

		const kick = () => {
			dirty = true;
			if (!raf && visible) raf = requestAnimationFrame(frame);
		};

		const presetFor = (v: string) =>
			v === "top"
				? { yaw: 0, pitch: Math.PI / 2, dist: narrow ? 44 : 31, ty: 0 }
				: { yaw: -0.62, pitch: narrow ? 0.85 : 0.62, dist: narrow ? 43 : 38, ty: 0 };
		const preset = (v: string, snap: boolean) => {
			const g = presetFor(v);
			goal.yaw = g.yaw;
			goal.pitch = g.pitch;
			goal.dist = g.dist;
			goal.tx = 0;
			goal.ty = g.ty;
			goal.tz = 0;
			if (snap || reduce) {
				for (const k of Object.keys(goal) as (keyof typeof goal)[]) cam[k] = goal[k];
			}
			kick();
		};

		const layout = () => {
			const rect = plot.getBoundingClientRect();
			W = Math.max(1, Math.round(rect.width));
			H = Math.max(1, Math.round(rect.height));
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(W * dpr);
			canvas.height = Math.round(H * dpr);
			const wasNarrow = narrow;
			narrow = W < 560;
			F = Math.max(W, H * 1.6) * 1.12;
			const newMax = narrow ? 7 : 4.6;
			if (newMax !== MAXH) {
				MAXH = newMax;
				bars.forEach((b) => {
					b.ht = 0.08 + b.norm * MAXH;
					if (reduce) b.h = b.ht;
				});
			}
			if (!laidOut) {
				laidOut = true;
				preset(state.view, true);
			} else if (wasNarrow !== narrow && state.view !== "custom" && !state.sel)
				preset(state.view, false);
			kick();
		};

		/* ----- projection ----- */
		const P = new Float32Array(24);
		const FACES = [
			[2, 3, 7, 6],
			[0, 1, 3, 2],
			[0, 4, 6, 2],
			[1, 5, 7, 3],
			[4, 5, 7, 6],
		];
		let cyw = 1;
		let syw = 0;
		let cp = 1;
		let sp = 0;
		let camX = 0;
		let camY = 0;
		let camZ = 0;
		let CX = 0;
		let CY = 0;

		function box(
			x0: number,
			x1: number,
			y0: number,
			y1: number,
			z0: number,
			z1: number,
			pal: string[],
			bar: Bar | null,
			outline: boolean
		) {
			for (let k = 0; k < 8; k++) {
				const x = k & 1 ? x1 : x0;
				const y = k & 2 ? y1 : y0;
				const z = k & 4 ? z1 : z0;
				const px = x - cam.tx;
				const py = y - cam.ty;
				const pz = z - cam.tz;
				const xa = px * cyw + pz * syw;
				const za = -px * syw + pz * cyw;
				const yb = py * cp + za * sp;
				const zb = -py * sp + za * cp + cam.dist;
				if (zb < 0.6) {
					if (bar) bar.np = 0;
					return false;
				}
				const s = F / zb;
				P[k * 3] = CX + xa * s;
				P[k * 3 + 1] = CY - yb * s;
				P[k * 3 + 2] = zb;
			}
			const vis = [camY > y1, camZ < z0, camX < x0, camX > x1, camZ > z1];
			let n = 0;
			for (let f = 0; f < 5; f++) {
				if (!vis[f]) continue;
				const idx = FACES[f];
				ctx.beginPath();
				for (let q = 0; q < 4; q++) {
					const X = P[idx[q] * 3];
					const Y = P[idx[q] * 3 + 1];
					if (q === 0) ctx.moveTo(X, Y);
					else ctx.lineTo(X, Y);
					if (bar && n < 3) {
						bar.pp[n][q * 2] = X;
						bar.pp[n][q * 2 + 1] = Y;
					}
				}
				ctx.closePath();
				ctx.fillStyle = pal[f];
				ctx.fill();
				if (outline) {
					ctx.lineWidth = 1.8;
					ctx.strokeStyle = edgeInk;
					ctx.stroke();
				} else {
					ctx.lineWidth = 0.6;
					ctx.strokeStyle = pal[f];
					ctx.stroke();
				}
				n++;
			}
			if (bar) bar.np = Math.min(n, 3);
			return true;
		}

		function projPt(x: number, y: number, z: number) {
			const px = x - cam.tx;
			const py = y - cam.ty;
			const pz = z - cam.tz;
			const xa = px * cyw + pz * syw;
			const za = -px * syw + pz * cyw;
			const yb = py * cp + za * sp;
			const zb = -py * sp + za * cp + cam.dist;
			if (zb < 1) return null;
			const s = F / zb;
			return [CX + xa * s, CY - yb * s];
		}

		function draw() {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, W, H);
			cyw = Math.cos(cam.yaw);
			syw = Math.sin(cam.yaw);
			cp = Math.cos(cam.pitch);
			sp = Math.sin(cam.pitch);
			camX = cam.tx + cam.dist * cp * syw;
			camY = cam.ty + cam.dist * sp;
			camZ = cam.tz - cam.dist * cp * cyw;
			CX = W / 2;
			CY = H / 2 - 20;

			ctx.save();
			ctx.shadowColor = slabShadow;
			ctx.shadowBlur = 26;
			ctx.shadowOffsetY = 12;
			box(-12.45, 12.45, -0.5, 0, -3.95, 3.95, SLAB, null, false);
			ctx.restore();
			box(-12.45, 12.45, -0.5, 0, -3.95, 3.95, SLAB, null, false);

			for (const b of bars) {
				const px = b.x - cam.tx;
				const pz = b.z - cam.tz;
				const py = -cam.ty;
				const za = -px * syw + pz * cyw;
				b.d = -py * sp + za * cp + cam.dist;
			}
			const order = bars.slice().sort((a, b2) => b2.d - a.d);
			state.order = order;

			for (const bb of order) {
				const pal = (state.hover === bb ? PAL_HOVER : PAL)[bb.bucket];
				box(
					bb.x - HALF,
					bb.x + HALF,
					0,
					Math.max(0.03, bb.h),
					bb.z - HALF,
					bb.z + HALF,
					pal,
					bb,
					state.sel === bb
				);
			}

			const names = dayList();
			ctx.font = `500 ${narrow ? 10 : 11}px Archivo, sans-serif`;
			ctx.fillStyle = axisInk;
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			for (let h = 0; h < COLS; h += 3) {
				const p = projPt(h - 11.5, 0, -3.95 - 0.95);
				if (p) ctx.fillText(`${pad(h)}:00`, p[0], p[1]);
			}
			ctx.textAlign = "right";
			for (let dd = 0; dd < ROWS; dd++) {
				if (narrow && dd % 2 === 1) continue;
				const p2 = projPt(-12.45 - 0.55, 0, 3 - dd);
				if (p2) ctx.fillText(names[dd] ?? "", p2[0], p2[1]);
			}
		}

		/* ----- picking ----- */
		function inQuad(poly: Float32Array, x: number, y: number) {
			let inside = false;
			for (let i = 0, j = 3; i < 4; j = i++) {
				const xi = poly[i * 2];
				const yi = poly[i * 2 + 1];
				const xj = poly[j * 2];
				const yj = poly[j * 2 + 1];
				if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
					inside = !inside;
			}
			return inside;
		}
		function pick(x: number, y: number) {
			const order = state.order;
			for (let i = order.length - 1; i >= 0; i--) {
				const b = order[i];
				for (let f = 0; f < b.np; f++) if (inQuad(b.pp[f], x, y)) return b;
			}
			return null;
		}

		/* ----- frame loop ----- */
		function frame(t: number) {
			raf = 0;
			if (!visible) return;
			const dt = Math.min(0.033, (t - last) / 1000 || 0.016);
			last = t;
			let active = false;

			if (!drag && Math.abs(yawVel) > 0.02 && !reduce) {
				goal.yaw += yawVel * dt;
				yawVel *= Math.exp(-dt * 4);
				active = true;
			} else if (!drag) {
				yawVel = 0;
			}

			const a = reduce ? 1 : 1 - Math.exp(-dt * 7);
			(Object.keys(goal) as (keyof typeof goal)[]).forEach((k) => {
				const diff = goal[k] - cam[k];
				if (Math.abs(diff) > (k === "yaw" || k === "pitch" ? 0.0004 : 0.004)) {
					cam[k] += diff * a;
					active = true;
				} else cam[k] = goal[k];
			});

			for (const b of bars) {
				if (reduce) {
					b.h = b.ht;
					b.hv = 0;
					continue;
				}
				if (b.delay > 0) {
					b.delay -= dt;
					active = true;
					continue;
				}
				const e = b.ht - b.h;
				if (Math.abs(e) > 0.002 || Math.abs(b.hv) > 0.01) {
					b.hv += e * 140 * dt;
					b.hv *= Math.exp(-dt * 11);
					b.h += b.hv * dt;
					active = true;
				} else {
					b.h = b.ht;
					b.hv = 0;
				}
			}
			if (state.sel) goal.ty = state.sel.ht * 0.5;

			if (active || dirty || drag) {
				dirty = false;
				draw();
				refreshTip();
			}
			if (active || drag) raf = requestAnimationFrame(frame);
		}

		/* ----- tooltip (imperative; it tracks the pointer every frame) ----- */
		let lastPtr: { x: number; y: number } | null = null;
		const tipEl: HTMLDivElement = tip;
		function refreshTip() {
			if (state.hover && lastPtr) {
				const m = cfgOf(state.metric);
				const b = state.hover;
				const names = dayList();
				tipEl.innerHTML = `<span style="font-weight:600">${names[b.r]} ${pad(b.c)}:00</span><span style="opacity:.7"> · </span>${fmtVal(state.metric, b.v, m.noun)}`;
				tipEl.style.display = "block";
				const tw = tipEl.offsetWidth;
				const th = tipEl.offsetHeight;
				tipEl.style.left = `${clamp(lastPtr.x + 14, 8, W - tw - 8)}px`;
				tipEl.style.top = `${clamp(lastPtr.y - th - 10, 8, H - th - 8)}px`;
			} else {
				tipEl.style.display = "none";
			}
		}

		/* ----- pointer interaction ----- */
		const ptrs: Record<number, { x: number; y: number }> = {};
		let nPtr = 0;
		let drag: {
			sx: number;
			sy: number;
			lx: number;
			ly: number;
			moved: number;
			type: string;
		} | null = null;
		let pinchD0 = 0;
		let pinchDist0 = 0;
		let lastMoveT = 0;
		const pos = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			return { x: e.clientX - r.left, y: e.clientY - r.top };
		};
		const goCustom = () => {
			if (state.view !== "custom") {
				state.view = "custom";
				setViewState("custom");
			}
		};

		const onPointerDown = (e: PointerEvent) => {
			if (e.pointerType === "mouse" && e.button !== 0) return;
			try {
				canvas.setPointerCapture(e.pointerId);
			} catch {
				/* older browsers */
			}
			const p = pos(e);
			ptrs[e.pointerId] = p;
			nPtr++;
			yawVel = 0;
			if (nPtr === 1) {
				drag = { sx: p.x, sy: p.y, lx: p.x, ly: p.y, moved: 0, type: e.pointerType };
				lastMoveT = performance.now();
			} else if (nPtr === 2) {
				const ids = Object.keys(ptrs);
				pinchD0 =
					Math.hypot(
						ptrs[Number(ids[0])].x - ptrs[Number(ids[1])].x,
						ptrs[Number(ids[0])].y - ptrs[Number(ids[1])].y
					) || 1;
				pinchDist0 = goal.dist;
				if (drag) drag.moved = 99;
			}
			state.hover = null;
			kick();
		};

		const onPointerMove = (e: PointerEvent) => {
			const p = pos(e);
			if (ptrs[e.pointerId]) {
				ptrs[e.pointerId] = p;
				if (nPtr === 2) {
					const ids = Object.keys(ptrs);
					const dd =
						Math.hypot(
							ptrs[Number(ids[0])].x - ptrs[Number(ids[1])].x,
							ptrs[Number(ids[0])].y - ptrs[Number(ids[1])].y
						) || 1;
					goal.dist = clamp(pinchDist0 * (pinchD0 / dd), 9, 60);
					goCustom();
					kick();
				} else if (drag) {
					const dx = p.x - drag.lx;
					const dy = p.y - drag.ly;
					drag.lx = p.x;
					drag.ly = p.y;
					drag.moved += Math.abs(dx) + Math.abs(dy);
					if (drag.moved > 4) {
						canvas.classList.add("is-dragging");
						goCustom();
						const now = performance.now();
						const dtm = Math.max(0.008, (now - lastMoveT) / 1000);
						lastMoveT = now;
						const dyaw = -dx * 0.0075;
						goal.yaw += dyaw;
						cam.yaw = goal.yaw;
						if (drag.type !== "touch") {
							goal.pitch = clamp(goal.pitch + dy * 0.006, 0.14, Math.PI / 2);
							cam.pitch = goal.pitch;
						}
						yawVel = clamp(yawVel * 0.6 + (dyaw / dtm) * 0.4, -4, 4);
						kick();
					}
				}
			} else if (nPtr === 0 && e.pointerType !== "touch") {
				lastPtr = p;
				const hb = pick(p.x, p.y);
				canvas.classList.toggle("is-pointer", !!hb);
				if (hb !== state.hover) {
					state.hover = hb;
					kick();
				} else if (hb) refreshTip();
			}
		};

		const endPtr = (e: PointerEvent) => {
			if (!ptrs[e.pointerId]) return;
			const p = pos(e);
			const wasClick = drag && drag.moved <= 4 && nPtr === 1 && e.type === "pointerup";
			delete ptrs[e.pointerId];
			nPtr = Math.max(0, nPtr - 1);
			if (wasClick) {
				const b = pick(p.x, p.y);
				if (b && b !== state.sel) {
					state.sel = b;
					setSel({ r: b.r, c: b.c });
					goal.tx = b.x;
					goal.tz = b.z;
					goal.ty = b.ht * 0.5;
					goal.dist = Math.min(goal.dist, narrow ? 22 : 17);
				} else if (state.sel) {
					doClearSelection();
				}
			}
			if (nPtr === 0) {
				drag = null;
				canvas.classList.remove("is-dragging");
			} else if (nPtr === 1) {
				drag = null;
			}
			kick();
		};
		const onPointerLeave = () => {
			if (nPtr === 0 && state.hover) {
				state.hover = null;
				lastPtr = null;
				canvas.classList.remove("is-pointer");
				kick();
			}
		};

		const onWheel = (e: WheelEvent) => {
			if (!(e.ctrlKey || e.metaKey)) return; // let the page scroll normally
			e.preventDefault();
			goal.dist = clamp(goal.dist * Math.exp(e.deltaY * 0.01), 9, 60);
			goCustom();
			kick();
		};

		const onKeyDown = (e: KeyboardEvent) => {
			let used = true;
			switch (e.key) {
				case "ArrowLeft":
					goal.yaw += 0.12;
					break;
				case "ArrowRight":
					goal.yaw -= 0.12;
					break;
				case "ArrowUp":
					goal.pitch = clamp(goal.pitch + 0.08, 0.14, Math.PI / 2);
					break;
				case "ArrowDown":
					goal.pitch = clamp(goal.pitch - 0.08, 0.14, Math.PI / 2);
					break;
				case "+":
				case "=":
					goal.dist = clamp(goal.dist * 0.88, 9, 60);
					break;
				case "-":
					goal.dist = clamp(goal.dist * 1.14, 9, 60);
					break;
				case "0":
				case "Escape":
					doResetView();
					used = false;
					break;
				default:
					used = false;
			}
			if (used) {
				e.preventDefault();
				goCustom();
				kick();
			}
		};

		/* ----- actions shared with the React chrome ----- */
		function doApplyMetric(key: TerrainMetricKey) {
			state.metric = key;
			const { lo, hi } = dataset.ranges[key];
			const loN = key === "cpl" ? lo * 0.55 : 0;
			bars.forEach((b) => {
				b.v = dataset.grids[key][b.r][b.c];
				b.norm = clamp((b.v - loN) / (hi - loN), 0, 1);
				b.bucket = bucketOf(b.norm);
				b.ht = 0.08 + b.norm * MAXH;
				b.delay = reduce ? 0 : b.c * 0.011 + (ROWS - 1 - b.r) * 0.02;
				if (reduce) {
					b.h = b.ht;
					b.hv = 0;
				}
			});
			if (state.sel) goal.ty = state.sel.ht * 0.5;
			kick();
		}

		function doSetView(v: Exclude<ViewName, "custom">) {
			state.view = v;
			setViewState(v);
			state.sel = null;
			setSel(null);
			preset(v, false);
		}
		function doClearSelection() {
			if (!state.sel) return;
			state.sel = null;
			setSel(null);
			const g = presetFor(state.view === "top" ? "top" : "persp");
			goal.tx = 0;
			goal.tz = 0;
			goal.ty = g.ty;
			goal.dist = g.dist;
			kick();
		}
		function doResetView() {
			doSetView("persp");
		}

		engineRef.current = {
			applyMetric: doApplyMetric,
			setView: doSetView,
			selectBar: (r, c) => {
				const b = bars[r * COLS + c];
				if (b && b !== state.sel) {
					state.sel = b;
					setSel({ r, c });
					goal.tx = b.x;
					goal.tz = b.z;
					goal.ty = b.ht * 0.5;
					goal.dist = Math.min(goal.dist, narrow ? 22 : 17);
					kick();
				}
			},
			clearSelection: doClearSelection,
		};

		/* ----- boot ----- */
		doApplyMetric(state.metric);
		layout();
		const canObserveSize = "ResizeObserver" in window;
		let ro: ResizeObserver | null = null;
		if (canObserveSize && plot) {
			ro = new ResizeObserver(layout);
			ro.observe(plot);
		} else {
			window.addEventListener("resize", layout);
		}
		let io: IntersectionObserver | null = null;
		if ("IntersectionObserver" in window) {
			io = new IntersectionObserver(
				(es) => {
					visible = es[0].isIntersecting;
					if (visible) kick();
				},
				{ threshold: 0.05 }
			);
			io.observe(plot);
		} else {
			visible = true;
			kick();
		}

		canvas.addEventListener("pointerdown", onPointerDown);
		canvas.addEventListener("pointermove", onPointerMove);
		canvas.addEventListener("pointerup", endPtr);
		canvas.addEventListener("pointercancel", endPtr);
		canvas.addEventListener("pointerleave", onPointerLeave);
		canvas.addEventListener("wheel", onWheel, { passive: false });
		canvas.addEventListener("keydown", onKeyDown);

		return () => {
			cancelAnimationFrame(raf);
			raf = 0;
			engineRef.current = null;
			ro?.disconnect();
			if (!canObserveSize) window.removeEventListener("resize", layout);
			io?.disconnect();
			canvas.removeEventListener("pointerdown", onPointerDown);
			canvas.removeEventListener("pointermove", onPointerMove);
			canvas.removeEventListener("pointerup", endPtr);
			canvas.removeEventListener("pointercancel", endPtr);
			canvas.removeEventListener("pointerleave", onPointerLeave);
			canvas.removeEventListener("wheel", onWheel);
			canvas.removeEventListener("keydown", onKeyDown);
		};
		// Mount-once engine; copy flows through dataRef, UI state through React.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setCoarse(window.matchMedia("(pointer: coarse)").matches);
	}, []);

	const applyMetric = (key: TerrainMetricKey) => {
		setMetricKey(key);
		engineRef.current?.applyMetric(key);
	};
	const setView = (v: Exclude<ViewName, "custom">) => engineRef.current?.setView(v);

	const selBar = sel ? dataset.grids[metricKey][sel.r][sel.c] : 0;
	const selLabel =
		sel && cfg
			? `${days[sel.r]} ${pad(sel.c)}:00 · ${fmtVal(metricKey, selBar, cfg.noun)}`
			: "";

	return (
		<div className={className}>
			<div>
				<h3 className="text-[15px] font-medium text-ink-950">{data.title}</h3>
				<p className="mt-1 text-[13px] text-ink-500">{data.caption}</p>
			</div>

			<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
				<div className="pillgroup" role="group" aria-label={data.metricGroupLabel}>
					{metrics.map((m) => (
						<button
							key={m.key}
							type="button"
							className="pill"
							aria-pressed={m.key === metricKey}
							onClick={() => applyMetric(m.key)}
						>
							{m.label}
						</button>
					))}
				</div>
				<div className="flex items-center gap-2">
					<div className="pillgroup" role="group" aria-label={data.viewGroupLabel}>
						<button
							type="button"
							className="pill"
							aria-pressed={view === "persp"}
							onClick={() => setView("persp")}
						>
							{data.perspectiveLabel}
						</button>
						<button
							type="button"
							className="pill"
							aria-pressed={view === "top"}
							onClick={() => setView("top")}
						>
							{data.topLabel}
						</button>
					</div>
					<button
						type="button"
						className="iconbtn"
						aria-label={data.resetLabel}
						title={data.resetLabel}
						onClick={() => setView("persp")}
					>
						<MdiIcon name="refresh" size={0.85} />
					</button>
				</div>
			</div>

			<div
				ref={plotRef}
				className="relative mt-4 h-[300px] overflow-hidden rounded-xl bg-gradient-to-b from-paper-50 to-primary-50 min-[560px]:h-[440px]"
			>
				<canvas
					ref={canvasRef}
					id={`${id}-canvas`}
					tabIndex={0}
					role="img"
					aria-label={data.canvasLabel}
					aria-describedby={`${id}-hint`}
					className="terrain-canvas block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50"
					style={{ touchAction: "pan-y" }}
				/>
				{sel && cfg ? (
					<button
						type="button"
						onClick={() => engineRef.current?.clearSelection()}
						className="terrain-sel absolute left-3 top-3 items-center gap-2 rounded-full border border-ink-950/15 bg-paper-50/90 px-3 py-1.5 text-xs font-medium text-ink-900 shadow-sm backdrop-blur"
						style={{ display: "inline-flex" }}
						aria-live="polite"
						aria-label={`${selLabel}. ${data.clearLabel}`}
					>
						<span>{selLabel}</span>
						<MdiIcon name="close" size={0.7} className="text-ink-500" />
					</button>
				) : null}
				<div
					ref={tipRef}
					role="status"
					className="pointer-events-none absolute z-10 hidden whitespace-nowrap rounded-lg bg-primary-900 px-2.5 py-1.5 text-xs text-paper-50 shadow-lg"
				/>
			</div>

			<div className="mt-4 flex flex-col justify-between gap-3 text-xs text-ink-500 sm:flex-row sm:items-center">
				<div className="flex items-center gap-2">
					<span>{cfg?.lessLabel}</span>
					<span className="flex gap-1" aria-hidden="true">
						{RAMP_VARS.map((v) => (
							<span
								key={v}
								className="block h-2.5 w-5 rounded-[3px]"
								style={{ backgroundColor: `rgb(var(${v}))` }}
							/>
						))}
					</span>
					<span>{cfg?.moreLabel}</span>
				</div>
				<p id={`${id}-hint`}>{coarse ? data.hintTouch : data.hintDesktop}</p>
			</div>

			{summary && cfg ? (
				<div className="mt-6 grid grid-cols-1 gap-6 border-t border-ink-950/10 pt-6 md:grid-cols-3 md:gap-10">
					<div>
						<div className="text-[13px] text-ink-500">{cfg.title}</div>
						<div className="mt-1 text-3xl font-medium tracking-tight text-ink-950 tabular-nums md:text-4xl">
							{summary.totalLabel}
						</div>
						<div className="mt-1 flex items-center gap-1 text-xs">
							<MdiIcon
								name={summary.up ? "arrowTopRight" : "arrowBottomRight"}
								size={0.7}
								className={summary.good ? "text-primary-700" : "text-accent-600"}
							/>
							<span
								className={`font-medium ${summary.good ? "text-primary-700" : "text-accent-600"}`}
							>
								{summary.up ? "+" : ""}
								{cfg.delta}%
							</span>
							<span className="text-ink-500">{data.statsNote}</span>
						</div>
					</div>
					<div>
						<div className="text-[13px] text-ink-500">{cfg.peakLabel}</div>
						<div className="mt-2 flex flex-col gap-2.5 text-[13px]">
							{summary.peaks.map((p) => (
								<div key={p.key} className="flex items-center justify-between">
									<span className="font-medium text-ink-950">{p.when}</span>
									<span className="tabular-nums text-ink-500">{p.value}</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<div className="text-[13px] text-ink-500">{cfg.dayLabel}</div>
						<div className="mt-1 text-lg font-medium text-ink-950">
							{summary.bestDay}
						</div>
						<div className="mt-1 text-xs leading-relaxed text-ink-500">
							{summary.daySub}
						</div>
					</div>
				</div>
			) : null}

			<table className="sr-only">
				<caption>{cfg ? `${cfg.title} — ${data.tableCaption}` : data.tableCaption}</caption>
				<thead>
					<tr>
						<th scope="col">Day</th>
						{Array.from({ length: COLS }, (_, c) => (
							<th key={c} scope="col">
								{pad(c)}:00
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{days.map((day, r) => (
						<tr key={day}>
							<th scope="row">{day}</th>
							{Array.from({ length: COLS }, (_, c) => (
								<td key={c}>{cfg ? dataset.grids[cfg.key][r][c] : 0}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
