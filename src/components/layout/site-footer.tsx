import Image from 'next/image';

import { GsapReveal } from '@/lib/motion/gsap-reveal';
import { InViewTitle } from '@/components/graphics/in-view-title';
import { useChrome } from '@/lib/content/chrome';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { DataProps, LayoutContent } from '@/lib/content/types';

/**
 * The footer — the page's closing card, not a separate deep world.
 *
 * The page is light paper: rounded `paper-50` panels with ring + shadow,
 * ink pill CTAs, top-image cards, and one ember panel per page. The old
 * footer was the lone deep violet band; this one follows the page instead.
 * A paper stage holds a closing card (intro left like Work: live eyebrow,
 * display title, direct line, ink pill CTA + back-to-top — index right like
 * Work's case grid: CMS link columns beside a signal list of labeled rows
 * with MDI keys and travel arrows), then the centered ember panel
 * (headline, audit pill, small print — the cta-banner shape, fed by the
 * footer fields), then the imprint row. Socials come from `socialLinks`
 * (shared MDI resolver) with the contact email appended unless the CMS list
 * already holds a `mailto:` entry.
 */
export function SiteFooter({
  footer,
  data,
  classes,
  className,
  id,
}: {
  footer?: LayoutContent;
  data?: LayoutContent;
} & Partial<DataProps<LayoutContent, 'panel' | 'intro' | 'grid' | 'card' | 'band'>>) {
  const content = data ?? footer;
  const chrome = useChrome();
  const brand = content?.brand ?? 'analytt';
  const emphasis = content?.brandEmphasis ?? 'digital';
  const socialLinks = content?.socialLinks ?? [];
  // The signal list: the editors' links plus the direct line (email, phone)
  // appended from the contact fields, so the rail stays complete even where
  // the CMS list is short. `tel:` keeps its content phone label.
  const socials = [...socialLinks];
  if (content?.contactEmail && !socials.some((s) => s.href.startsWith('mailto:'))) {
    socials.push({ label: content.contactEmail, href: `mailto:${content.contactEmail}`, icon: 'mail' });
  }
  const phone = socials.find((s) => s.href.startsWith('tel:'));
  // The direct line under the ask: email first, phone after the location
  // note — both already content-layer fields, no new strings.
  const contactHref = content?.contactEmail ? `mailto:${content.contactEmail}` : phone?.href;
  const contactLabel = content?.contactEmail ?? phone?.label;

  return (
    <footer id={id ?? 'contact'} className={`relative overflow-hidden bg-paper py-24 md:py-32 ${className ?? ''}`}>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <GsapReveal>
          {/* The closing card — the Work shape: intro left, index right. */}
          <div
            className={[
              'rounded-[2rem] bg-paper-50 px-6 py-12 shadow-[0_40px_100px_-40px_rgb(var(--color-primary-600)/0.35)] ring-1 ring-ink-950/[0.08] md:p-14',
              classes?.panel,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={`grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14 ${classes?.intro ?? ''}`}>
            <div>
              <div data-rise>
                <p className="font-mono text-[10.5px] capitalize tracking-[0.16em] text-primary-600">
                  {content?.footnote ?? 'A measurement-first agency, by design.'}
                </p>
                <InViewTitle
                  text={(content?.footerHeadline ?? 'Ready to see exactly where your growth is hiding?').replace(/\n/g, ' ')}
                  variant="blur"
                  as="h2"
                  className="title mt-4 max-w-[16ch] text-[clamp(2rem,3.6vw,2.9rem)] text-ink-950"
                />
              </div>
              {contactHref || content?.contactNote ? (
                <p data-rise="1" className="mt-5 max-w-[38ch] text-sm leading-relaxed text-ink-500">
                  {contactHref ? (
                    <a href={contactHref} className="font-medium text-ink-950 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-accent-600">
                      {contactLabel}
                    </a>
                  ) : null}
                  {contactHref && content?.contactNote ? ' · ' : null}
                  {content?.contactNote ?? null}
                </p>
              ) : null}
              {content?.tagline ? (
                <p data-rise="1" className="mt-4 max-w-[38ch] text-sm leading-relaxed text-ink-500">
                  {content.tagline}
                </p>
              ) : null}
              <p data-rise="2" className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={content?.footerCtaHref || '#'}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-paper-50 transition-colors duration-200 hover:bg-primary-700"
                >
                  {content?.footerCta ?? 'Start with a free audit'}
                  <MdiIcon name="arrowRight" size={0.8} />
                </a>
                <a href="#main" className="text-sm font-medium text-ink-500 underline decoration-ink-950/20 underline-offset-4 transition-colors hover:text-accent-600">
                  {chrome.backToTop}
                </a>
              </p>
            </div>
            {/* The index — CMS link columns beside the signal list, Work's
                case-grid rhythm: tinted card beside white card. */}
            <div className={['grid gap-6 sm:grid-cols-2', classes?.grid].filter(Boolean).join(' ')}>
            <div className={['grid content-start gap-6', classes?.card].filter(Boolean).join(' ')}>
              {content?.footerColumns?.map((column) => (
                <nav key={column.title} aria-label={column.title} className="rounded-3xl bg-primary-100 p-7">
                  <p className="font-mono text-[10.5px] capitalize tracking-[0.16em] text-primary-600">
                    {column.title}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className="text-[14.5px] font-medium text-ink-950 underline decoration-ink-950/15 underline-offset-4 transition-colors hover:text-accent-600">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

          {socials.length ? (
            <nav aria-label={content?.socialTitle ?? 'Follow the signal'} className="rounded-3xl bg-paper-50 p-7 shadow-[0_24px_60px_-30px_rgb(var(--color-primary-600)/0.35)] ring-1 ring-ink-950/[0.08]">
              <p className="font-mono text-[10.5px] capitalize tracking-[0.16em] text-primary-600">
                {content?.socialTitle ?? 'Follow the signal'}
              </p>
              <ul className="mt-4">
                {socials.map((link, i) => {
                  const external = /^(https?:|mailto:|tel:)/.test(link.href);
                  return (
                    <li key={link.label} className={i > 0 ? 'border-t border-ink-950/10' : ''}>
                      <a
                        href={link.href}
                        title={link.label}
                        aria-label={link.label}
                        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="group flex items-center gap-3 py-2.5 text-ink-950 transition-colors duration-200 hover:text-accent-600"
                      >
                        <MdiIcon name={link.icon || link.label.toLowerCase()} size={0.85} title={link.label} />
                        <span className="flex-1 text-[14.5px] font-medium">{link.label}</span>
                        <MdiIcon
                          name="arrowTopRight"
                          size={0.7}
                          className="text-ink-300 transition-all duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent-500"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
            </div>
          </div>
          </div>
        </GsapReveal>

        {/* The one ember panel — the cta-banner shape, fed by footer fields. */}
        {/* <GsapReveal>
          <div
            className={[
              'relative mt-6 overflow-hidden rounded-[2.5rem] bg-accent-500 px-6 py-16 text-center shadow-[0_40px_100px_-40px_rgb(var(--color-accent-600)/0.6)] md:py-20',
              classes?.band,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_100%_at_50%_115%,rgb(0_0_0/0.25),transparent_70%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full ring-[28px] ring-paper-50/15"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full ring-[36px] ring-ink-950/10"
            />
            <div data-rise className="relative mx-auto max-w-[28ch]">
              <p className="font-display text-[clamp(2.2rem,4.6vw,3.4rem)] font-bold leading-[1.05] tracking-tight text-paper-50">
                {content?.footerHeadline ?? 'Ready to see exactly where your growth is hiding?'}
              </p>
            </div>
            <div data-rise="2" className="relative mt-9 flex flex-col items-center gap-4">
              <a
                href={content?.footerCtaHref || '#'}
                className="inline-flex items-center gap-2.5 rounded-full bg-paper-50 px-8 py-4 text-base font-semibold text-ink-950 shadow-[0_14px_36px_-14px_rgb(0_0_0/0.5)] transition hover:scale-[1.02] hover:bg-paper-100 active:scale-[0.98]"
              >
                {content?.footerCta ?? 'Start with a free audit'}
                <MdiIcon name="arrowRight" size={0.85} />
              </a>
              {phone ? (
                <a href={phone.href} className="font-mono text-[10px] capitalize tracking-[0.14em] text-paper-50/70 underline underline-offset-4 hover:text-paper-50">
                  {phone.label === phone.href ? phone.href : `${phone.label}: ${phone.href.replace('tel:', '')}`}
                </a>
              ) : null}
            </div>
          </div>
        </GsapReveal> */}

        {/* The imprint — brand left, facts right. */}
        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Image
            src="/img/logo-alt.svg"
            alt={`${brand} ${emphasis}`}
            width={176}
            height={44}
            className="h-7 w-auto"
          />
          <p className="font-mono text-[10.5px] capitalize tracking-[0.16em] text-ink-500">
            {content?.legal}
            {content?.legal && content?.contactNote ? ' · ' : null}
            {content?.contactNote} · {chrome.imprint}
          </p>
        </div>
      </div>
    </footer>
  );
}
