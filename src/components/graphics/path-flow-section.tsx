"use client";

/**
 * PathFlowSection
 * ---------------------------------------------------------------------------
 * A section whose children are laid out along an SVG circuit-style path while a
 * light trail travels the path, driven by scroll progress or on an auto loop.
 *
 *   <PathFlowSection variant="staircase-ltr" mode="scroll" trailColor="#2563eb">
 *     <Card/> <Card/> <Card/>      // child N is placed in slot N of the variant
 *   </PathFlowSection>
 *
 * - Desktop (>= `breakpoint`): children are absolutely placed around the path
 *   using viewBox coordinates, so layout scales with the SVG.
 * - Below `breakpoint`: children stack vertically beside a straight vertical
 *   line that carries the same light trail.
 * - Works with Lenis (it only reads native scroll position via framer-motion).
 * - Import from "motion/react" instead if you are on the newer `motion` package.
 */

import {
  Children,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";

/* ----------------------------------------------------------------------------
 * Variant definitions
 * ------------------------------------------------------------------------- */

/** A content slot, in viewBox units. (ax, ay) = which point of the box sits on (x, y). */
export type FlowSlot = {
  x: number;
  y: number;
  ax?: 0 | 0.5 | 1;
  ay?: 0 | 0.5 | 1;
  /** box width in viewBox units */
  w?: number;
  /** override reveal point (0-1 along the path draw direction) */
  at?: number;
};

export type FlowPath = { d: string; rail: [number, number] };

export type FlowVariantDef = {
  w: number;
  h: number;
  paths: FlowPath[];
  /** true when the natural travel direction is opposite to the path's draw direction */
  reverse: boolean;
  flipX?: boolean;
  slots: FlowSlot[];
};

const s = (x: number, y: number, ax: 0 | 0.5 | 1 = 0, ay: 0 | 0.5 | 1 = 0, w = 460): FlowSlot => ({
  x,
  y,
  ax,
  ay,
  w,
});

const STAIRCASE_LTR: FlowVariantDef = {
  w: 1919,
  h: 960,
  reverse: true, // drawn bottom-right -> top-left; travels top-left -> bottom-right
  paths: [
    {
      d: "M2010.5 943.5H1366.5C1355.45 943.5 1346.5 934.546 1346.5 923.5V513C1346.5 501.954 1337.55 493 1326.5 493H1065.5C1054.45 493 1045.5 484.046 1045.5 473V258C1045.5 246.954 1036.55 238 1025.5 238H427C415.954 238 407 246.954 407 258V356C407 367.046 398.046 376 387 376H266C254.954 376 246 367.046 246 356V51C246 39.9543 237.046 31 226 31H-92",
      rail: [27, -17],
    },
  ],
  slots: [s(300, 40, 0, 0, 520), s(450, 290, 0, 0, 520), s(1110, 280, 0, 0, 520), s(1300, 700, 1, 0.5, 520), s(1400, 600, 0, 0, 480)],
};

const mirror = (v: FlowVariantDef): FlowVariantDef => ({
  ...v,
  flipX: !v.flipX,
  slots: v.slots.map((sl) => ({ ...sl, x: v.w - sl.x, ax: (1 - (sl.ax ?? 0)) as 0 | 0.5 | 1 })),
});

const EDGES_CONVERGE: FlowVariantDef = {
  w: 1920,
  h: 600,
  reverse: false,
  paths: [
    {
      d: "M-92 0.5H336.5C347.546 0.5 356.5 9.45431 356.5 20.5V134.5C356.5 145.546 365.454 154.5 376.5 154.5H901.5C912.546 154.5 921.5 163.454 921.5 174.5V465",
      rail: [20, 15],
    },
    {
      d: "M2012.5 0H1584C1572.95 0 1564 8.95431 1564 20V134C1564 145.046 1555.05 154 1544 154H1019C1007.95 154 999 162.954 999 174V464.5",
      rail: [-20, 15],
    },
  ],
  slots: [s(60, 200, 0, 0, 420), s(1860, 200, 1, 0, 420), s(960, 510, 0.5, 0, 560), s(960, 14, 0.5, 0, 560)],
};

const CROSS_FLOW: FlowVariantDef = {
  w: 1920,
  h: 1190,
  reverse: false,
  paths: [
    {
      d: "M-398 216H246C257.046 216 266 224.954 266 236V406.5C266 417.546 274.954 426.5 286 426.5H547C558.046 426.5 567 435.454 567 446.5V661.5C567 672.546 575.954 681.5 587 681.5H1185.5C1196.55 681.5 1205.5 672.546 1205.5 661.5V563.5C1205.5 552.454 1214.45 543.5 1225.5 543.5H1490.5C1501.55 543.5 1510.5 552.454 1510.5 563.5V868.5C1510.5 879.546 1519.45 888.5 1530.5 888.5H2254.5",
      rail: [20, 20],
    },
    {
      d: "M2174.5 1146.5H1530.5C1519.45 1146.5 1510.5 1137.55 1510.5 1126.5V996C1510.5 984.954 1501.55 976 1490.5 976H1224.5C1213.45 976 1204.5 967.046 1204.5 956V741C1204.5 729.954 1195.55 721 1184.5 721H721C709.954 721 701 729.954 701 741V839C701 850.046 692.046 859 681 859H430C418.954 859 410 850.046 410 839V534C410 522.954 401.046 514 390 514H-98",
      rail: [-20, 20],
    },
  ],
  slots: [s(60, 40, 0, 0, 460), s(640, 360, 0, 0, 500), s(1560, 300, 0, 0, 440), s(740, 770, 0, 0, 420), s(1560, 930, 0, 0, 420)],
};

export const FLOW_VARIANTS = {
  "staircase-ltr": STAIRCASE_LTR,
  "staircase-rtl": mirror(STAIRCASE_LTR),
  "edges-converge": EDGES_CONVERGE,
  "cross-flow": CROSS_FLOW,
} as const;

export type FlowVariant = keyof typeof FLOW_VARIANTS;

/* ----------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function useMinWidth(px: number) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(`(min-width:${px}px)`);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [px],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(`(min-width:${px}px)`).matches,
    () => false, // mobile-first on the server
  );
}

/** Layers that fake a fading comet tail: longest/faintest first, shortest/brightest last. */
const TAIL_LAYERS = [
  { k: 1, w: 1, o: 0.22 },
  { k: 0.6, w: 1.3, o: 0.5 },
  { k: 0.3, w: 1.7, o: 1 },
];
const GLOW_LAYER = { k: 0.3, w: 6, o: 0.8 };

/* ----------------------------------------------------------------------------
 * One traced path (base line + light trail + optional lit trace + head dot)
 * ------------------------------------------------------------------------- */

type TracePathProps = {
  d: string;
  transform?: string;
  progress: MotionValue<number>;
  reverse: boolean;
  color: string;
  trailColor: string;
  baseOpacity: number;
  intensity: number;
  width: number;
  trail: number;
  glow: boolean;
  head: boolean;
  trace: boolean;
  filterId: string;
  pathRef?: (el: SVGPathElement | null) => void;
};

function TracePath({
  d,
  transform,
  progress,
  reverse,
  color,
  trailColor,
  baseOpacity,
  intensity,
  width,
  trail,
  glow,
  head,
  trace,
  filterId,
  pathRef,
}: TracePathProps) {
  const baseRef = useRef<SVGPathElement | null>(null);
  const layerRefs = useRef<(SVGPathElement | null)[]>([]);
  const traceRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const layers = useMemo(() => (glow ? [GLOW_LAYER, ...TAIL_LAYERS] : TAIL_LAYERS), [glow]);

  const update = useCallback(
    (p: number) => {
      // head position in "draw space" units; goes 0 -> 1 + trail so the tail fully exits
      const hp = p * (1 + trail);
      layers.forEach((l, i) => {
        const el = layerRefs.current[i];
        if (!el) return;
        el.style.strokeDashoffset = String(reverse ? hp - 1 : trail * l.k - hp);
      });

      if (traceRef.current) {
        const q = clamp(hp);
        traceRef.current.style.strokeDasharray = reverse ? `0 ${1 - q} ${q} 2` : `${q} 2`;
      }

      const dot = dotRef.current;
      const base = baseRef.current;
      if (dot && base) {
        const pos = reverse ? 1 - hp : hp;
        if (pos <= 0 || pos >= 1) {
          dot.style.opacity = "0";
        } else {
          const pt = base.getPointAtLength(pos * base.getTotalLength());
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
          dot.style.opacity = "1";
        }
      }
    },
    [layers, reverse, trail],
  );

  useMotionValueEvent(progress, "change", update);
  useLayoutEffect(() => update(progress.get()), [update, progress, d]);

  return (
    <g transform={transform}>
      <path
        ref={(el) => {
          baseRef.current = el;
          pathRef?.(el);
        }}
        d={d}
        stroke={color}
        strokeOpacity={baseOpacity}
        strokeWidth={width}
      />
      {trace && (
        <path
          ref={traceRef}
          d={d}
          pathLength={1}
          stroke={trailColor}
          strokeOpacity={0.45 * intensity}
          strokeWidth={width}
          strokeDasharray="0 2"
        />
      )}
      {layers.map((l, i) => (
        <path
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          d={d}
          pathLength={1}
          stroke={trailColor}
          strokeOpacity={l.o * intensity}
          strokeWidth={width * l.w}
          strokeDasharray={`${trail * l.k} 2`}
          strokeDashoffset={reverse ? -1 : trail * l.k}
          filter={glow && i === 0 ? `url(#${filterId})` : undefined}
        />
      ))}
      {head && (
        <circle
          ref={dotRef}
          r={width * 2.4}
          fill={trailColor}
          opacity={0}
          filter={glow ? `url(#${filterId})` : undefined}
          style={{ opacity: 0 }}
        />
      )}
    </g>
  );
}

/* ----------------------------------------------------------------------------
 * All lines of a variant (shared by desktop path layout and mobile rail)
 * ------------------------------------------------------------------------- */

type LinesProps = {
  w: number;
  h: number;
  paths: FlowPath[];
  flipX?: boolean;
  fadeAxis: "x" | "y";
  rails: boolean;
  registerPath?: (i: number, el: SVGPathElement | null) => void;
} & Omit<TracePathProps, "d" | "transform" | "baseOpacity" | "intensity" | "filterId" | "pathRef">;

function Lines({ w, h, paths, flipX, fadeAxis, rails, registerPath, ...rest }: LinesProps) {
  const id = useId().replace(/:/g, "");
  const horizontal = fadeAxis === "x";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2={horizontal ? 1 : 0} y2={horizontal ? 0 : 1}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.1" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.9" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask
          id={`${id}-m`}
          maskUnits="userSpaceOnUse"
          x={horizontal ? 0 : -40}
          y={horizontal ? -h : 0}
          width={horizontal ? w : w + 80}
          height={horizontal ? h * 3 : h}
        >
          <rect
            x={horizontal ? 0 : -40}
            y={horizontal ? -h : 0}
            width={horizontal ? w : w + 80}
            height={horizontal ? h * 3 : h}
            fill={`url(#${id}-g)`}
          />
        </mask>
        <filter id={`${id}-f`} filterUnits="userSpaceOnUse" x={-w} y={-h} width={w * 3} height={h * 3}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <g mask={`url(#${id}-m)`}>
        <g transform={flipX ? `translate(${w} 0) scale(-1 1)` : undefined}>
          {paths.map((p, i) => (
            <g key={i}>
              {rails && (
                <TracePath
                  {...rest}
                  d={p.d}
                  transform={`translate(${p.rail[0]} ${p.rail[1]})`}
                  baseOpacity={0.12}
                  intensity={0.5}
                  head={false}
                  filterId={`${id}-f`}
                />
              )}
              <TracePath
                {...rest}
                d={p.d}
                baseOpacity={0.3}
                intensity={1}
                filterId={`${id}-f`}
                pathRef={(el) => registerPath?.(i, el)}
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * Reveal wrapper: fades/slides an item in as the trail reaches it
 * ------------------------------------------------------------------------- */

function FlowItem({
  reveal,
  at,
  enabled,
  children,
}: {
  reveal: MotionValue<number>;
  at: number;
  enabled: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const apply = useCallback(
    (v: number) => {
      const el = ref.current;
      if (!el || !enabled) return;
      const k = clamp((v - (at - 0.12)) / 0.12);
      el.style.opacity = String(0.15 + 0.85 * k);
      el.style.transform = `translate3d(0, ${(1 - k) * 20}px, 0)`;
    },
    [at, enabled],
  );
  useMotionValueEvent(reveal, "change", apply);
  useLayoutEffect(() => apply(reveal.get()), [apply, reveal]);

  return (
    <div ref={ref} data-flow-item style={enabled ? { opacity: 0.15 } : undefined} className="will-change-[opacity,transform]">
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * ------------------------------------------------------------------------- */

export interface PathFlowSectionProps {
  children?: ReactNode;
  /** content rendered above the path area (e.g. heading + intro) */
  header?: ReactNode;
  variant?: FlowVariant;
  /** "scroll": trail follows scroll progress. "auto": trail loops by itself. */
  mode?: "scroll" | "auto";
  /** base line color (any CSS color, default currentColor) */
  color?: string;
  /** light trail color */
  trailColor?: string;
  /** trail length as a fraction of the path (0.03 - 0.5) */
  trailLength?: number;
  /** stroke width in viewBox units */
  strokeWidth?: number;
  glow?: boolean;
  /** show the glowing dot at the head of the trail */
  head?: boolean;
  /** draw the parallel secondary lines */
  rails?: boolean;
  /** keep the path lit behind the trail (default: true in scroll mode) */
  trace?: boolean;
  /** items fade/slide in as the trail reaches them */
  revealItems?: boolean;
  /** flip the travel direction */
  reverse?: boolean;
  /** auto mode: seconds per pass */
  duration?: number;
  /** auto mode: seconds to wait between passes */
  repeatDelay?: number;
  /** auto mode: loop forever (default true) */
  loop?: boolean;
  /** scroll mode: framer-motion useScroll offset */
  scrollOffset?: UseScrollOptions["offset"];
  /** min viewport width (px) for the path layout; below it, content stacks */
  breakpoint?: number;
  className?: string;
  /** className for the path/stack area */
  contentClassName?: string;
}

export function PathFlowSection({
  children,
  header,
  variant = "staircase-ltr",
  mode = "scroll",
  color = "currentColor",
  trailColor = "#2563eb",
  trailLength = 0.14,
  strokeWidth = 1.5,
  glow = true,
  head = true,
  rails = true,
  trace,
  revealItems = true,
  reverse = false,
  duration = 6,
  repeatDelay = 0.6,
  loop = true,
  scrollOffset = ["start 75%", "end 35%"],
  breakpoint = 1024,
  className,
  contentClassName,
}: PathFlowSectionProps) {
  const v = FLOW_VARIANTS[variant];
  const wide = useMinWidth(breakpoint);
  const reduced = !!useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const pathEls = useRef<(SVGPathElement | null)[]>([]);
  const [ats, setAts] = useState<number[]>([]);
  const [stackH, setStackH] = useState(0);

  /* ---- progress sources ---- */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: scrollOffset });
  const scrollSpring = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const auto = useMotionValue(0);
  const autoMax = useMotionValue(0);
  const one = useMotionValue(1);
  const inView = useInView(sectionRef, { margin: "-10% 0px -10% 0px" });

  useMotionValueEvent(auto, "change", (p) => {
    if (p > autoMax.get()) autoMax.set(p);
  });

  useLayoutEffect(() => {
    if (mode !== "auto" || reduced || !inView) return;
    const controls = animate(auto, [0, 1], {
      duration,
      ease: "linear",
      repeat: loop ? Infinity : 0,
      repeatDelay,
    });
    return () => controls.stop();
  }, [mode, reduced, inView, duration, loop, repeatDelay, auto]);

  const progress = reduced ? one : mode === "scroll" ? scrollSpring : auto;
  const revealSource = reduced ? one : mode === "scroll" ? scrollSpring : autoMax;
  const showTrace = reduced ? true : (trace ?? mode === "scroll");

  const items = Children.toArray(children);
  const stack = !wide;
  const pathReverse = v.reverse !== reverse;
  const travelReverse = stack ? reverse : pathReverse;

  /* ---- desktop: find where along the path each slot sits ---- */
  useLayoutEffect(() => {
    if (stack) return;
    const els = pathEls.current.filter(Boolean) as SVGPathElement[];
    if (!els.length) return;
    const N = 240;
    const next = v.slots.map((slot) => {
      if (slot.at != null) return (pathReverse ? 1 - slot.at : slot.at) / (1 + trailLength);
      const px = v.flipX ? v.w - slot.x : slot.x;
      let best = Infinity;
      let bt = 0;
      for (const el of els) {
        const total = el.getTotalLength();
        for (let i = 0; i <= N; i++) {
          const pt = el.getPointAtLength((total * i) / N);
          const dist = Math.hypot(pt.x - px, pt.y - slot.y);
          if (dist < best) {
            best = dist;
            bt = i / N;
          }
        }
      }
      return (pathReverse ? 1 - bt : bt) / (1 + trailLength);
    });
    setAts(next);
  }, [stack, v, pathReverse, trailLength]);

  /* ---- mobile: measure stack height + item positions ---- */
  useLayoutEffect(() => {
    if (!stack) return;
    const el = stackRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setStackH(r.height);
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-flow-item]"));
      setAts(
        nodes.map((n) => {
          const b = n.getBoundingClientRect();
          const c = clamp((b.top + b.height / 2 - r.top) / r.height);
          return (travelReverse ? 1 - c : c) / (1 + trailLength);
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stack, travelReverse, trailLength, items.length]);

  const lineProps = {
    progress,
    reverse: travelReverse,
    color,
    trailColor,
    width: strokeWidth,
    trail: clamp(trailLength, 0.03, 0.5),
    glow,
    head,
    trace: showTrace,
    rails,
  };

  const atOf = (i: number) => ats[i] ?? (i + 1) / (items.length + 1);

  return (
    <section ref={sectionRef} className={["relative w-full overflow-x-clip", className].filter(Boolean).join(" ")}>
      {header && <div className="relative z-10 mx-auto w-full max-w-5xl px-6">{header}</div>}

      {stack ? (
        /* ---------- mobile / tablet: vertical rail ---------- */
        <div
          ref={stackRef}
          className={["relative mx-auto flex max-w-2xl flex-col gap-10 py-10 pl-14 pr-6", contentClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {stackH > 0 && (
            <div className="pointer-events-none absolute left-3 top-0 w-4" style={{ height: stackH }}>
              <Lines
                {...lineProps}
                w={16}
                h={stackH}
                fadeAxis="y"
                paths={[{ d: `M10 0V${stackH}`, rail: [-6, 0] }]}
              />
            </div>
          )}
          {items.map((child, i) => (
            <FlowItem key={i} reveal={revealSource} at={atOf(i)} enabled={revealItems}>
              {child}
            </FlowItem>
          ))}
        </div>
      ) : (
        /* ---------- desktop: content distributed along the path ---------- */
        <>
          <div
            className={["relative w-full", contentClassName].filter(Boolean).join(" ")}
            style={{ aspectRatio: `${v.w} / ${v.h}` }}
          >
            <Lines
              {...lineProps}
              w={v.w}
              h={v.h}
              paths={v.paths}
              flipX={v.flipX}
              fadeAxis="x"
              registerPath={(i, el) => {
                pathEls.current[i] = el;
              }}
            />
            {items.slice(0, v.slots.length).map((child, i) => {
              const slot = v.slots[i];
              const ax = slot.ax ?? 0;
              const ay = slot.ay ?? 0;
              return (
                <div
                  key={i}
                  className="absolute z-10"
                  style={{
                    left: `${(slot.x / v.w) * 100}%`,
                    top: `${(slot.y / v.h) * 100}%`,
                    width: `min(${((slot.w ?? 460) / v.w) * 100}%, 28rem)`,
                    transform: `translate(${-ax * 100}%, ${-ay * 100}%)`,
                    textAlign: ax === 1 ? "right" : ax === 0.5 ? "center" : "left",
                  }}
                >
                  <FlowItem reveal={revealSource} at={atOf(i)} enabled={revealItems}>
                    {child}
                  </FlowItem>
                </div>
              );
            })}
          </div>

          {/* children beyond the variant's slot count flow normally underneath */}
          {items.length > v.slots.length && (
            <div className="relative z-10 mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:grid-cols-2">
              {items.slice(v.slots.length).map((child, i) => (
                <div key={i}>{child}</div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default PathFlowSection;
