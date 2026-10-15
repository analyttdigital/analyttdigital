import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { DataProps, FormShellSection } from '@/lib/content/types';

/**
 * FormShell — the inquiry form's honest placeholder.
 *
 * No backend is wired yet, so the form renders its fields disabled inside
 * a ledger panel and routes the ask to the content-layer fallback (mailto).
 * When a backend lands, only this file changes: fields enable, submit posts.
 */
export function FormShell({ data, classes, className, id }: DataProps<FormShellSection, 'panel'>) {
  const fields = data?.fields ?? [];
  return (
    <section id={id} className="relative overflow-hidden bg-paper py-24 md:py-32">
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
          <div
            data-rise="2"
            className={[
              'mt-12 rounded-[2rem] bg-paper-50 p-7 ring-1 ring-ink-950/10 md:p-10',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <form aria-label={data?.headline} onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) =>
                  field.kind === 'textarea' ? (
                    <label key={field.name} className="grid gap-2 sm:col-span-2">
                      <span className="font-mono text-[10px] capitalize tracking-[0.14em] text-ink-400">
                        {field.label}
                      </span>
                      <textarea
                        name={field.name}
                        rows={5}
                        disabled
                        placeholder={field.label}
                        className="w-full rounded-2xl border border-ink-950/15 bg-paper px-4 py-3 text-sm text-ink-500 opacity-60"
                      />
                    </label>
                  ) : (
                    <label key={field.name} className="grid gap-2">
                      <span className="font-mono text-[10px] capitalize tracking-[0.14em] text-ink-400">
                        {field.label}
                      </span>
                      <input
                        type={field.kind}
                        name={field.name}
                        disabled
                        placeholder={field.label}
                        className="w-full rounded-full border border-ink-950/15 bg-paper px-4 py-3 text-sm text-ink-500 opacity-60"
                      />
                    </label>
                  ),
                )}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="inline-flex cursor-not-allowed items-center gap-2.5 rounded-full bg-ink-950/40 px-6 py-3.5 text-sm font-medium text-paper-50">
                  {data?.submitLabel}
                  <MdiIcon name="arrowRight" size={0.8} />
                </span>
                <a
                  href={data?.fallbackHref || 'mailto:hello@analyttdigital.com'}
                  className="inline-flex items-center gap-2.5 rounded-full border border-ink-950/15 px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors duration-200 hover:border-ink-950/30"
                >
                  {data?.fallbackLabel}
                </a>
              </div>
              {data?.note ? (
                <p className="mt-6 font-mono text-[10px] capitalize tracking-[0.14em] text-ink-400">
                  {data.note}
                </p>
              ) : null}
            </form>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
