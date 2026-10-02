import { MdiIcon } from '@/lib/icons/resolve-icon';
import { Reveal } from '@/lib/motion/reveal';
import type { LayoutContent } from '@/lib/content/types';

/**
 * Footer — screenshot closing language: dark navy rounded mega-panel with
 * violet blobs, white pill link chips, circular rotating badge brand mark.
 */
export function SiteFooter({ footer }: { footer?: LayoutContent }) {
  const brand = footer?.brand ?? 'analytt';
  const emphasis = footer?.brandEmphasis ?? 'digital';

  return (
    <footer id="contact" data-scene="contact" className="canvas relative px-4 pb-6 pt-16 md:px-6">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-8 py-14 shadow-lift md:px-14 md:py-20">
            <div aria-hidden className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl" />
            <div aria-hidden className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />

            <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-[40px]">
                {footer?.footerHeadline ?? 'Ready to see exactly where your growth is hiding?'}
              </h2>
              <a href={footer?.footerCtaHref ?? '#contact'} className="btn-pill btn-pill--accent shrink-0">
                {footer?.footerCta ?? 'Start with a free audit'} <MdiIcon name="arrowTopRight" size={0.65} />
              </a>
            </div>

            <div className="relative mt-14 grid gap-12 border-t border-dashed border-paper/15 pt-12 md:grid-cols-3">
              <div>
                <p className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 font-display text-[15px] font-bold text-paper shadow-button-accent"
                  >
                    {brand.slice(0, 1)}
                  </span>
                  <span className="font-display text-lg font-semibold tracking-tight text-paper">
                    {brand}
                    <span className="text-accent-400">{emphasis}</span>
                  </span>
                </p>
                <p className="mt-5 max-w-[260px] text-[15px] leading-relaxed text-paper/70">{footer?.tagline}</p>
                <p className="mt-4 text-[13px] text-paper/45">{footer?.footnote}</p>
              </div>

              {footer?.footerColumns?.map((column) => (
                <div key={column.title}>
                  <p className="inline-flex rounded-pill border border-paper/15 px-3.5 py-1.5 text-[12px] font-semibold text-paper/60">
                    {column.title}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-2 text-[15px] text-paper/80 transition-colors hover:text-accent-400"
                        >
                          <span className="h-3.5 w-3.5 rounded-full border border-dashed border-paper/25" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* rotating badge mark */}
            <div
              aria-hidden
              className="absolute bottom-10 right-10 hidden h-24 w-24 items-center justify-center rounded-full bg-paper text-ink-950 shadow-float lg:flex"
            >
              <svg viewBox="0 0 100 100" className="h-full w-full p-2 [animation:spin_14s_linear_infinite] motion-reduce:[animation:none]">
                <defs>
                  <path id="badge-circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                </defs>
                <text fontSize="10.5" fontWeight="700" letterSpacing="2.5" fill="currentColor">
                  <textPath href="#badge-circle">MEASURED · ATTRIBUTED · SCALED ·</textPath>
                </text>
                <circle cx="50" cy="50" r="5" className="fill-accent-500" />
              </svg>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-2 px-2 pt-8 md:flex-row md:items-center md:justify-between md:px-4">
          <p className="text-xs text-ink-500">{footer?.legal}</p>
          <p className="text-xs text-ink-500">{footer?.contactNote}</p>
        </div>
      </div>
    </footer>
  );
}
