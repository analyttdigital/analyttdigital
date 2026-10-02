import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import { SurveyField } from '@/components/three/survey-field';
import { TransectReadout } from '@/components/layout/transect-readout';
import { SmoothScroll } from '@/components/smooth-scroll';
import type { LayoutContent } from '@/lib/content/types';

/**
 * Shared chrome: the surveyed background, the masthead that becomes a
 * running head, the transect readout, and the colophon.
 *
 * The background field is mounted once, fixed and behind everything; every
 * section sits directly on the stock so the survey reads continuously through
 * the whole sheet. Both are client-only and self-disabling (reduced motion,
 * lost context), so the layout is complete without them.
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
      <SmoothScroll />
      <SurveyField />
      <SiteNav nav={layout} />
      <main className="relative z-10">{children}</main>
      <SiteFooter footer={layout} />
      <TransectReadout />
    </>
  );
}
