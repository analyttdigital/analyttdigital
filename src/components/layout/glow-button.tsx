import type { MouseEventHandler } from 'react';

import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps } from '@/lib/content/types';

/**
 * GlowButton — gradient-glow CTA with a hover sheen.
 *
 * A blurred gradient halo sits behind an ink pill; on hover the halo blooms
 * and a diagonal sheen sweeps across the face, the lead mark warms and the
 * trailing arrow nudges forward. Tones are fixed Tailwind literals (ember by
 * default); anything beyond tone rides the `classes` slots so callers can
 * restyle without breaking the generated utilities.
 *
 * Renders an anchor when `data.href` is set, a button otherwise. The pill
 * radius is the requested design's own — an explicit exception to the
 * square-corner rule, same standing as the hero tunnel treatment.
 */

export type GlowTone = 'ember' | 'violet';

export type GlowSlot = 'root' | 'glow' | 'body' | 'sheen' | 'lead' | 'trail';

export type GlowButtonData = {
  label: string;
  href?: string;
  /** MDI name; `undefined` keeps the default mark, `false` hides it. */
  leadIcon?: string | false;
  /** MDI name; `undefined` keeps the default arrow, `false` hides it. */
  trailIcon?: string | false;
};

const TONES: Record<GlowTone, { glow: string; lead: string }> = {
  ember: {
    glow: 'from-accent-600 via-accent-400 to-accent-600',
    lead: 'text-accent-300 group-hover:text-accent-200',
  },
  violet: {
    glow: 'from-primary-500 via-primary-300 to-primary-500',
    lead: 'text-primary-300 group-hover:text-primary-200',
  },
};

type GlowButtonProps = DataProps<GlowButtonData, GlowSlot> & {
  tone?: GlowTone;
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function GlowButton({ data, classes, className, id, tone = 'ember', type = 'button', onClick }: GlowButtonProps) {
  const t = TONES[tone];
  const lead = data.leadIcon === false ? null : (data.leadIcon ?? 'sparkles');
  const trail = data.trailIcon === false ? null : (data.trailIcon ?? 'arrowRight');

  const bodyClass = `relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-paper-50/10 bg-accent-500 px-8 py-3.5 leading-none text-paper-50 shadow-[inset_0_1px_0_0_rgb(var(--color-paper-50)/0.1)] transition-all duration-300 ease-out hover:border-paper-50/20 hover:bg-accent-800 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${classes?.body ?? ''}`;

  const inner = (
    <>
      {/* Sheen sweep */}
      <span
        aria-hidden
        className={`absolute inset-0 z-0 h-full w-full -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-full ${classes?.sheen ?? ''}`}
      >
        <span className="absolute inset-0 w-1/2 origin-left -skew-x-12 bg-gradient-to-r from-transparent via-paper-50/10 to-transparent" />
      </span>

      {lead ? (
        <span className={`relative z-10 transition-colors duration-300 ${t.lead} ${classes?.lead ?? ''}`}>
          <MdiIcon name={lead} size={0.75} />
        </span>
      ) : null}

      <span className="relative z-10 text-sm font-medium tracking-tight">{data.label}</span>

      {trail ? (
        <span
          className={`relative z-10 text-paper-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-paper-50 ${classes?.trail ?? ''}`}
        >
          <MdiIcon name={trail} size={0.65} />
        </span>
      ) : null}
    </>
  );

  return (
    <div id={id} className={`group relative ${className ?? ''} ${classes?.root ?? ''}`}>
      {/* Hover glow behind */}
      <div
        aria-hidden
        className={`absolute -inset-1 rounded-full bg-gradient-to-r opacity-20 blur transition duration-500 group-hover:opacity-50 group-hover:duration-200 will-change-transform ${t.glow} ${classes?.glow ?? ''}`}
      />
      {data.href ? (
        <a href={data.href} className={bodyClass}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={bodyClass}>
          {inner}
        </button>
      )}
    </div>
  );
}
