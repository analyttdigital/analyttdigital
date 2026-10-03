import Image from 'next/image';

import { Action } from '@/components/layout/action';
import { Band, BandHead } from '@/components/layout/band';
import { Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { LayoutContent } from '@/lib/content/types';

/**
 * The footer — where the path terminates.
 *
 * The closing statement and the audit action sit on the deep band, then the
 * rail: wordmark, tagline, the two link columns, and an imprint line that
 * carries the operating facts rather than a slogan. Nothing here glows and
 * nothing is boxed. The net runs one last time, wired from the closing
 * statement through the columns, so the mesh closes with the page.
 */
/** Closing statement and its action on the top row, then the brand block
 *  and the two link columns, then the imprint rule. */
const NODES = [
  { x: 0.0, y: 0.28 },
  { x: 0.82, y: 0.3 },
  { x: 0.0, y: 0.68 },
  { x: 0.56, y: 0.66 },
  { x: 0.78, y: 0.66 },
  { x: 0.0, y: 0.91 },
];

export function SiteFooter({ footer }: { footer?: LayoutContent }) {
  const chrome = useChrome();
  const brand = footer?.brand ?? 'analytt';
  const emphasis = footer?.brandEmphasis ?? 'digital';

  return (
    <footer id="contact" className="relative">
      <Band ground="deep" mesh={{ seed: 71, count: 5, depth: 26, opacity: 0.46, anchors: NODES }}>
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <h2 className="display max-w-[20ch] text-[clamp(2.1rem,5vw,3.7rem)] text-primary-50">
              {footer?.footerHeadline ?? 'Ready to see exactly where your growth is hiding?'}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Action
              href={footer?.footerCtaHref ?? '/#contact'}
              label={footer?.footerCta ?? 'Start with a free audit'}
              variant="ember"
            />
          </Reveal>
        </div>

        <div aria-hidden className="hairline hairline--strong mt-16" />

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1.25fr)_repeat(2,minmax(0,0.75fr))]">
          <div>
            <p className="flex items-center">
              <Image
                src="/img/logo-alt.svg"
                alt={`${brand} ${emphasis}`}
                width={176}
                height={44}
                className="h-8 w-auto"
              />
            </p>
            <p className="body mt-5 max-w-[42ch] text-[15px]">{footer?.tagline}</p>
            <p className="label mt-5">{footer?.footnote}</p>
          </div>

          {footer?.footerColumns?.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <BandHead>{column.title}</BandHead>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="link text-[14.5px] text-primary-100">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* the imprint */}
        <div className="mt-14 flex flex-col gap-2 border-t border-primary-50/12 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="label">{footer?.legal}</p>
          <p className="label">
            {footer?.contactNote} · {chrome.imprint}
          </p>
        </div>
      </Band>
    </footer>
  );
}