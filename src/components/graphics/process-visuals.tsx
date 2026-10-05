import type { ReactNode } from 'react';

import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { ProcessBarTone, ProcessVisual } from '@/lib/content/types';

/**
 * Process visuals — one small editable picture per process step.
 *
 * Five layouts (funnel, channel mix, launch checklist, weekly bars, scale
 * bars), each reading only its own slice of the step's `visual` spec, so copy
 * stays editable in Keystatic while the pictures stay illustrative. Fills and
 * inks resolve through the `globals.css` token channels; entrances replay
 * whenever the parent remounts on step change (`key={index}`).
 */

/** Bar fill ramp, soft → ember. */
const BAR_FILL: Record<ProcessBarTone, string> = {
  soft: 'rgb(var(--color-primary-200))',
  mid: 'rgb(var(--color-primary-300))',
  deep: 'rgb(var(--color-primary-400))',
  field: 'rgb(var(--color-primary-600))',
  ember: 'rgb(var(--color-accent-500))',
};
/** Type on a bar: paper on the dark fills, ink on the light ones. */
const BAR_INK: Record<ProcessBarTone, string> = {
  soft: 'rgb(var(--color-primary-900))',
  mid: 'rgb(var(--color-primary-900))',
  deep: 'rgb(var(--color-paper-50))',
  field: 'rgb(var(--color-paper-50))',
  ember: 'rgb(var(--color-paper-50))',
};

const LABEL = 'rgb(var(--color-primary-600))';
const SOFT = 'rgb(var(--color-primary-500))';
const INK = 'rgb(var(--color-primary-900))';
const ACCENT = 'rgb(var(--color-accent-500))';
const ACCENT_INK = 'rgb(var(--color-accent-600))';
const FAINT_LINE = 'rgb(var(--color-primary-600) / 0.25)';
const CARD_LINE = 'rgb(var(--color-primary-600) / 0.18)';
const CONNECTOR = 'rgb(var(--color-primary-600) / 0.08)';
const PAPER = 'rgb(var(--color-paper-50))';

function SvgFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 360 230"
      width="100%"
      style={{ display: 'block', maxWidth: 420, margin: '0 auto' }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Eyebrow({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} fontSize={11} fontWeight={600} letterSpacing={1.2} fill={ACCENT}>
      {children}
    </text>
  );
}

