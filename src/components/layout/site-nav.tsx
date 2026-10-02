'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { PrinterMark } from '@/components/graphics/printer-mark';
import { useChrome } from '@/lib/content/chrome';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { LayoutContent } from '@/lib/content/types';

/**
 * Masthead → running head.
 *
 * A printed sheet carries a masthead on its first page and a running head on
 * every page after it. This bar does both: full-bleed and transparent over
 * the masthead of the hero, condensing to a ruled running head once the
 * reader is into the sheet — where the centre slot reports the block
 * currently under survey, and the nav steps down to printed column heads.
 */
export function SiteNav({ nav }: { nav?: LayoutContent }) {
  const chrome = useChrome();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState(nav?.tagline ?? '');
  const [menuOpen, setMenuOpen] = useState(false);
  const blocks = useRef<{ top: number; head: string }[]>([]);

  const brand = nav?.brand ?? 'analytt';
  const emphasis = nav?.brandEmphasis ?? 'digital';
  const links = nav?.navLinks ?? [];
  const cta = nav?.navCta ?? 'Get a free audit';
  const ctaHref = nav?.navCtaHref ?? '#contact';

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40);
    const probe = y + 160;
    let head = '';
    for (const block of blocks.current) {
      if (block.top <= probe) head = block.head;
      else break;
    }
    setCurrent(head);
  });

  // Cache each block's position once, and again on resize: the running head
  // must not read layout on every frame.
  useEffect(() => {
    const measure = () => {
      blocks.current = Array.from(document.querySelectorAll<HTMLElement>('[data-sheet-block]'))
        .filter((el) => el.dataset.sheetHead)
        .map((el) => ({
          top: el.getBoundingClientRect().top + window.scrollY,
          head: el.dataset.sheetHead ?? '',
        }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ease-out ${
          scrolled
            ? 'border-b border-ink-950/12 bg-paper/90 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-[1320px] items-center gap-4 px-4 transition-all duration-500 ease-out md:px-6 ${
            scrolled ? 'h-14' : 'h-20'
          }`}
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-ink-950"
            aria-label={`${brand} ${emphasis}`}
          >
            <PrinterMark
              className={`transition-all duration-500 ease-out ${scrolled ? 'h-5 w-5' : 'h-7 w-7'}`}
            />
            <span
              className={`w-wide font-extrabold tracking-[-0.03em] transition-all duration-500 ease-out ${
                scrolled ? 'text-[17px]' : 'text-[21px]'
              }`}
            >
              {brand}
              <span className="text-accent-600">{emphasis}</span>
            </span>
          </Link>

          {/* Running head: the block currently under survey. */}
          <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
            <span className={`rule ${scrolled ? '' : 'opacity-0'} h-px flex-1 bg-ink-950/15`} />
            <p
              className={`truncate font-narrow text-[11px] font-bold uppercase tracking-[0.18em] transition-opacity duration-500 ${
                scrolled && current ? 'text-ink-700 opacity-100' : 'opacity-0'
              }`}
            >
              {current}
            </p>
            <span className={`rule ${scrolled ? '' : 'opacity-0'} h-px flex-1 bg-ink-950/15`} />
          </div>

          <nav className="ml-auto hidden items-center gap-6 xl:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`w-narrow font-semibold uppercase tracking-[0.14em] text-ink-800 transition-colors duration-200 hover:text-accent-600 ${
                  scrolled ? 'text-[11px]' : 'text-[12px]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <a
              href={ctaHref}
              className={`btn-sheet btn-sheet--spot transition-all duration-500 ease-out ${
                scrolled ? 'px-4 py-2 text-[12px]' : 'px-5 py-2.5 text-[13px]'
              }`}
            >
              {cta}
              <MdiIcon name="arrowTopRight" size={0.6} />
            </a>
            <button
              type="button"
              aria-label={chrome.contents}
              aria-expanded={menuOpen}
              aria-controls="sheet-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="press-mark flex h-9 w-9 items-center justify-center rounded-[2px] text-ink-900 transition-colors hover:bg-ink-950/5"
            >
              <MdiIcon name={menuOpen ? 'close' : 'menu'} size={0.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Contents sheet */}
      {menuOpen ? (
        <div id="sheet-menu" className="px-4 pt-2 md:px-6 xl:hidden">
          <div className="plate mx-auto max-w-[1320px] rounded-[2px] p-2">
            <nav className="flex flex-col">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-ink-950/8 px-4 py-3.5 text-[15px] font-semibold text-ink-900 transition-colors last:border-0 hover:bg-ink-950/4 hover:text-accent-600"
                >
                  {link.label}
                  <MdiIcon name="arrowTopRight" size={0.6} />
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
