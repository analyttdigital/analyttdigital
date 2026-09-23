import type { ReactNode } from 'react';

import { ScrollProgress } from '@/components/layout/scroll-progress';
import { ScrollCanvas } from '@/components/layout/scroll-canvas';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteNav } from '@/components/layout/site-nav';
import { SmoothScroll } from '@/components/smooth-scroll';
import type { LayoutContent } from '@/lib/content/types';

const CHAPTERS = [
  { id: 'problem', label: 'The Problem' },
  { id: 'process', label: 'Process' },
  { id: 'capabilities', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'insights', label: 'Insights' },
  { id: 'contact', label: 'Contact' },
];

/** Shared site chrome: smooth scroll, nav, progress rail, footer. */
export function SiteLayout({
  children,
  layout,
}: {
  children: ReactNode;
  layout?: LayoutContent;
}) {
  return (
    <>
      <ScrollCanvas />
      <SmoothScroll />
      <SiteNav nav={layout} />
      <ScrollProgress chapters={CHAPTERS} />
      <main>{children}</main>
      <SiteFooter footer={layout} />
    </>
  );
}
