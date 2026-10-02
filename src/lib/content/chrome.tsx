import { createContext, useContext, type ReactNode } from 'react';

import { defaultLocale, type Locale } from '@/lib/content/types';

/**
 * Instrument chrome — the sheet's own labels.
 *
 * Marketing copy belongs in the content layer (`defaults.ts`, per locale, CMS
 * editable). The handful of words that belong to the *instrument* rather than
 * to the agency — the word "Sheet", the trace's state, the honest caption
 * under a demonstration — are interface strings, and they live here so both
 * locales ship as peers. Nothing in this file is a claim about the product.
 */
export type Chrome = {
  sheet: string;
  contents: string;
  transect: string;
  station: string;
  bearing: string;
  surveyed: string;
  signal: string;
  trackingLive: string;
  illustration: string;
  everyHundred: string;
  workNote: string;
  inPreparation: string;
  imposition: [string, string];
  imprint: string;
};

const en: Chrome = {
  sheet: 'Sheet',
  contents: 'Contents',
  transect: 'Transect',
  station: 'Stn',
  bearing: 'Brg',
  surveyed: 'Surveyed',
  signal: 'Signal · conversions',
  trackingLive: 'Tracking live',
  illustration: 'Illustration — an illustrative account, not a client result.',
  everyHundred: 'Every 100 shillings',
  workNote: 'Figures are real; client names are withheld pending publication permission.',
  inPreparation: 'In preparation',
  imposition: ['Table', 'Plates'],
  imprint: 'Set in Archivo. Surveyed in Nairobi.',
};

const sw: Chrome = {
  sheet: 'Ukurasa',
  contents: 'Yaliomo',
  transect: 'Mkato',
  station: 'Stn',
  bearing: 'Mwelekeo',
  surveyed: 'Imepimwa',
  signal: 'Saili · mabadiliko',
  trackingLive: 'Inafuatiliwa',
  illustration: 'Mchoro — mfano wa akaunti, si matokeo ya mteja.',
  everyHundred: 'Kila shilingi 100',
  workNote: 'Takwimu ni halisi; majina ya wateja yamefichwa hadi kibali.',
  inPreparation: 'Inaandikwa',
  imposition: ['Jedwali', 'Bango'],
  imprint: 'Imechapishwa kwa Archivo. Kilipimwa Nairobi.',
};

const strings: Record<Locale, Chrome> = { en, sw };

const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** The active locale, for components that need it outside the content layer. */
export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * The sheet's own labels in the active locale. Falls back to the default
 * locale so pages rendered without content props (the 404 route) still get
 * chrome instead of crashing.
 */
export function useChrome(): Chrome {
  const locale = useLocale();
  return strings[locale] ?? strings[defaultLocale];
}
