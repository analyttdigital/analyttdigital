'use client';

import { useEffect, useId, useRef, useState, type ReactElement } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

import { CountUp } from '@/lib/motion/counter';
import type { CapabilityReadout as Readout } from '@/lib/content/types';

/**
 * Capability readout — the instrument that hangs off one row of the
 * register.
 *
 * Four figures, all hairline SVG with `non-scaling-stroke`, all ink on the
 * paper ground with exactly one ember series each: channel spend against
 * attributed return, the unknown share of spend collapsing once tracking is
 * set up, cost per lead descending on a target, organic sessions building
 * against the prior year. Series, labels and the measurement arrive from the
 * content layer; nothing but the geometry is authored here.
 *
 * Each figure holds its parts back only after it has mounted, and releases
 * them the first time its row comes into view, so the row reads as an
 * instrument taking a reading — while any reader without scripts gets the
 * finished figure immediately.
 */

const W = 320;
const H = 92;
const BASE = 78;
const PLOT = 58;

/** Normalise a series to 0–1 across the plot's full height. */
function series(values: number[]) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  return (v: number) => (v - min) / Math.max(max - min, 1);
}

const AXIS = (
  <line
    x1="0"
    y1={BASE}
    x2={W}
    y2={BASE}
    stroke="currentColor"
    strokeWidth="1"
    vectorEffect="non-scaling-stroke"
    opacity="0.24"
  />
);

/* ------------------------------ channels ------------------------------- */

