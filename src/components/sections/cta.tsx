import { SheetBlock } from '@/components/layout/sheet-block';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { CouponTear, MaskedLine, Reveal } from '@/lib/motion/reveal';
import type { CtaSection } from '@/lib/content/types';

/**
 * CTA — the tear-off coupon.
 *
 * The offer prints as what it is: a stub with a perforated edge, a dashed
 * tear line, the primary action inside it and the fine print below. The
 * sheet ends with the one thing the reader came for held in their hand.
 */
export function Cta({ cta }: { cta?: CtaSection }) {
  return (
    <SheetBlock id="audit" folio="10" head={cta?.eyebrow} tone="c">
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.3] mix-blend-multiply" />

      <div className="relative mx-auto w-full max-w-[860px] text-center">
        <Reveal delay={0.1}>
          {cta?.portalLabel ? <p className="stamp stamp--spot">{cta.portalLabel}</p> : null}
        </Reveal>

        {/* the coupon */}
        <CouponTear delay={0.18} className="mt-8">
          <div className="perforate-top px-4 pb-1 pt-[11px] sm:px-8">
            <div className="coupon rounded-[2px]">
              <div className="px-6 pb-8 pt-10 sm:px-12 sm:pb-10 sm:pt-12">
                <h2 className="sheet-title text-[clamp(1.9rem,4.4vw,3.1rem)] text-ink-950">
                  {(cta?.headline ?? '').split('\n').map((line, i) => (
                    <MaskedLine key={`${line}-${i}`} delay={0.3 + i * 0.08}>
                      {line || ' '}
                    </MaskedLine>
                  ))}
                </h2>

                <p className="body-copy mx-auto mt-6 max-w-[52ch]">{cta?.body}</p>

                <div aria-hidden className="tear-rule mx-auto my-9 w-full max-w-[420px]" />

                <a href={cta?.ctaHref ?? 'mailto:hello@analyttdigital.com'} className="btn-sheet btn-sheet--spot">
                  {cta?.cta ?? 'Request a free audit'} <MdiIcon name="arrowTopRight" size={0.6} />
                </a>
              </div>

              {/* fine print, printed below the tear */}
              <p className="w-narrow border-t border-ink-950/12 px-6 py-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                {cta?.note ?? 'No deck. No obligation. Just the findings.'}
              </p>
            </div>
          </div>
        </CouponTear>

        <Reveal delay={0.5}>
          <p className="folio w-narrow mt-9">hello@analyttdigital.com</p>
        </Reveal>
      </div>
    </SheetBlock>
  );
}