/** Funnel: stacked narrowing rows with a dashed leak and dripping drops. */
export function FunnelVisual({ visual }: { visual: ProcessVisual }) {
  const rows = visual.rows ?? [];
  const y0 = 14;
  const h = 36;
  const gap = 18;
  return (
    <SvgFrame>
      {rows.map((_, i) => {
        if (i >= rows.length - 1) return null;
        const wa = ((rows[i].width / 100) * 320) / 2;
        const wb = ((rows[i + 1].width / 100) * 320) / 2;
        const ya = y0 + i * (h + gap) + h;
        const yb = ya + gap;
        return (
          <polygon
            key={`c-${i}`}
            points={`${180 - wa},${ya} ${180 + wa},${ya} ${180 + wb},${yb} ${180 - wb},${yb}`}
            fill={CONNECTOR}
          />
        );
      })}
      {rows.map((r, i) => {
        const w = (r.width / 100) * 320;
        const y = y0 + i * (h + gap);
        return (
          <g key={`r-${r.label}-${i}`}>
            <rect
              className="pv-wide"
              style={{ animationDelay: `${i * 0.12}s` }}
              x={180 - w / 2}
              y={y}
              width={w}
              height={h}
              rx={9}
              fill={BAR_FILL[r.tone]}
            />
            <text x={180} y={y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill={BAR_INK[r.tone]}>
              {r.label}
            </text>
          </g>
        );
      })}
      {rows.length > 2 ? (
        <Leak ly={y0 + 1 * (h + gap) + h - 2} note={visual.leakNote ?? ''} />
      ) : null}
    </SvgFrame>
  );
}

function Leak({ ly, note }: { ly: number; note: string }) {
  return (
    <g>
      <path
        d={`M305 ${ly} q8 14 0 22`}
        stroke={ACCENT}
        strokeWidth={1.6}
        fill="none"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      {[0, 0.6, 1.2].map((dl, k) => (
        <circle key={dl} className="pv-leak" style={{ animationDelay: `${dl}s` }} cx={300 + k * 6} cy={ly + 16} r={3.4} fill={ACCENT} />
      ))}
      <text x={338} y={ly + 66} textAnchor="end" fontSize={11} fontWeight={600} fill={ACCENT_INK}>
        {note}
      </text>
    </g>
  );
}

/** Channels: horizontal mix bars beside a 90-day targets plate. */
export function ChannelsVisual({ visual }: { visual: ProcessVisual }) {
  const channels = visual.channels ?? [];
  const targets = visual.targets ?? [];
  const plateH = 52 + targets.length * 32;
  return (
    <SvgFrame>
      <Eyebrow x={0} y={16}>
        {visual.mixTitle ?? ''}
      </Eyebrow>
      {channels.map((c, i) => {
        const y = 36 + i * 44;
        const w = (c.pct / 100) * 100 * 2.3;
        return (
          <g key={`${c.label}-${i}`}>
            <text x={0} y={y + 17} fontSize={12} fontWeight={500} fill={LABEL}>
              {c.label}
            </text>
            <rect
              className="pv-wide"
              style={{ animationDelay: `${i * 0.1}s` }}
              x={62}
              y={y}
              width={w}
              height={26}
              rx={7}
              fill={BAR_FILL[c.tone]}
            />
            <text x={62 + w + 8} y={y + 17} fontSize={11} fill={SOFT}>
              {c.pct}%
            </text>
          </g>
        );
      })}
      <g className="pv-pop" style={{ animationDelay: '.35s', transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={214} y={24} width={144} height={plateH} rx={12} fill={PAPER} stroke={CARD_LINE} />
        <text x={228} y={48} fontSize={11} fontWeight={600} letterSpacing={1.2} fill={ACCENT}>
          {visual.targetsTitle ?? ''}
        </text>
        {targets.map((t, i) => {
          const y = 72 + i * 32;
          return (
            <g key={`${t}-${i}`}>
              <circle cx={236} cy={y - 4} r={8} fill="rgb(var(--color-accent-500) / 0.12)" />
              <path
                d={`M232 ${y - 4} l3 3 5 -6`}
                stroke={ACCENT}
                strokeWidth={1.8}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x={252} y={y} fontSize={12} fontWeight={500} fill={INK}>
                {t}
              </text>
            </g>
          );
        })}
      </g>
    </SvgFrame>
  );
}

/** Checklist: pre-flight rows, then the dark go-live plate. */
export function ChecklistVisual({ visual }: { visual: ProcessVisual }) {
  const items = visual.items ?? [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxWidth: 380, width: '100%', margin: '0 auto' }}>
      {items.map((t, i) => (
        <div key={`${t}-${i}`} className="checkrow pv-in" style={{ animationDelay: `${i * 0.28}s` }}>
          <span className="checkrow__badge">
            <MdiIcon name="check" size={0.55} />
          </span>
          <span>{t}</span>
        </div>
      ))}
      <div
        className="checkrow pv-in"
        style={{
          animationDelay: `${items.length * 0.28 + 0.1}s`,
          backgroundColor: 'rgb(var(--color-primary-900))',
          color: 'rgb(var(--color-paper-50))',
          justifyContent: 'space-between',
        }}
      >
        <span>{visual.doneNote ?? ''}</span>
        <span style={{ color: ACCENT, fontWeight: 600 }}>{visual.doneTag ?? ''}</span>
      </div>
    </div>
  );
}

/** Weekly: six test bars with the winner badged. */
export function WeeklyVisual({ visual }: { visual: ProcessVisual }) {
  const values = visual.values ?? [];
  const max = Math.max(...values, 1);
  const base = 188;
  const mid = Math.ceil(values.length / 2);
  const heights = values.map((v) => 30 + (v / max) * 126);
  const maxH = Math.max(...heights, 0);
  return (
    <SvgFrame>
      <Eyebrow x={12} y={16}>
        {visual.title ?? ''}
      </Eyebrow>
      {values.map((_, i) => {
        const x = 22 + i * 54;
        const win = i === values.length - 1;
        const tone: keyof typeof BAR_FILL = win ? 'ember' : i >= mid ? 'deep' : 'mid';
        return (
          <g key={i}>
            <rect
              className="pv-grow"
              style={{ animationDelay: `${i * 0.1}s` }}
              x={x}
              y={base - heights[i]}
              width={36}
              height={heights[i]}
              rx={7}
              fill={BAR_FILL[tone]}
            />
            <text x={x + 18} y={base + 18} textAnchor="middle" fontSize={11} fill={SOFT}>
              W{i + 1}
            </text>
          </g>
        );
      })}
      <line x1={12} y1={base} x2={348} y2={base} stroke={FAINT_LINE} />
      <g className="pv-pop" style={{ animationDelay: '.9s', transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={236} y={base - maxH - 30} width={112} height={22} rx={11} fill={INK} />
        <text x={292} y={base - maxH - 15} textAnchor="middle" fontSize={11} fontWeight={600} fill={PAPER}>
          {visual.winnerNote ?? ''}
        </text>
      </g>
    </SvgFrame>
  );
}

/** Scale: climbing bars with market tags appearing in order. */
export function ScaleVisual({ visual }: { visual: ProcessVisual }) {
  const values = visual.values ?? [];
  const tags = visual.tags ?? [];
  const max = Math.max(...values, 1);
  const base = 164;
  const heights = values.map((v) => 30 + (v / max) * 130);
  let tx = 10;
  return (
    <SvgFrame>
      <Eyebrow x={10} y={16}>
        {visual.title ?? ''}
      </Eyebrow>
      {values.map((_, i) => {
        const x = 18 + i * 66;
        const last = i === values.length - 1;
        const tone: keyof typeof BAR_FILL = last ? 'ember' : i > 1 ? 'deep' : 'mid';
        return (
          <rect
            key={i}
            className="pv-grow"
            style={{ animationDelay: `${i * 0.12}s` }}
            x={x}
            y={base - heights[i]}
            width={48}
            height={heights[i]}
            rx={8}
            fill={BAR_FILL[tone]}
          />
        );
      })}
      <line x1={10} y1={base} x2={350} y2={base} stroke={FAINT_LINE} />
      {tags.map((t, i) => {
        const w = t.length * 7.4 + 30;
        const x = tx;
        tx += w + 8;
        return (
          <g
            key={`${t}-${i}`}
            className="pv-pop"
            style={{ animationDelay: `${0.7 + i * 0.25}s`, transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <rect x={x} y={184} width={w} height={26} rx={13} fill={PAPER} stroke="rgb(var(--color-primary-600) / 0.2)" />
            <circle cx={x + 13} cy={197} r={3.5} fill={ACCENT} />
            <text x={x + 23} y={201} fontSize={11.5} fontWeight={500} fill={INK}>
              {t}
            </text>
          </g>
        );
      })}
    </SvgFrame>
  );
}

export function ProcessVisual({ visual }: { visual: ProcessVisual }) {
  switch (visual.kind) {
    case 'funnel':
      return <FunnelVisual visual={visual} />;
    case 'channels':
      return <ChannelsVisual visual={visual} />;
    case 'checklist':
      return <ChecklistVisual visual={visual} />;
    case 'weekly':
      return <WeeklyVisual visual={visual} />;
    case 'scale':
      return <ScaleVisual visual={visual} />;
  }
}
