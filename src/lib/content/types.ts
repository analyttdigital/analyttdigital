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

/* ------------------------- icon + media refs -------------------------- */
/* Convention (M2, mirrors `iconField`/`imageField` in schemas.ts):
 * - `icon` is an MDI key from the shared map (see `mdi-icon.tsx`; formal
 *   resolver lands in M3). Absent/empty = section's positional default.
 * - `image` is a plain `{ src, alt }` ref; components resolve it through
 *   the shared media resolver (M3). Empty/absent `src` = no image.        */

export type ContentImage = { src: string; alt: string };

/* ----------------------------- sections ------------------------------- */

export type HeroPanelKind =
  | 'cpl'
  | 'leads'
  | 'revenue'
  | 'seo'
  | 'process'
  | 'code'
  | 'alert'
  | 'whatsapp'
  | 'simkar'
  | 'roas'
  | 'attribution'
  | 'audit'
  | 'ctr'
  | 'funnel'
  | 'partner';

export type HeroPanelStep = { label: string; state: 'done' | 'active' | 'todo' };

export type HeroPanelMetric = { value: string; label: string };

/** One proof-strip item under the hero copy. `ember` renders the value in
 *  the live colour; everything else stays field ink. */
export type HeroProof = { value: string; label: string; ember?: boolean };

/** One floating result card in the hero tunnel. All copy lives in the
 *  content layer (`defaults.ts`, editable in Keystatic) — the component only
 *  picks a layout by `kind` and reads these fields. Layout groups:
 *  bars (cpl/roas/ctr), metric (leads/revenue/attribution/funnel),
 *  progress (seo/audit), steps (process), code (code),
 *  notice (alert/whatsapp), dual (simkar), logo (partner). `iconTone`
 *  recolours the panel's icon (and its dot/tile) through three token steps —
 *  `default` keeps the layout's positional colour, per the shared icon
 *  convention. `logo`/`logoDark` carry a partner mark (`logoDark` shows on the
 *  dark variant, falling back to `logo`). */
export type HeroPanel = {
  kind: HeroPanelKind;
  title: string;
  subtitle?: string;
  value?: string;
  valueLabel?: string;
  footer?: string;
  delta?: string;
  icon?: string;
  iconTone?: 'default' | 'accent' | 'primary' | 'muted';
  logo?: ContentImage;
  logoDark?: ContentImage;
  tone?: 'default' | 'alert';
  bars?: number[];
  progress?: number;
  metrics?: HeroPanelMetric[];
  steps?: HeroPanelStep[];
  codeLines?: string[];
};

export type HeroPartner = { label: string; logo: ContentImage; logoDark?: ContentImage };

/** About-us bridge shown inside the hero portal flood. Owned by the hero
 *  content layer (editable in Keystatic) — `tag` renders as the band label,
 *  `title` as the portal headline, `description` as the lede. */
export type HeroBridge = { tag: string; title: string; description: string };

export type HeroSection = {
  eyebrow: string;
  headline: string;
  sub: string;
  cta: string;
  ctaHref: string;
  /** Partner marks rowed along the hero foot: a logo + a credential label. */
  marquee?: HeroPartner[];
  /** Light (paper stage) or dark (violet-ink stage). Defaults to light. */
  variant?: 'light' | 'dark';
  panels?: HeroPanel[];
  proof?: HeroProof[];
  /** 3D dive chrome — all optional so legacy CMS entries keep rendering. */
  scrollHint?: string;
  dashboardTitle?: string;
  dashboardMetric?: string;
  statA_label?: string;
  statA_value?: string;
  statA_delta?: string;
  statB_label?: string;
  statB_value?: string;
  /** About-us bridge for the portal flood. Absent = portal floods flat
   *  (legacy entries fall back to the Process section's words in the renderer). */
  bridge?: HeroBridge;
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

export type TerrainMetricKey = 'leads' | 'clicks' | 'cpl';

export type TerrainMetric = {
  key: TerrainMetricKey;
  label: string;
  title: string;
  peakLabel: string;
  dayLabel: string;
  noun: string;
  lessLabel: string;
  moreLabel: string;
  delta: number;
};

/** Copy + config for the reusable activity-terrain graphic. The hourly grids
 *  themselves are generated deterministically in code (seeded, documented as
 *  illustrative) — everything a reader sees is content-editable here. */
export type TerrainData = {
  title: string;
  caption: string;
  metricGroupLabel: string;
  viewGroupLabel: string;
  perspectiveLabel: string;
  topLabel: string;
  resetLabel: string;
  clearLabel: string;
  canvasLabel: string;
  hintTouch: string;
  hintDesktop: string;
  statsNote: string;
  avgNote: string;
  belowNote: string;
  betweenNote: string;
  tableCaption: string;
  days: string[];
  dayNames: string[];
  metrics: TerrainMetric[];
};

export type BeliefSection = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  lede: string;
  terrain: TerrainData;
};

export type ProcessBarTone = 'soft' | 'mid' | 'deep' | 'field' | 'ember';

export type ProcessFunnelRow = { label: string; width: number; tone: ProcessBarTone };

export type ProcessChannel = { label: string; pct: number; tone: ProcessBarTone };

/** Per-step visual spec — flat, mirroring the Keystatic object: `kind` picks
 *  the layout and only its fields are read. Widths/pcts are 0–100, raw values
 *  are scaled to the tallest bar. The pictures stay illustrative, exactly as
 *  the card's note says. */
export type ProcessVisual = {
  kind: 'funnel' | 'channels' | 'checklist' | 'weekly' | 'scale';
  title?: string;
  leakNote?: string;
  rows?: ProcessFunnelRow[];
  mixTitle?: string;
  channels?: ProcessChannel[];
  targetsTitle?: string;
  targets?: string[];
  items?: string[];
  doneNote?: string;
  doneTag?: string;
  values?: number[];
  winnerNote?: string;
  tags?: string[];
};

export type ProcessStep = {
  n: string;
  title: string;
  desc: string;
  chips: string[];
  visual: ProcessVisual;
};

export type ProcessSection = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  lede: string;
  chapterTitle?: string;
  cardTitle: string;
  cardSub: string;
  playLabel: string;
  pauseLabel: string;
  stepOfTemplate: string;
  illustrativeNote: string;
  /** Ms each step holds while autoplaying. */
  dwellMs: number;
  steps: ProcessStep[];
  closing: string;
  cta: string;
  ctaHref: string;
};

export type Capability = { tag: string; title: string; body: string; depth?: string; icon?: string };

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
  image?: ContentImage;
};

export type WorkSection = {
  eyebrow: string;
  headline: string;
  cases: WorkCase[];
};

export type Stat = { value: string; label: string; icon?: string };

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

/* ------------------------- component contract -------------------------
 * (M3) Every shared/reusable component accepts:
 * - `data`: its dynamic content, typed and defaulted from `defaults.ts`
 *   (text, `icon` name strings, `{ src, alt }` media refs, …).
 * - `classes`: optional slot overrides mapping child slot names to extra
 *   class strings, so parents can restyle nested shared components
 *   without prop-drilling one-off variants.
 * - Ordinary component props (`className`, `id`) may ride alongside.
 * Sections adopt this shape as they are restyled (M5); new shared
 * components must use it from the start. `icon`/media values inside
 * `data` resolve only through the shared resolvers, never inline.      */

export type SlotClasses<TSlot extends string = string> = Partial<Record<TSlot, string>>;

export type DataProps<TData, TSlot extends string = string> = {
  data: TData;
  classes?: SlotClasses<TSlot>;
  className?: string;
  id?: string;
};
