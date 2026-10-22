import { GlowButton } from '@/components/ui/glow-button';
import { InViewTitle } from '@/components/ui/in-view-title';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, PlanPickerSection } from '@/lib/content/types';

/**
 * PlanPickerAlt — a guide to choosing the right plan.
 *
 * The options explain which plans fit which businesses; they are not
 * selectable controls. The audit ask links to the configured CTA directly.
 */
export function PlanPickerAlt({ data, classes, className, id }: DataProps<PlanPickerSection, 'rows'>) {
  const options = data?.options ?? [];
  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div data-rise>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-7 max-w-[16ch] text-[clamp(2rem,4vw,2.8rem)] text-ink-950"
              />
            </div>
            {data?.body ? (
              <p data-rise="1" className="max-w-[52ch] text-sm leading-[1.85] text-ink-500">
                {data.body}
              </p>
            ) : null}
          </div>
          {options.length > 0 ? (
            <ol
              data-rise="2"
              className={['mt-12 border-t border-ink-950/10', classes?.rows, className]
                .filter(Boolean)
                .join(' ')}
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-4 border-b border-ink-950/10 py-5 sm:gap-6"
                >
                  <span aria-hidden className="mt-1.5 h-2 w-2 rounded-full bg-accent-500" />
                  <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="verb text-[clamp(1.1rem,1.8vw,1.35rem)] text-ink-950">
                      {option.label}
                    </span>
                    {option.hint ? (
                      <span className="max-w-[52ch] text-[13px] leading-[1.75] text-ink-500">
                        {option.hint}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
          <div data-rise="2" className="mt-8 flex flex-wrap items-center gap-4">
            <GlowButton
              data={{ label: data?.cta ?? '', href: data?.ctaHref || undefined }}
              className="w-full sm:w-auto"
              tone="ember"
            />
            {data?.note ? (
              <p className="font-mono text-[10px] capitalize text-ink-400">
                {data.note}
              </p>
            ) : null}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
