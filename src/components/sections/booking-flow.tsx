import { InViewTitle } from '@/components/ui/in-view-title';
import { GlowButton } from '@/components/ui/glow-button';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, ProcessSection } from '@/lib/content/types';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

/**
 * BookingFlow — the audit booking as a checklist.
 *
 * Built for the digital-audit "how it works" block, which previously reused
 * the scroll-driven `process` instrument. Same `ProcessSection` shape, but
 * a static checklist instead of a stage: one checked row per step (title,
 * desc, chips inline) with the closing ask row beneath. No scroll progress,
 * no client state: motion rides the shared `GsapReveal`, so this stays a
 * server component.
 */
export function BookingFlow({
  data,
  classes,
  className,
  id,
}: DataProps<ProcessSection, 'head' | 'steps' | 'closing'>) {
  const steps = data?.steps ?? [];

  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-16 md:py-24 ${className ?? ''}`}>
      <div
        className={['relative mx-auto w-full max-w-7xl px-5 md:px-8', classes?.head]
          .filter(Boolean)
          .join(' ')}
      >
        <GsapReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
            <div data-rise className="lg:sticky lg:top-24 lg:self-start">
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={`${data?.headline ?? ''} ${data?.headlineAccent ?? ''}`.replace(/\n/g, ' ').trim()}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.6rem)] text-ink-950"
              />
              {data?.lede ? (
                <p className="mt-6 max-w-[44ch] text-sm leading-[1.85] text-ink-500 md:text-base">
                  {data.lede}
                </p>
              ) : null}
            </div>

            {steps.length > 0 ? (
              <ol
                className={['grid content-start gap-3', classes?.steps]
                  .filter(Boolean)
                  .join(' ')}
              >
                {steps.map((step, i) => (
                  <li
                    key={step.n || i}
                    data-rise={Math.min(i + 1, 3)}
                    className="flex items-start gap-4 rounded-2xl border border-ink-950/[0.07] bg-paper-50 px-5 py-4"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-500 text-paper-50">
                      <MdiIcon name="check" size={0.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium tracking-tight text-ink-950">
                        <span className="num mr-2 text-accent-600">{step.n}</span>
                        {step.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-[1.75] text-ink-500">
                        {step.desc}
                      </span>
                      {step.chips?.length ? (
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {step.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-ink-950/15 px-3 py-0.5 text-[11px] text-ink-700"
                            >
                              {chip}
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>

          {data?.closing || data?.cta ? (
            <div
              data-rise
              className={['mt-12 flex flex-col justify-between gap-5 border-t border-ink-950/10 pt-8 md:flex-row md:items-center', classes?.closing]
                .filter(Boolean)
                .join(' ')}
            >
              {data?.closing ? (
                <p className="max-w-xl text-sm leading-relaxed text-ink-600">{data.closing}</p>
              ) : (
                <span />
              )}
              {data?.cta ? (
                <GlowButton
                  data={{ label: data.cta, href: data.ctaHref }}
                  className="w-full shrink-0 sm:w-auto"
                  tone="ember"
                />
              ) : null}
            </div>
          ) : null}
        </GsapReveal>
      </div>
    </section>
  );
}
