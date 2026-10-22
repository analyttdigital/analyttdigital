'use client';

import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import type { FormEvent } from 'react';
import type { DataProps, FormShellSection } from '@/lib/content/types';

/**
 * FormShellAlt — the inquiry split: ask left, fields right.
 *
 * Where `FormShell` stacks the head above one full-width ledger panel, the
 * alt splits the panel: the ask (headline, body, fallback mailto card with
 * the note) holds the left column and the fields run on the right. The
 * Formspree form ID is deployment configuration, rather than editable page
 * content, so the contact page can keep its existing content shape.
 */
export function FormShellAlt({ data, classes, className, id }: DataProps<FormShellSection, 'panel'>) {
  const fields = data?.fields ?? [];
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_FORM_ID;
  const formAction = formspreeId ? `https://formspree.io/f/${formspreeId}` : undefined;
  const formId = 'contact-form';
  const fallbackHref = data?.fallbackHref || 'mailto:hello@analyttdigital.com';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (formAction) return;

    // Keep the contact page useful in local or preview deployments before its
    // public Formspree ID has been added.
    event.preventDefault();
    const body = Array.from(new FormData(event.currentTarget).entries())
      .map(([name, value]) => `${name}: ${value}`)
      .join('\n');
    const separator = fallbackHref.includes('?') ? '&' : '?';
    window.location.href = `${fallbackHref}${separator}subject=${encodeURIComponent(data?.headline ?? '')}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id={id} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          <div
            data-rise
            className={[
              'grid gap-10 rounded-[2rem] bg-paper-50 p-7 ring-1 ring-ink-950/10 md:p-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div>
              <p className="label text-ink-500">{data?.eyebrow}</p>
              <InViewTitle
                text={(data?.headline ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h2"
                className="title mt-6 max-w-[14ch] text-[clamp(1.8rem,3.4vw,2.4rem)] text-ink-950"
              />
              {data?.body ? (
                <p className="mt-5 max-w-[44ch] text-sm leading-[1.85] text-ink-500">
                  {data.body}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  form={formId}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-opacity duration-200 hover:opacity-85"
                >
                  {data?.submitLabel}
                  <MdiIcon name="arrowRight" size={0.8} />
                </button>
                <a
                  href={fallbackHref}
                  className="inline-flex items-center gap-2.5 rounded-full border border-ink-950/15 px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors duration-200 hover:border-ink-950/30"
                >
                  {data?.fallbackLabel}
                </a>
              </div>
              {data?.note ? (
                <p className="mt-6 font-mono text-[10px] capitalize text-ink-400">
                  {data.note}
                </p>
              ) : null}
            </div>
            <form
              id={formId}
              action={formAction}
              method="POST"
              aria-label={data?.headline}
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5">
                {fields.map((field) =>
                  field.kind === 'textarea' ? (
                    <label key={field.name} className="grid gap-2">
                      <span className="font-mono text-[10px] capitalize text-ink-400">
                        {field.label}
                      </span>
                      <textarea
                        name={field.name}
                        rows={5}
                        placeholder={field.label}
                        required
                        className="w-full rounded-2xl border border-ink-950/15 bg-paper px-4 py-3 text-sm text-ink-500"
                      />
                    </label>
                  ) : (
                    <label key={field.name} className="grid gap-2">
                      <span className="font-mono text-[10px] capitalize text-ink-400">
                        {field.label}
                      </span>
                      <input
                        type={field.kind}
                        name={field.name}
                        placeholder={field.label}
                        required
                        className="w-full rounded-full border border-ink-950/15 bg-paper px-4 py-3 text-sm text-ink-500"
                      />
                    </label>
                  ),
                )}
              </div>
            </form>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
