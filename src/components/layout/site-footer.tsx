import { DitherWordmark } from '@/components/graphics/dither-wordmark';
import { Reveal } from '@/lib/motion/reveal';
import type { LayoutContent } from '@/lib/content/types';

/** Dark footer mirroring the reference: big CTA, columns, giant wordmark. */
export function SiteFooter({ footer }: { footer?: LayoutContent }) {
  return (
    <footer id="contact" className="relative overflow-hidden text-[#eceeee]">
      <div className="mx-auto max-w-[1320px] px-6 pb-10 pt-24 md:px-10 md:pt-32">
        <div className="flex flex-col gap-10 border-b hairline pb-16 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="display max-w-xl text-3xl md:text-[42px]">
              {footer?.footerHeadline ?? 'Ready to see exactly where your growth is hiding?'}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={footer?.footerCtaHref ?? '#contact'}
              className="depth-float inline-flex items-center gap-3 rounded bg-[#f4f4f4] px-6 py-4 font-sans text-[15px] font-semibold text-ink-950 transition-colors hover:bg-ember hover:text-white"
            >
              {footer?.footerCta ?? 'Start with a free audit'} <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-3">
          <Reveal>
            <p className="mono-label text-[#eceeee]/50">
              {footer?.brand ?? 'analytt'} {footer?.brandEmphasis ?? 'digital'}
            </p>
            <p className="prose-serif mt-5 max-w-[240px] text-[#eceeee]/80">{footer?.tagline}</p>
            <p className="mt-5 font-mono text-[12px] text-[#eceeee]/45">{footer?.footnote}</p>
          </Reveal>

          {footer?.footerColumns?.map((column) => (
            <Reveal key={column.title} delay={0.08}>
              <p className="mono-label text-[#eceeee]/50">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[15px] text-[#eceeee]/85 transition-colors hover:text-ember">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t hairline pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-monoSm text-[#eceeee]/40">{footer?.legal}</p>
          <p className="font-mono text-[11px] uppercase tracking-monoSm text-[#eceeee]/40">{footer?.contactNote}</p>
        </div>
      </div>

      {/* Oversized dithered wordmark */}
      <div className="pointer-events-none relative -mb-4 select-none px-2 md:-mb-8">
        <DitherWordmark text={footer?.brand ?? 'analytt'} />
      </div>
    </footer>
  );
}
