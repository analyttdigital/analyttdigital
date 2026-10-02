import { PrinterMark } from '@/components/graphics/printer-mark';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { LayoutContent } from '@/lib/content/types';

/**
 * Footer — the colophon.
 *
 * A printed sheet ends with its imprint, not a dark panel: a heavy rule, the
 * closing call, then the colophon set in small caps with the sheet's own
 * metadata. Nothing here is rounded and nothing glows; the mark on the left
 * is the press's registration mark, the same one the masthead carries.
 */
export function SiteFooter({ footer }: { footer?: LayoutContent }) {
  const chrome = useChrome();
  const brand = footer?.brand ?? 'analytt';
  const emphasis = footer?.brandEmphasis ?? 'digital';

  return (
    <footer
      id="contact"
      data-sheet-block=""
      data-sheet-head={footer?.tagline}
      className="stock relative px-4 pb-20 pt-14 md:px-6 md:pb-24 md:pt-20"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <Reveal>
          <div className="grid items-end gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <h2 className="sheet-title max-w-[22ch] text-[clamp(1.8rem,4vw,2.9rem)] text-ink-950">
              {footer?.footerHeadline ?? 'Ready to see exactly where your growth is hiding?'}
            </h2>
            <a href={footer?.footerCtaHref ?? '#contact'} className="btn-sheet btn-sheet--spot">
              {footer?.footerCta ?? 'Start with a free audit'} <MdiIcon name="arrowTopRight" size={0.6} />
            </a>
          </div>
        </Reveal>

        <div aria-hidden className="mt-12 h-0.5 w-full bg-ink-950/85" />

        <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1.3fr)_repeat(2,minmax(0,0.7fr))]">
          <div>
            <p className="flex items-center gap-3 text-ink-950">
              <PrinterMark className="h-7 w-7" />
              <span className="w-wide text-[19px] font-extrabold tracking-[-0.03em]">
                {brand}
                <span className="text-accent-600">{emphasis}</span>
              </span>
            </p>
            <p className="body-copy mt-5 max-w-[38ch] text-[15px]">{footer?.tagline}</p>
            <p className="w-narrow mt-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              {footer?.footnote}
            </p>
          </div>

          {footer?.footerColumns?.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="sheet-head">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="link-sheet text-[14.5px]">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* the imprint line */}
        <div className="mt-14 flex flex-col gap-2 border-t border-ink-950/12 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="w-narrow text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            {footer?.legal}
          </p>
          <p className="w-narrow text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            {footer?.contactNote} · {chrome.imprint}
          </p>
        </div>
      </div>
    </footer>
  );
}
