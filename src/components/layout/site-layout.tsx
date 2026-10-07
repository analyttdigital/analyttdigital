import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import type { LayoutContent } from '@/lib/content/types';

/**
 * Shared chrome: the instrument rail, the page, and the terminus.
 *
 * There is no page-wide background layer in this world. The grounds belong to
 * the bands that carry them, the trace network is drawn inside the bands that
 * want it, and the resolve between them belongs to whichever band changes — so
 * the layout is three pieces and nothing else.
 */
export function SiteLayout({
  children,
  layout,
}: {
  children: ReactNode;
  layout?: LayoutContent;
}) {
  return (
    <>
      <SiteNav nav={layout} />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <SiteFooter footer={layout} />
    </>
  );
}