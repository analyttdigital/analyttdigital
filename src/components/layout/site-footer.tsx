import Image from 'next/image';

import { Action } from '@/components/layout/action';
import { Band, BandHead, DEEP, PAPER } from '@/components/layout/band';
import { Reveal } from '@/lib/motion/reveal';
import { useChrome } from '@/lib/content/chrome';
import type { LayoutContent } from '@/lib/content/types';

/**
 * The footer — where the path terminates.
 *
 * The page's last ground change is its one dissolve: the paper CTA resolves
 * into the deep band, and everything after it is terminus. The closing
 * statement and the audit action arrive first on the violet-ink, then the
 * rail — wordmark, tagline, the two link columns — between hairlines, with
 * an imprint line that carries the operating facts rather than a slogan.
 * The wordmark lands last as a faint outline one tone off the ground, like
 * a terminal node: the signal arrives, and the page stops.
 */
export function SiteFooter({ footer }: { footer?: LayoutContent }) {
  const chrome = useChrome();
  const brand = footer?.brand ?? 'analytt';
  const emphasis = footer?.brandEmphasis ?? 'digital';

  return (
    <footer id="contact" className="relative">
      <Band ground="deep" resolve={{ from: PAPER, to: DEEP }}>
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
            <Image
              src="/img/logo-alt-light.svg"
              alt={`${brand} ${emphasis}`}
              width={176}
              height={44}
              className="h-8 w-auto"
            />
            <p className="body mt-5 max-w-[42ch] text-[15px]">{footer?.tagline}</p>
            <p className="label mt-5 text-primary-400">{footer?.footnote}</p>
          </div>

          {footer?.footerColumns?.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <BandHead>{column.title}</BandHead>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="link text-[14.5px] text-primary-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div aria-hidden className="hairline mt-14" />

        {/* the imprint */}
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="label text-primary-400">{footer?.legal}</p>
          <p className="label text-primary-400">
            {footer?.contactNote} · {chrome.imprint}
          </p>
        </div>

        {/* the terminal node — the wordmark lands last, drawn as a faint
            outline one tone off the ground. Paths mirrored from
            public/img/logo-alt-light.svg, re-stroked from fill to stroke. */}
        <svg
          aria-hidden
          viewBox="0 0 319.64010125 79.705140625"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.8}
          strokeLinejoin="round"
          className="-mb-6 mt-16 block h-auto w-full select-none text-primary-700/40 md:-mb-10"
        >
          <path d="m314.42 57.09h-14.99v-13.64h14.99z" />
          <path d="m288.49 42.55h5.69v14.54h-11.31q-6.75 0-10.57-3.86-3.83-3.86-3.83-10.6v-13.42h-7.49v-4.12l20.16-21.52h3.6v13.05h9.22v12.59h-8.7v10.12q0 1.42 0.87 2.32 0.86 0.9 2.36 0.9z" />
          <path d="m253.18 42.55h5.69v14.54h-11.31q-6.75 0-10.57-3.86-3.83-3.86-3.83-10.6v-13.42h-7.49v-4.12l20.16-21.52h3.6v13.05h9.22v12.59h-8.7v10.12q0 1.42 0.87 2.32 0.86 0.9 2.36 0.9z" />
          <g>
            <path d="m203.34 36.55l6.14-19.93h18.22l-16.49 37.55q-4.65 10.49-9.86 14.54-5.21 4.05-14.13 4.05h-4.95v-13.79h3.75q3.97 0 5.88-1.17 1.92-1.16 3.12-4.23l-16.42-36.95h18.21z" />
            <path d="m175.52 57.09h-16.79v-55.09h16.79z" />
            <path d="m125.61 15.27q-9.45 0-15.29 5.96-5.85 5.95-5.85 15.62 0 9.75 5.85 15.75 5.84 5.99 15.29 5.99 6.75 0 11.84-3.97l1.35 2.47h12.89v-40.47h-12.59l-1.57 2.77q-5.1-4.12-11.92-4.12zm3.07 14.01q3.22 0 5.32 2.18 2.1 2.17 2.1 5.47 0 3.3-2.1 5.51-2.1 2.21-5.32 2.21-3.22 0-5.32-2.21-2.1-2.21-2.1-5.51 0-3.3 2.1-5.47 2.1-2.18 5.32-2.18z" />
            <path d="m83.33 15.12q7.34 0 11.95 4.76 4.61 4.76 4.61 12.4v24.81h-16.79v-22.71q0-2.55-1.01-3.93-1.01-1.39-2.88-1.39-2.18 0-3.41 1.54-1.24 1.53-1.24 4.23v22.26h-16.79v-40.47h12.07l1.42 3.29q4.5-4.79 12.07-4.79z" />
            <path d="m24.64 15.27q-9.45 0-15.3 5.96-5.84 5.95-5.84 15.62 0 9.75 5.84 15.75 5.85 5.99 15.3 5.99 6.74 0 11.84-3.97l1.35 2.47h12.89v-40.47h-12.59l-1.58 2.77q-5.09-4.12-11.91-4.12zm3.07 14.01q3.22 0 5.32 2.18 2.1 2.17 2.1 5.47 0 3.3-2.1 5.51-2.1 2.21-5.32 2.21-3.22 0-5.32-2.21-2.1-2.21-2.1-5.51 0-3.3 2.1-5.47 2.1-2.18 5.32-2.18z" />
          </g>
        </svg>
      </Band>
    </footer>
  );
}
