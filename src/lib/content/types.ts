/* ------------------------------ locale -------------------------------- */

export type Locale = 'en' | 'sw';

export const locales: Locale[] = ['en', 'sw'];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** The one catch-all route's params: `locale` holds the first URL segment and
 *  the optional catch-all `slug` holds the rest (an array, or empty at the
 *  route's base). */
export type RouteParams = { locale?: string; slug?: string | string[] };

/**
 * Normalize route params into the page's locale + slug.
 *
 * One catch-all route serves both URL shapes the site publishes:
 * `/<slug...>` for the default locale and `/<locale>/<slug...>` elsewhere.
 * The first segment therefore acts as a locale prefix only when it names a
 * locale; otherwise it is the default locale's first slug segment.
 */
export function routeFromParams(params?: RouteParams): { locale: Locale; slug: string } {
  const rest = Array.isArray(params?.slug) ? params.slug : [params?.slug];
  const segments = [params?.locale, ...rest].filter(
    (segment): segment is string => typeof segment === 'string' && segment.length > 0,
  );
  const [first, ...tail] = segments;
  const prefixed = isLocale(first);
  const slugSegments = prefixed ? tail : segments;
  return {
    locale: prefixed ? first : defaultLocale,
    // The route's base is home: `/` for the default locale, `/sw` for others.
    slug: slugSegments.join('/') || 'home',
  };
}

/* --------------------------- shared chrome ---------------------------- */

export type NavLink = { label: string; href: string; children?: NavLink[] };

export type FooterColumn = { title: string; links: NavLink[] };

/** One social/contact link in the footer connect rail. `icon` resolves
 *  through the shared MDI resolver — empty keeps the fallback glyph. */
export type SocialLink = { label: string; href: string; icon?: string };

export type LayoutContent = {
  brand: string;
  brandEmphasis: string;
  /** Wordmark shown when the header is transparent (`data-scrolled` absent). */
  logo: ContentImage;
  /** Wordmark shown once the header turns solid (`data-scrolled` present). */
  logoAlt: ContentImage;
  navLinks: NavLink[];
  navCta: string;
  navCtaHref: string;
  footerHeadline: string;
  footerCta: string;
  footerCtaHref: string;
  tagline: string;
  footnote: string;
  footerColumns: FooterColumn[];
  /** Rail label above the social/contact icon buttons. */
  socialTitle: string;
  /** Social/contact links — Keystatic editable, icons via shared resolver. */
  socialLinks: SocialLink[];
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

/** One selectable point on the about plot: where it sits on the line
 *  (`x` 0–1), the decision it marks, and the measured result. */
export type AboutMove = { x: number; move: string; result: string };

/** About-us section: headline + intro + the interactive signal plot.
 *  Owned by the about content layer (editable in Keystatic) — `tag`
 *  renders as the band label, `title` as the headline (also echoed as the
 *  hero-portal bridge copy), `introLead` (bold) + `description` as the
 *  intro, then the plot: `baseLabel` on the dashed starting line,
 *  `axisLeft`/`axisRight` under it, `moveLabel`/`resultLabel`
 *  over the readout, `hint` beneath, and one `moves` entry per point. */
export type AboutSection = {
  tag: string;
  title: string;
  introLead: string;
  description: string;
  baseLabel: string;
  axisLeft: string;
  axisRight: string;
  moveLabel: string;
  resultLabel: string;
  hint: string;
  moves: AboutMove[];
};

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
  /** Activity-terrain instrument. Content pages compose `belief` as copy only
   *  (no figure), so the component renders the readout when it is present. */
  terrain?: TerrainData;
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
  /** Figure beside the copy. Content pages compose steps without one, so the
   *  player falls back to a copy-only card. */
  visual?: ProcessVisual;
};

export type ProcessSection = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  lede: string;  chapterTitle?: string;
  cardTitle: string;
  /* The player chrome below carries the full instrument's own words. A step
   * list without figures (content pages) leaves them out, and the player
   * renders the copy card with its own defaults. */
  cardSub?: string;
  playLabel?: string;
  pauseLabel?: string;
  stepOfTemplate?: string;
  illustrativeNote?: string;
  /** Filled stage backdrop — empty `src` hides it. */
  image?: ContentImage;
  /** Ms each step holds while autoplaying. */
  dwellMs?: number;
  steps: ProcessStep[];
  closing: string;
  cta: string;
  ctaHref: string;
};

/**
 * The instrument row each capability drags along with it — the readout the service
 * leaves behind. `kind` picks the figure; the series fields are read by that kind
 * alone, so an editor only fills what their figure draws.
 */
export type CapabilityReadout = {
  kind: 'channels' | 'attribution' | 'descent' | 'organic';
  caption: string;
  value: string;
  valueLabel: string;
  /** Live tag on the row; empty means the row is not reporting. */
  tag?: string;
  values: number[];
  /** Comparison series: attribution before setup, the prior organic period. */
  prior?: number[];
  labels?: string[];
  targetLabel?: string;
  /** The descent figure's target value, in the series' own units. */
  target?: number;
};

export type Capability = {
  tag: string;
  title: string;
  body: string;
  /** Position in the engagement order — measurement runs first. */
  depth?: string;
  icon?: string;
  readout?: CapabilityReadout;
};

export type CapabilitiesSection = {
  eyebrow: string;
  headline: string;
  lede: string;
  orderLabel: string;
  orderServices: string;
  orderSequence: string;
  /** Note under the instrument rows; empty hides the row's caption line. */
  illustrativeNote?: string;
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
  /** Card badge (e.g. NEW) — empty hides it. */
  tag?: string;
  image?: ContentImage;
};

