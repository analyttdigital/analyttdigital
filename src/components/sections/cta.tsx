import { Action } from '@/components/layout/action';
import { Band, BandHead } from '@/components/layout/band';
import { MaskedLine, Reveal } from '@/lib/motion/reveal';
import type { CtaSection } from '@/lib/content/types';

/**
 * CTA — where the route terminates.
 *
 * The offer, stated once and in full: the recoverable-spend headline, what the
 * audit is, the single action, and the fine print under it. The page ends on
 * paper with the trace net running behind it in ink, its routes converging on
 * the one button, so the last thing the reader sees is the same network they
 * arrived in — with a single address on it.
 */
/** Three on the centre line — label, claim, action — with the outer two
 *  pairs feeding in from the margins, so the single button is the terminus
 *  every route is aiming at. */
const NODES = [
  { x: 0.08, y: 0.3 },
  { x: 0.5, y: 0.13 },
  { x: 0.5, y: 0.4 },
  { x: 0.5, y: 0.77 },
  { x: 0.92, y: 0.3 },
];

export function Cta({ cta }: { cta?: CtaSection }) {
  return (
    <Band
      id="audit"
      ground="paper"
      mesh={{ seed: 23, count: 5, depth: 30, opacity: 0.44, tone: 'plate', anchors: NODES }}
    >
      <div className="relative">
        <div className="relative mx-auto max-w-[880px] text-center">
          <BandHead center>{cta?.eyebrow}</BandHead>

          {cta?.portalLabel ? (
            <Reveal delay={0.14}>
              <p className="label label--plate mt-8">{cta.portalLabel}</p>
            </Reveal>
          ) : null}

          <h2 className="display mt-8 text-[clamp(2.1rem,5.4vw,4rem)] text-ink-950">
            {(cta?.headline ?? '').split('\n').map((line, i) => (
              <MaskedLine key={`${line}-${i}`} delay={0.22 + i * 0.08}>
                {line || ' '}
              </MaskedLine>
            ))}
          </h2>

          <Reveal delay={0.4}>
            <p className="body body--paper mx-auto mt-7 max-w-[54ch]">{cta?.body}</p>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-11 flex justify-center">
              <Action
                href={cta?.ctaHref ?? 'mailto:hello@analyttdigital.com'}
                label={cta?.cta ?? 'Request a free audit'}
              />
            </div>
          </Reveal>

          <Reveal delay={0.58}>
            <p className="label label--plate mt-9">
              {cta?.note ?? 'No deck. No obligation. Just the findings.'}
            </p>
          </Reveal>
        </div>
      </div>
    </Band>
  );
}