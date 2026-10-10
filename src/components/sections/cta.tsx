'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';

import { GlowButton } from '@/components/layout/glow-button';
import { GsapReveal, Magnetic } from '@/lib/motion/gsap-reveal';
import type { CtaSection } from '@/lib/content/types';

/**
 * CTA — the close, one ask inside the signal orb.
 *
 * A three.js particle shell — violet motes, ember packets, an ember
 * wireframe core — turns behind the page's final statement, leaning toward
 * the pointer; the ember GlowButton is magnetic, pulled toward the cursor
 * and snapping back on an elastic settle. Headline and body rise and
 * de-blur on scroll (GSAP). The orb is ambient and client-only; under
 * reduced motion the band holds a static ember glow instead. Light ground,
 * ink type, ember reserved for the ask. Content shape unchanged: eyebrow,
 * portal label, headline, body, action, note.
 */

const SignalOrb = dynamic(() => import('@/components/graphics/signal-orb'), { ssr: false });

export function Cta({ cta }: { cta?: CtaSection }) {
  const lines = (cta?.headline ?? '').split('\n');
  const reduce = useReducedMotion();

  return (
    <section id="audit" className="ground--paper relative scroll-mt-24 overflow-hidden text-ink-900">
      <div aria-hidden className="seam" />

      {/* the orb — ambient, pointer-leaning, never carrying information */}
      {reduce ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(50%_55%_at_50%_45%,rgb(var(--color-accent-500)/0.1),transparent_70%)]"
        />
      ) : (
        <SignalOrb className="pointer-events-none absolute inset-0 opacity-60" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(65%_60%_at_50%_50%,transparent_40%,rgb(var(--color-paper-100)/0.9))]"
      />

      <div className="relative px-5 md:px-8">
        <GsapReveal className="mx-auto w-full max-w-[880px] py-24 text-center md:py-32">
          <p data-rise className="label label--live inline-block text-ink-500">
            {cta?.portalLabel ?? cta?.eyebrow}
          </p>

          <h2 className="title mt-8 text-[clamp(2.2rem,5.6vw,4.4rem)] text-ink-950">
            {lines.map((line, i) => (
              <span key={`${line}-${i}`} data-rise={i + 1} className="block">
                <span className={i === lines.length - 1 ? 'text-accent-600' : undefined}>
                  {line || ' '}
                </span>
              </span>
            ))}
          </h2>

          <p data-rise={lines.length + 1} className="mx-auto mt-7 max-w-[52ch] text-sm leading-[1.85] text-ink-500 md:text-base">
            {cta?.body}
          </p>

          <div data-rise={lines.length + 2} className="mt-11 flex justify-center">
            <Magnetic>
              <GlowButton
                data={{ label: cta?.cta ?? 'Request a free audit', href: cta?.ctaHref ?? 'mailto:hello@analyttdigital.com' }}
                tone="ember"
              />
            </Magnetic>
          </div>

          <div data-rise={lines.length + 3} className="mt-20 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-left">
            <p className="font-mono text-[10px] capitalize tracking-[0.16em] text-ink-400">
              {cta?.note ?? 'No deck. No obligation. Just the findings.'}
            </p>
            <p className="font-mono text-[10px] capitalize tracking-[0.16em] text-ink-300">
              {cta?.eyebrow}
            </p>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
