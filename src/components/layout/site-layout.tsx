import type { ReactNode } from 'react';

import { ScrollProgress } from '@/components/layout/scroll-progress';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import { SmoothScroll } from '@/components/smooth-scroll';
import type { LayoutContent } from '@/lib/content/types';

/** Shared site chrome: smooth scroll, nav, progress hairline, footer. */
export function SiteLayout({
  children,
  layout,
}: {
  children: ReactNode;
  layout?: LayoutContent;
}) {
  return (
    <>
      <SmoothScroll />
      <SiteNav nav={layout} />
      <ScrollProgress />
      <main>{children}</main>
      <SiteFooter footer={layout} />
    </>
  );
}
