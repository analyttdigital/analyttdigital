/* ------------------------------ locale -------------------------------- */

export type Locale = 'en' | 'sw';

export const locales: Locale[] = ['en', 'sw'];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Resolve the effective locale from a pages-router params object. */
export function localeFromParams(params?: { locale?: string; slug?: string } | string[]): Locale {
  const raw = Array.isArray(params) ? params[0] : params?.locale;
  return isLocale(raw) ? raw : defaultLocale;
}

/* --------------------------- shared chrome ---------------------------- */

export type NavLink = { label: string; href: string };

export type FooterColumn = { title: string; links: NavLink[] };

export type LayoutContent = {
  brand: string;
  brandEmphasis: string;
  navLinks: NavLink[];
  navCta: string;
  navCtaHref: string;
  footerHeadline: string;
  footerCta: string;
  footerCtaHref: string;
  tagline: string;
  footnote: string;
  footerColumns: FooterColumn[];
  contactEmail: string;
  contactNote: string;
  legal: string;
};

/* ----------------------------- sections ------------------------------- */

export type HeroSection = {
  eyebrow: string;
  headline: string;
  sub: string;
  cta: string;
  ctaHref: string;
  marquee: string[];
  /** 3D dive chrome — all optional so legacy CMS entries keep rendering. */
  scrollHint?: string;
  dashboardTitle?: string;
  dashboardMetric?: string;
  statA_label?: string;
  statA_value?: string;
  statA_delta?: string;
  statB_label?: string;
  statB_value?: string;
};

export type ProblemSection = {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  closing: string;
  panelTitle?: string;
  panelAlert?: string;
  panelChips?: { label: string; value: string }[];
};

export type BeliefPoint = { title: string; body: string };

export type BeliefSection = {
  eyebrow: string;
  headline: string;
  points: BeliefPoint[];
  stripLabel?: string;
};

export type ProcessStep = { title: string; body: string; depth?: string };

export type ProcessSection = {
  eyebrow: string;
  chapterTitle: string;
  steps: ProcessStep[];
};

export type Capability = { tag: string; title: string; body: string; depth?: string };

export type CapabilitiesSection = {
  eyebrow: string;
  headline: string;
  items: Capability[];
};

export type WorkCase = {
  client: string;
  industry: string;
  headline: string;
  body: string;
  metric: string;
  metricLabel: string;
  depth?: string;
};

export type WorkSection = {
  eyebrow: string;
  headline: string;
  cases: WorkCase[];
};

export type Stat = { value: string; label: string };

export type StatsSection = {
  eyebrow: string;
  headline: string;
  body: string;
  stats: Stat[];
};

export type IndustriesSection = {
  eyebrow: string;
  headline: string;
  body: string;
  items: string[];
  hint?: string;
};

export type InsightArticle = { index: string; title: string; description: string; href: string };

export type InsightsSection = {
  eyebrow: string;
  headline: string;
  articles: InsightArticle[];
};

export type CtaSection = {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  ctaHref: string;
  note: string;
  portalLabel?: string;
};

/* ------------------------- section union ------------------------------ */

export type Section =
  | ({ type: 'hero' } & HeroSection)
  | ({ type: 'problem' } & ProblemSection)
  | ({ type: 'belief' } & BeliefSection)
  | ({ type: 'process' } & ProcessSection)
  | ({ type: 'capabilities' } & CapabilitiesSection)
  | ({ type: 'work' } & WorkSection)
  | ({ type: 'stats' } & StatsSection)
  | ({ type: 'industries' } & IndustriesSection)
  | ({ type: 'insights' } & InsightsSection)
  | ({ type: 'cta' } & CtaSection);

export type SectionType = Section['type'];

/* --------------------------- page document ---------------------------- */

export type PageDoc = {
  title: string;
  description: string;
  sections: Section[];
};

/* ------------------------------ bundle -------------------------------- */

/** Everything a page render needs: chrome + document. */
export type PageBundle = {
  layout: LayoutContent;
  page: PageDoc;
};
