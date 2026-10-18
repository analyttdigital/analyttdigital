import { createContext, useContext, type ReactNode } from 'react';

import { defaultLocale, type Locale } from '@/lib/content/types';

/**
 * Instrument chrome — the interface's own words.
 *
 * Marketing copy belongs in the content layer (`defaults.ts`, per locale, CMS
 * editable). The handful of words that belong to the *interface* rather than to
 * the agency — what the menu button opens, what the trace's state is, the
 * honest note under a demonstration, the note on a media slot awaiting an
 * image — live here so a future locale slots back in as a peer. Nothing in
 * this file is a claim about the product.
 */
export type Chrome = {
  skip: string;
  menu: string;
  close: string;
  mediaSlot: string;
  channels: string;
  signal: string;
  trackingLive: string;
  illustration: string;
  everyHundred: string;
  attributed: string;
  workNote: string;
  workPrev: string;
  workNext: string;
  workDrag: string;
  inPreparation: string;
  imprint: string;
  backToTop: string;
};

const en: Chrome = {
  skip: 'Skip to content',
  menu: 'Menu',
  close: 'Close',
  mediaSlot: 'Image slot — awaiting artwork',
  channels: 'Channels we run',
  signal: 'Signal · conversions',
  trackingLive: 'Tracking live',
  illustration: 'Illustration — an illustrative account, not a client result.',
  everyHundred: 'Every 100 shillings of spend',
  attributed: 'Attributed',
  workNote: 'Figures are real; client names are withheld pending publication permission.',
  workPrev: 'Previous case',
  workNext: 'Next case',
  workDrag: 'Drag or use the keys',
  inPreparation: 'In preparation',
  imprint: 'Measured in Nairobi. Serving East Africa.',
  backToTop: 'Back to top',
};

const strings: Record<Locale, Chrome> = { en };

const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** The active locale, for components that need it outside the content layer. */
export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * The interface's own labels in the active locale. Falls back to the default
 * locale so pages rendered without content props (the 404 route) still get
 * chrome instead of crashing.
 */
export function useChrome(): Chrome {
  const locale = useLocale();
  return strings[locale] ?? strings[defaultLocale];
}