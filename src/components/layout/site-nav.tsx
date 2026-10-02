import { useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { LayoutContent } from '@/lib/content/types';

/**
 * Floating fluid nav — screenshot 2 chrome: transparent over the hero,
 * floating pill glass bar past it. Dark navy logo chip, sans links,
 * dark navy pill CTA, hamburger button on the right.
 */
export function SiteNav({ nav }: { nav?: LayoutContent }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  const brand = nav?.brand ?? 'analytt';
  const emphasis = nav?.brandEmphasis ?? 'digital';
  const links = nav?.navLinks ?? [];
  const cta = nav?.navCta ?? 'Get a free audit';
  const ctaHref = nav?.navCtaHref ?? '#contact';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between gap-4 py-3 pl-4 pr-3 transition-all duration-500 ease-out md:pl-6 md:pr-4 ${
          scrolled ? 'glass-panel' : 'border border-transparent bg-transparent'
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 font-display text-[13px] font-bold text-paper shadow-button"
          >
            {brand.slice(0, 1)}
          </span>
          <span className="font-display text-[19px] font-semibold tracking-tight text-ink-950">
            {brand}
            <span className="text-accent-500">{emphasis}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-800 transition-colors hover:text-accent-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={ctaHref} className="btn-pill btn-pill--ink hidden px-5 py-2.5 text-[13px] sm:inline-flex">
            {cta}
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/10 bg-paper/70 text-ink-900 backdrop-blur transition-colors hover:bg-paper"
          >
            <MdiIcon name={menuOpen ? 'close' : 'menu'} size={0.8} />
          </button>
        </div>
      </div>

      {/* mobile menu sheet */}
      {menuOpen ? (
        <div className="glass-panel mx-auto mt-2 max-w-[1320px] p-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-[15px] font-medium text-ink-900 transition-colors hover:bg-mist-100"
              >
                {link.label}
              </a>
            ))}
            <a href={ctaHref} className="btn-pill btn-pill--ink mt-2" onClick={() => setMenuOpen(false)}>
              {cta}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
