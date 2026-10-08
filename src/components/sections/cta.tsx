import { Action } from '@/components/layout/action';
import { PixelMark } from '@/components/graphics/pixel-mark';
import { MaskedLine, Reveal } from '@/lib/motion/reveal';
import type { CtaSection } from '@/lib/content/types';

/**
 * CTA — the close, as Otto's "closing" band.
 *
 * One full-bleed ember field before the footer: the statement set huge on
 * the left, the ask (body + the world's one action) on the right, and a
 * footer-top hairline carrying the terms in mono. The pixel mark stands
 * oversized and ghosted off the right edge, the way Otto's closing mark
 * haunts its own band. Ember means this is the live decision — the only
 * saturated band on the page is the one that asks for something. Content
 * shape unchanged: eyebrow, portal label, headline, body, action, note.
 */
export function Cta({ cta }: { cta?: CtaSection }) {
  const lines = (cta?.headline ?? '').split('\n');

  return (
    <section id="audit" className="relative scroll-mt-24 overflow-hidden bg-accent-500 text-paper-50">
      {/* the signal crosses onto the ember field */}
      <div aria-hidden className="seam" />

      <PixelMark className="pointer-events-none absolute -right-24 -top-16 h-[300px] w-[420px] rotate-[18deg] text-paper-50/10 md:h-[420px] md:w-[560px]" />

      <div className="relative px-5 md:px-8">
        <div className="mx-auto w-full max-w-[1360px] pb-10 pt-16 md:pt-24">
          <p className="label text-paper-50/80">{cta?.portalLabel ?? cta?.eyebrow}</p>

          <div className="mt-8 grid min-h-[280px] items-center gap-x-14 gap-y-12 lg:grid-cols-[1fr_0.85fr]">
            <h2 className="title text-[clamp(2.4rem,7vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              {lines.map((line, i) => (
                <MaskedLine key={`${line}-${i}`} delay={0.15 + i * 0.09}>
                  <span className={i === lines.length - 1 ? 'text-primary-950' : undefined}>
                    {line || ' '}
                  </span>
                </MaskedLine>
              ))}
            </h2>

            <div className="lg:pl-[12%]">
              <Reveal delay={0.3}>
                <p className="label text-paper-50/70">{cta?.eyebrow}</p>
              </Reveal>
              <Reveal delay={0.36}>
                <p className="mt-5 max-w-[32ch] text-[13.5px] leading-[1.85] text-paper-50/90">
                  {cta?.body}
                </p>
              </Reveal>
              <Reveal delay={0.44} className="mt-8">
                <Action
                  href={cta?.ctaHref ?? 'mailto:hello@analyttdigital.com'}
                  label={cta?.cta ?? 'Request a free audit'}
                  variant="paper"
                />
              </Reveal>
            </div>
          </div>

          {/* footer-top — the terms, in mono, on a hairline */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-paper-50/40 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-50/80">
              {cta?.note ?? 'No deck. No obligation. Just the findings.'}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-50/60">
              Terms — no deck · no obligation · findings only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