function ChannelsFigure({ readout }: { readout: Readout }) {
  const spend = readout.values;
  const ret = readout.prior ?? [];
  const labels = readout.labels ?? [];
  const slot = 304 / Math.max(spend.length, 1);
  const barW = 17;
  const scale = series([...spend, ...ret]);
  const left = (i: number) => 8 + i * slot + (slot - (barW * 2 + 4)) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[92px] w-full" aria-hidden focusable="false">
      {AXIS}
      {spend.map((v, i) => (
        <g key={i}>
          <rect
            className="cap-bar"
            style={{ animationDelay: `${i * 70}ms` }}
            x={left(i)}
            y={BASE - scale(v) * PLOT}
            width={barW}
            height={Math.max(scale(v) * PLOT, 1.5)}
            fill="currentColor"
            opacity="0.38"
          />
          <rect
            className="cap-bar fill-accent-500"
            style={{ animationDelay: `${i * 70 + 110}ms` }}
            x={left(i) + barW + 4}
            y={BASE - scale(ret[i] ?? 0) * PLOT}
            width={barW}
            height={Math.max(scale(ret[i] ?? 0) * PLOT, 1.5)}
          />
          <text
            className="font-mono capitalize fill-primary-300"
            x={left(i) + barW + 2}
            y={BASE + 12}
            textAnchor="middle"
            fontSize="10"
            letterSpacing="0.1em"
          >
            {(labels[i] ?? '')}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ----------------------------- attribution ----------------------------- */

function AttributionFigure({ readout }: { readout: Readout }) {
  const after = readout.values;
  const before = readout.prior ?? [];
  const names = readout.labels ?? ['Attributed', 'Modelled', 'Unknown'];
  const hatchId = `cap-hatch-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const unknown = (row: number[]) => row[2] ?? 0;

  const bar = (label: string, data: number[], y: number, note: string, noteClass: string) => {
    let x = 0;
    return (
      <g>
        <text className="font-mono fill-primary-300" x="0" y={y - 6} fontSize="10" letterSpacing="0.16em">
          {label}
        </text>
        <text
          className={`font-mono ${noteClass}`}
          x={W}
          y={y - 6}
          textAnchor="end"
          fontSize="10"
          letterSpacing="0.16em"
        >
          {note}
        </text>
        {data.map((v, i) => {
          const width = (v / 100) * W;
          const seg = (
            <rect
              className="cap-seg-fill"
              style={{ animationDelay: `${i * 90}ms` }}
              x={x}
              y={y}
              width={Math.max(width, 0.5)}
              height="14"
              fill={i === 2 ? `url(#${hatchId})` : 'currentColor'}
              opacity={i === 0 ? 0.72 : i === 1 ? 0.3 : 1}
            />
          );
          x += width;
          return seg;
        })}
        <line
          x1="0"
          y1={y + 14}
          x2={W}
          y2={y + 14}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.24"
        />
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[92px] w-full" aria-hidden focusable="false">
      <defs>
        <pattern
          id={hatchId}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1.3" opacity="0.42" />
        </pattern>
      </defs>
      {bar('BEFORE', before, 22, `${unknown(before)}% UNKNOWN`, 'fill-accent-300')}
      {bar('AFTER', after, 58, `${unknown(after)}% UNKNOWN`, 'fill-primary-300')}
      {names.map((name, i) => (
        <g key={name}>
          <rect
            x={i * 112}
            y={BASE + 4}
            width="7"
            height="7"
            fill={i === 2 ? `url(#${hatchId})` : 'currentColor'}
            opacity={i === 0 ? 0.72 : i === 1 ? 0.3 : 1}
          />
          <text
            className="font-mono capitalize fill-primary-300"
            x={i * 112 + 12}
            y={BASE + 11}
            fontSize="9.5"
            letterSpacing="0.12em"
          >
            {name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------- descent ------------------------------- */

function DescentFigure({ readout }: { readout: Readout }) {
  const values = readout.values;
  const x0 = 10;
  const x1 = W - 8;
  const y0 = 16;
  const y1 = 70;
  const scale = series(values);
  const px = (i: number) => x0 + (i / Math.max(values.length - 1, 1)) * (x1 - x0);
  const py = (v: number) => y1 - scale(v) * (y1 - y0);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x1} ${y1} L${x0} ${y1} Z`;
  const target = readout.target;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[92px] w-full" aria-hidden focusable="false">
      {target ? (
        <g>
          <line
            className="cap-seg-fill"
            x1={x0}
            y1={py(target)}
            x2={x1}
            y2={py(target)}
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.5"
          />
          {readout.targetLabel ? (
            <text
              className="font-mono capitalize fill-accent-700 cap-pop"
              x={x1}
              y={py(target) - 6}
              textAnchor="end"
              fontSize="9.5"
              letterSpacing="0.14em"
            >
              {readout.targetLabel}
            </text>
          ) : null}
        </g>
      ) : null}
      <path className="cap-area fill-accent-500/10" d={area} />
      <path
        className="cap-draw"
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      {AXIS}
      {values.map((v, i) => (
        <g key={i}>
          <rect
            className="cap-pop fill-accent-500"
            style={{ animationDelay: `${700 + i * 60}ms` }}
            x={px(i) - 2}
            y={py(v) - 2}
            width="4"
            height="4"
          />
          {i % 2 === 0 || i === values.length - 1 ? (
            <text
              className="font-mono capitalize fill-primary-300"
              x={px(i)}
              y={BASE + 12}
              textAnchor="middle"
              fontSize="9.5"
            >
              W{i + 1}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------- organic ------------------------------- */

function OrganicFigure({ readout }: { readout: Readout }) {
  const values = readout.values;
  const prior = readout.prior ?? [];
  const x0 = 10;
  const x1 = W - 8;
  const y0 = 14;
  const y1 = 70;
  const scale = series([...values, ...prior]);
  const px = (i: number) => x0 + (i / Math.max(values.length - 1, 1)) * (x1 - x0);
  const py = (v: number) => y1 - scale(v) * (y1 - y0);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x1} ${y1} L${x0} ${y1} Z`;
  const priorLine = prior
    .map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[92px] w-full" aria-hidden focusable="false">
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={x0}
          y1={y1 - t * (y1 - y0)}
          x2={x1}
          y2={y1 - t * (y1 - y0)}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.18"
        />
      ))}
      {priorLine ? (
        <path
          className="cap-draw"
          d={priorLine}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.38"
        />
      ) : null}
      <path className="cap-area fill-accent-500/10" d={area} />
      <path
        className="cap-draw"
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <rect
        className="cap-pop fill-accent-500"
        x={x1 - 3}
        y={py(values[values.length - 1] ?? 0) - 3}
        width="6"
        height="6"
      />
      <text className="font-mono fill-primary-300" x={x0} y={BASE + 12} fontSize="9.5" letterSpacing="0.12em">
        12 MO AGO
      </text>
      <text
        className="font-mono fill-primary-300"
        x={x1}
        y={BASE + 12}
        textAnchor="end"
        fontSize="9.5"
        letterSpacing="0.12em"
      >
        NOW
      </text>
    </svg>
  );
}

/* -------------------------------- frame -------------------------------- */

const FIGURES: Record<Readout['kind'], (props: { readout: Readout }) => ReactElement> = {
  channels: ChannelsFigure,
  attribution: AttributionFigure,
  descent: DescentFigure,
  organic: OrganicFigure,
};

export function CapabilityReadout({ readout }: { readout?: Readout }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => setArmed(true), []);

  if (!readout) return null;

  const Figure = FIGURES[readout.kind] ?? ChannelsFigure;

  return (
    <figure
      ref={ref}
      className={`cap-fig m-0 text-primary-300 ${armed ? 'fig-anim' : ''} ${
        armed && (inView || reduce) ? 'fig-lit' : ''
      }`}
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-2.5">
        <span className="font-mono text-[9.5px] font-medium capitalize  text-primary-300">
          {readout.caption}
        </span>
        {readout.tag ? (
          <span className="inline-flex items-center gap-2 font-mono text-[9px] font-medium capitalize  text-accent-300">
            <span aria-hidden className="h-2 w-2 bg-accent-500" />
            {readout.tag}
          </span>
        ) : null}
      </figcaption>

      <Figure readout={readout} />

      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="num block text-[clamp(1.9rem,3vw,2.6rem)] leading-none text-primary-50">
          <CountUp value={readout.value} />
        </span>
        <span className="max-w-[30ch] font-mono text-[9.5px] capitalize tracking-[0.13em] leading-[1.7] text-primary-300">
          {readout.valueLabel}
        </span>
      </div>
    </figure>
  );
}
