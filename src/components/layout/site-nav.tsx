'use client';

import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Action } from '@/components/layout/action';
import { useChrome } from '@/lib/content/chrome';
import type { LayoutContent } from '@/lib/content/types';

/**
 * The header: an instrument rail, not a floating nav.
 *
 * Wordmark left, the section links recessed into a panel dead centre, the
 * audit action and its square key at the right. Over the hero the rail is
 * transparent so the resolve band resolves behind it; once the reader is into
 * the page it becomes a solid deep strip with a hairline under it, which is
 * the only chrome that ever gains a background.
 *
 * Below `lg` the rail collapses to wordmark plus a four-square mark — the
 * pixel language, at the size it was invented — and the links open as a full
 * screen sheet over the deep band, carrying the audit action with them.
 */
export function SiteNav({ nav }: { nav?: LayoutContent }) {
  const chrome = useChrome();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const brand = nav?.brand ?? 'analytt';
  const emphasis = nav?.brandEmphasis ?? 'digital';
  const links = nav?.navLinks ?? [];
  const cta = nav?.navCta ?? 'Get a free audit';
  const ctaHref = nav?.navCtaHref ?? '/#contact';

  /* The rail's scrolled identity switches on once the reader is half a
   * viewport into the page — past the hero's opening beat. */
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > window.innerHeight ));

  // The sheet owns the viewport while it is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="label label--bright sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[60] focus:bg-primary-950 focus:px-4 focus:py-3"
      >
        {chrome.skip}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled && !open ? 'bg-primary-950/92 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1360px] items-center gap-6 px-5 md:px-8">
          <Wordmark brand={brand} emphasis={emphasis} scrolled={scrolled && !open} />

          {/* The recessed link panel. */}
          <nav aria-label="Sections" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-[13px] font-medium transition-colors duration-200 hover:underline hover:decoration-accent-500 hover:decoration-2 hover:underline-offset-8 ${
                      scrolled && !open
                        ? 'text-accent-600 hover:text-primary-50'
                        : 'text-ink-700 hover:text-ink-950'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {!open ? (
              <a
                href={ctaHref}
                className="hidden whitespace-nowrap rounded-full bg-accent-500 px-5 py-2.5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-accent-600 sm:inline-flex"
              >
                {cta}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? chrome.close : chrome.menu}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`grid h-11 w-11 place-items-center border transition-colors duration-200 hover:border-accent-500 hover:text-accent-500 lg:hidden ${
                scrolled && !open
                  ? 'border-primary-50/22 text-primary-100'
                  : 'border-ink-950/20 text-ink-800'
              }`}
            >
              {open ? <CloseGlyph /> : <GridGlyph />}
            </button>
          </div>
        </div>
        <div aria-hidden className="h-px w-full bg-primary-50/12">
          {/* The route covered so far, drawn in the colour that means live. */}
          <motion.div
            className="h-full origin-left bg-accent-500"
            style={{ scaleX: progress, opacity: scrolled && !open ? 1 : 0 }}
            transition={{ opacity: { duration: 0.3 } }}
          />
        </div>
      </header>

      {open ? (
        <div
          id="site-menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-primary-950 pt-[72px] lg:hidden"
        >
          <nav aria-label="Sections" className="px-5 pt-4">
            <ul>
              {links.map((link) => (
                <li key={link.label} className="border-t border-primary-50/12">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="display block py-3 text-[clamp(2.1rem,9vw,3rem)] text-primary-50 transition-colors duration-200 hover:text-accent-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-5 pb-10 pt-8">
            <Action
              href={ctaHref}
              label={cta}
              variant="ember"
              className="w-full"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="grid gap-8 border-t border-primary-50/12 px-5 py-8 sm:grid-cols-2">
            {nav?.footerColumns?.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="label">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="link text-[15px] text-primary-100">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Wordmark({ brand, emphasis, scrolled }: { brand: string; emphasis: string; scrolled: boolean }) {
  /* Both marks ride stacked at identical size and crossfade, so the swap
   * never shifts layout and the light mark is already loaded on arrival. */
  return (
    <Link
      href="/"
      className="relative flex shrink-0 items-center"
      aria-label={`${brand} ${emphasis}`}
    >
      <Image
        src="/img/logo-alt.svg"
        alt={`${brand} ${emphasis}`}
        width={160}
        height={40}
        priority={true}
        className={`h-7 w-auto transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={scrolled}
      />
      <Image
        src="/img/logo-alt-light.svg"
        alt=""
        width={160}
        height={40}
        priority={true}
        className={`absolute inset-0 h-7 w-auto transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!scrolled}
      />
    </Link>
  );
}

/** Four squares — the menu mark, drawn at the world's own resolution. */
function GridGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" fill="currentColor">
      <rect x="0" y="0" width="8" height="8" />
      <rect x="12" y="0" width="8" height="8" />
      <rect x="0" y="12" width="8" height="8" />
      <rect x="12" y="12" width="8" height="8" />
    </svg>
  );
}

function CloseGlyph() {
  // Two square-ended bars, turned 45° — a cross that reads as a close mark
  // while staying in the world's own stroke.
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" fill="currentColor">
      <g transform="rotate(45 10 10)">
        <rect x="2" y="8.5" width="16" height="3" />
        <rect x="8.5" y="2" width="3" height="16" />
      </g>
    </svg>
  );
}