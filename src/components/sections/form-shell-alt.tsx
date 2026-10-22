'use client';

import { InViewTitle } from '@/components/graphics/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { useForm, ValidationError } from '@formspree/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { DataProps, FormField, FormShellSection } from '@/lib/content/types';

const EMPTY_FIELDS: FormField[] = [];

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
  const fields = data?.fields ?? EMPTY_FIELDS;
  const router = useRouter();
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_FORM_ID;
  const [state, submitToFormspree] = useForm(formspreeId ?? '');
  const [fieldValues, setFieldValues] = useState<Record<string, string | string[]>>({});
  const formId = 'contact-form';
  const fallbackHref = data?.fallbackHref || 'mailto:hello@analyttdigital.com';

  useEffect(() => {
    if (!router.isReady) return;

    const params = new URLSearchParams(router.asPath.split('?')[1]?.split('#')[0] ?? '');
    const initialValues: Record<string, string | string[]> = {};

    fields.forEach((field) => {
      const values = params.getAll(field.name);
      if (values.length === 0) return;

      if (field.kind === 'checkboxes') {
        const allowedValues = new Set((field.options ?? []).map((option) => option.value));
        const selectedValues = values.filter((value) => allowedValues.has(value));
        if (selectedValues.length > 0) initialValues[field.name] = selectedValues;
        return;
      }

      const value = values[0];
      if (field.kind === 'select' || field.kind === 'radio') {
        const allowedValues = new Set((field.options ?? []).map((option) => option.value));
        if (allowedValues.has(value)) initialValues[field.name] = value;
        return;
      }

      initialValues[field.name] = value;
    });

    setFieldValues(initialValues);
  }, [fields, router.asPath, router.isReady]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (formspreeId) {
      void submitToFormspree(event);
      return;
    }

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
    <section id={id ?? 'get-quote'} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
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
                  disabled={state.submitting}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-opacity duration-200 hover:opacity-85"
                >
                  {state.submitting ? 'Sending…' : data?.submitLabel}
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
              aria-label={data?.headline}
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5">
                {fields.map((field) => {
                  if (field.dependsOn && fieldValues[field.dependsOn] !== field.dependsOnValue) {
                    return null;
                  }

                  if (field.kind === 'checkboxes' || field.kind === 'radio') {
                    return (
                      <fieldset key={field.name} className="grid gap-3">
                        <legend className="font-mono text-[10px] text-ink-400">
                          {field.label}
                        </legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(field.options ?? []).map((option) => (
                            <label key={option.value} className="flex items-start gap-3 text-sm text-ink-700">
                              <input
                                type={field.kind === 'radio' ? 'radio' : 'checkbox'}
                                name={field.name}
                                value={option.value}
                                required={field.kind === 'radio'}
                                checked={
                                  field.kind === 'radio'
                                    ? fieldValues[field.name] === option.value
                                    : Array.isArray(fieldValues[field.name]) && fieldValues[field.name].includes(option.value)
                                }
                                onChange={() =>
                                  setFieldValues((current) => {
                                    if (field.kind === 'radio') {
                                      return { ...current, [field.name]: option.value };
                                    }
                                    const existing = current[field.name];
                                    const selected = Array.isArray(existing) ? existing : [];
                                    return {
                                      ...current,
                                      [field.name]: selected.includes(option.value)
                                        ? selected.filter((value) => value !== option.value)
                                        : [...selected, option.value],
                                    };
                                  })
                                }
                                className="mt-0.5 accent-accent-500"
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    );
                  }

                  if (field.kind === 'select') {
                    return (
                      <label key={field.name} className="grid gap-2">
                        <span className="font-mono text-[10px] text-ink-400">{field.label}</span>
                        <select
                          name={field.name}
                          required
                          value={typeof fieldValues[field.name] === 'string' ? fieldValues[field.name] : ''}
                          onChange={(event) =>
                            setFieldValues((current) => ({ ...current, [field.name]: event.target.value }))
                          }
                          className="w-full rounded-full border border-ink-950/15 bg-paper px-4 py-3 text-sm text-ink-500"
                        >
                          <option value="" disabled>
                            Select one
                          </option>
                          {(field.options ?? []).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  }

                  return field.kind === 'textarea' ? (
                    <label key={field.name} className="grid gap-2">
                      <span className="font-mono text-[10px] capitalize text-ink-400">
                        {field.label}
                      </span>
                      <textarea
                        name={field.name}
                        rows={5}
                        placeholder={field.label}
                        required
                        value={typeof fieldValues[field.name] === 'string' ? fieldValues[field.name] : ''}
                        onChange={(event) =>
                          setFieldValues((current) => ({ ...current, [field.name]: event.target.value }))
                        }
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
                        value={typeof fieldValues[field.name] === 'string' ? fieldValues[field.name] : ''}
                        onChange={(event) =>
                          setFieldValues((current) => ({ ...current, [field.name]: event.target.value }))
                        }
                        className="w-full rounded-full border border-ink-950/15 bg-paper px-4 py-3 text-sm text-ink-500"
                      />
                    </label>
                  );
                })}
              </div>
              {state.succeeded ? (
                <p className="mt-5 text-sm text-ink-700" role="status">
                  Thanks — your message has been sent.
                </p>
              ) : null}
              <ValidationError
                errors={state.errors}
                className="mt-5 text-sm text-red-700"
              />
            </form>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
