'use client';

import Link from '@/components/ui/link';
import { InViewTitle } from '@/components/ui/in-view-title';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { useForm, ValidationError } from '@formspree/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { FormEvent, ReactNode } from 'react';
import type { DataProps, FormField, FormShellSection } from '@/lib/content/types';

const EMPTY_FIELDS: FormField[] = [];

function OptionalGsapReveal({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  return enabled ? <GsapReveal>{children}</GsapReveal> : <>{children}</>;
}

function RequiredMarker({ required }: { required?: boolean }) {
  return required ? <span aria-hidden="true"> *</span> : null;
}

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
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const formId = 'contact-form';
  const fallbackHref = data?.fallbackHref || 'mailto:hello@analyttdigital.com';
  const isQuotePopup =
    router.isReady &&
    new URLSearchParams(router.asPath.split('?')[1]?.split('#')[0] ?? '').get('quote') === '1';

  const closeQuotePopup = useCallback(() => {
    const [pathAndQuery, hash = ''] = router.asPath.split('#');
    const [pathname, search = ''] = pathAndQuery.split('?');
    const params = new URLSearchParams(search);
    params.delete('quote');
    const query = params.toString();

    return router.replace(
      `${pathname}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`,
      undefined,
      { shallow: true, scroll: false },
    );
  }, [router]);

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

  useEffect(() => {
    if (!isQuotePopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeQuotePopup();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeQuotePopup, isQuotePopup]);

  useEffect(() => {
    if (!state.succeeded) return;
    formRef.current?.reset();
    setFieldValues({});
  }, [state.succeeded]);

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

  const section = (
    <section
      id={id ?? 'get-quote'}
      className={
        isQuotePopup
          ? 'fixed inset-0 z-[100] overflow-y-auto bg-ink-950/70 p-4 backdrop-blur-sm md:p-8'
          : `relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`
      }
      onMouseDown={
        isQuotePopup
          ? (event) => {
              if (event.target === event.currentTarget) closeQuotePopup();
            }
          : undefined
      }
    >
      <div
        className={
          isQuotePopup
            ? 'relative mx-auto w-full max-w-5xl py-6 md:py-10'
            : 'relative mx-auto w-full max-w-7xl px-5 md:px-8'
        }
      >
        <OptionalGsapReveal enabled={!isQuotePopup}>
          <div
            role={isQuotePopup ? 'dialog' : undefined}
            aria-modal={isQuotePopup ? true : undefined}
            aria-label={isQuotePopup ? data?.headline : undefined}
            data-rise={isQuotePopup ? undefined : ''}
            className={[
              'grid gap-10 rounded-[2rem] bg-paper-50 p-7 ring-1 ring-ink-950/10 md:p-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14',
              classes?.panel,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isQuotePopup ? (
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeQuotePopup}
                className="absolute right-5 top-5 z-10 rounded-full border border-ink-950/15 px-4 py-2 font-mono text-[10px] text-red-500 transition-colors hover:border-red-700/30 hover:text-ink-950 md:right-8  md:top-8 mt-6"
              >
                Close
              </button>
            ) : null}
            <div className="mt-8">
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
                <Link
                  href={fallbackHref}
                  className="inline-flex items-center gap-2.5 rounded-full border border-ink-950/15 px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors duration-200 hover:border-ink-950/30"
                >
                  {data?.fallbackLabel}
                </Link>
              </div>
              {data?.note ? (
                <p className="mt-6 font-mono text-[10px] capitalize text-ink-400">
                  {data.note}
                </p>
              ) : null}
            </div>
            <form
              ref={formRef}
              id={formId}
              aria-label={data?.headline}
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5 mt-8">
                {fields.map((field) => {
                  if (field.dependsOn && fieldValues[field.dependsOn] !== field.dependsOnValue) {
                    return null;
                  }

                  if (field.kind === 'checkboxes' || field.kind === 'radio') {
                    return (
                      <fieldset key={field.name} className="grid gap-3">
                        <legend className="font-mono text-[10px] text-ink-400">
                          {field.label}<RequiredMarker required={field.required} />
                        </legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(field.options ?? []).map((option) => (
                            <label key={option.value} className="flex items-start gap-3 text-sm text-ink-700">
                              <input
                                type={field.kind === 'radio' ? 'radio' : 'checkbox'}
                                name={field.name}
                                value={option.value}
                                required={field.required}
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
                        <span className="font-mono text-[10px] text-ink-400">
                          {field.label}<RequiredMarker required={field.required} />
                        </span>
                        <select
                          name={field.name}
                          required={field.required}
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
                        {field.label}<RequiredMarker required={field.required} />
                      </span>
                      <textarea
                        name={field.name}
                        rows={5}
                        placeholder={field.label}
                        required={field.required}
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
                        {field.label}<RequiredMarker required={field.required} />
                      </span>
                      <input
                        type={field.kind}
                        name={field.name}
                        placeholder={field.label}
                        required={field.required}
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
        </OptionalGsapReveal>
      </div>
    </section>
  );

  return isQuotePopup ? createPortal(section, document.body) : section;
}