export type WorkSection = {
  eyebrow: string;
  headline: string;
  /** Intro paragraph beside the heading. */
  body?: string;
  /** Pill CTA under the intro (e.g. View cases) — empty hides it. */
  cta?: string;
  ctaHref?: string;
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
  /** Filled section backdrop — empty `src` hides it. */
  image?: ContentImage;
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

/* ------------------- M1 content-page section kit ------------------- */

export type PageHeroSection = {
  eyebrow: string;
  headline: string;
  lede: string;
  /** Optional pull-quote under the lede — empty hides it. */
  quote?: string;
  cta?: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  body: string;
  icon?: string;
  image?: ContentImage;
};

export type TeamGridSection = {
  eyebrow: string;
  headline: string;
  body: string;
  members: TeamMember[];
};

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  note?: string;
  icon?: string;
};

export type ContactChannelsSection = {
  eyebrow: string;
  headline: string;
  body: string;
  channels: ContactChannel[];
};

export type FormField = {
  name: string;
  label: string;
  kind: 'text' | 'email' | 'textarea';
};

export type FormShellSection = {
  eyebrow: string;
  headline: string;
  body: string;
  submitLabel: string;
  /** Fallback mailto when no form backend is wired. */
  fallbackHref: string;
  fallbackLabel: string;
  note?: string;
  fields: FormField[];
};

export type FaqItem = { question: string; answer: string };

export type FaqSection = {
  eyebrow: string;
  headline: string;
  body: string;
  items: FaqItem[];
};

export type PricingTier = {
  name: string;
  tagline: string;
  body: string;
  cta: string;
  ctaHref: string;
  bestFor?: string;
  featured?: boolean;
  features: string[];
};

export type PricingTiersSection = {
  eyebrow: string;
  headline: string;
  body: string;
  note?: string;
  tiers: PricingTier[];
};

export type CompareTableSection = {
  eyebrow: string;
  headline: string;
  body: string;
  columns: string[];
  rows: { feature: string; cells: string[] }[];
};

export type ExclusionsSection = {
  eyebrow: string;
  headline: string;
  body: string;
  note?: string;
  items: { title: string; body: string }[];
};

export type PlanOption = { value: string; label: string; hint?: string };

export type PlanPickerSection = {
  eyebrow: string;
  headline: string;
  body: string;
  options: PlanOption[];
  cta: string;
  ctaHref: string;
  note?: string;
};

/* ------------------------- section union ------------------------------ */

export type Section =
	| ({ type: "hero" } & HeroSection)
	| ({ type: "about" } & AboutSection)
	| ({ type: "problem" } & ProblemSection)
	| ({ type: "belief" } & BeliefSection)
	| ({ type: "process" } & ProcessSection)
	| ({ type: "process-alt" } & ProcessSection)
	| ({ type: "capabilities" } & CapabilitiesSection)
	| ({ type: "work" } & WorkSection)
	| ({ type: "stats" } & StatsSection)
	| ({ type: "industries" } & IndustriesSection)
	| ({ type: "insights" } & InsightsSection)
	| ({ type: "cta" } & CtaSection)
	| ({ type: "cta-banner" } & CtaSection)
	| ({ type: "cta-split" } & CtaSection)
	| ({ type: "page-hero" } & PageHeroSection)
	| ({ type: "team-grid" } & TeamGridSection)
	| ({ type: "contact-channels" } & ContactChannelsSection)
	| ({ type: "form-shell" } & FormShellSection)
	| ({ type: "faq" } & FaqSection)
	| ({ type: "pricing-tiers" } & PricingTiersSection)
	| ({ type: "compare-table" } & CompareTableSection)
	| ({ type: "exclusions" } & ExclusionsSection)
	| ({ type: "plan-picker" } & PlanPickerSection);

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

/* ------------------------------- blog --------------------------------- */
/* Convention (M8, mirrors `postFields` in schemas.ts):
 * - `slug` is the bare URL segment (`/blog/<slug>`); source frontmatter
 *   slashes are stripped when seeding defaults.
 * - `body` is a Keystatic document (`fields.document`) in its reader shape.
 *   `DocumentElement` is not exported by `@keystatic/core/renderer`, so this
 *   structural mirror stands in and the single cast lives in `blog-post.tsx`.
 * - `excerpt` doubles as the card summary and the post's meta description.
 * - `featuredImage` reuses the M7 upload object; empty `src` hides the figure.
 * - Dates are ISO (`publishedAt`); display formatting happens in components. */

export type BlogDocText = { text: string; [key: string]: unknown };

export type BlogDocNode = {
  type: string;
  children: (BlogDocNode | BlogDocText)[];
  [key: string]: unknown;
};

export type BlogBody = BlogDocNode[];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  author: string;
  featuredImage?: ContentImage;
  body: BlogBody;
};

/** Listing-page copy (per locale, CMS-independent — the index is a standalone
 *  route, not a section). Posts/page/totalPages are route-derived and ride in
 *  the same object so the list component takes a single `data` prop. */
export type BlogListing = {
  eyebrow: string;
  headline: string;
  body: string;
  readMoreLabel: string;
  emptyNote: string;
  prevLabel: string;
  nextLabel: string;
  /** Use `{n}` and `{total}` (e.g. `Page {n} of {total}`). */
  pageOfTemplate: string;
  posts: BlogPost[];
  page: number;
  totalPages: number;
};

/** Post-page strings that belong to the page, not the post. */
export type BlogPostCopy = {
  backLabel: string;
  /** Use `{date}`, `{author}`, `{category}` — empty parts are dropped. */
  bylineTemplate: string;
};

/** Listing copy without the route-derived slice (what lives in defaults). */
export type BlogListingCopy = Omit<BlogListing, 'posts' | 'page' | 'totalPages'>;

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
