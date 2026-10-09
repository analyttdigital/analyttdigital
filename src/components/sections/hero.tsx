'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { MdiIcon } from '@/lib/icons/resolve-icon';
import { DynamicImage } from '@/components/media/dynamic-image';
import type { HeroBridge, HeroPartner, HeroPanel, HeroProof, HeroSection } from '@/lib/content/types';
import { BridgeAbout } from '@/components/graphics/bridge-about';
import { HeroGather } from '@/components/graphics/hero-gather';
import { LogoWireframe } from '@/components/graphics/logo-wireframe';
import { TextReveal } from '@/components/graphics/text-reveal';
import { smooth } from '@/lib/motion/smooth';
import { PathFlowSection } from '../graphics/path-flow-section';

/**
 * Hero — full-screen audit route head (user-approved replica).
 *
 * The visitor's choices are honoured verbatim here: the glass result-tunnel,
 * pill audit link, halo copy block and proof strip ship as requested, even
 * where they break the Signal Mesh bans (rounded glass, blur, shadows, an
 * infinite loop, information inside decoration). That override was explicit.
 *
 * What still holds: token colours only (primary/accent/paper/ink families),
 * MDI resolution (no `iconify-icon` custom element), copy from the content
 * layer, `aria-hidden` on the decorative tunnel so it never carries
 * information for AT, and a static readable state under
 * `prefers-reduced-motion` / mobile (fewer panels, no parallax, no loop).
 *
 * Tunnel cards are data, not markup: every panel's copy lives in
 * `defaults.ts` (`hero.panels`, editable in Keystatic) and this file only
 * picks a layout by `panel.kind`. Empty `icon` keeps the kind's positional
 * default, per the shared icon convention.
 */

/** Fallback tunnel when the content layer carries no panels (legacy CMS entries). */
const FALLBACK_PANELS: HeroPanel[] = [
  {
    kind: 'cpl',
    title: 'Cost per lead',
    subtitle: 'ZoomTech Ke · Google Search',
    footer: 'KES 1,800 → KES 280',
    delta: '-84% in 60 days',
    icon: 'chartBox',
    bars: [100, 82, 64, 46, 31, 22, 17, 15],
  },
  {
    kind: 'leads',
    title: 'Kings Bliss Developers',
    value: '37',
    valueLabel: 'property inquiries per week',
    footer: '9x growth from a KES 150K budget',
    icon: 'pin',
  },
  {
    kind: 'revenue',
    title: 'Mandevu BeardCare',
    value: 'KES 2.4M',
    valueLabel: 'monthly revenue in 90 days',
    footer: 'Up from a 1.1x ROAS',
    icon: 'tag',
  },
  {
    kind: 'seo',
    title: 'Page 1 rankings',
    subtitle: 'Mabati Yetu · 8 months',
    value: '47',
    valueLabel: 'high-intent keywords',
    progress: 85,
  },
  {
    kind: 'process',
    title: 'Your 90-day plan',
    icon: 'rocket',
    steps: [
      { label: 'Diagnose', state: 'done' },
      { label: 'Blueprint', state: 'done' },
      { label: 'Launch', state: 'active' },
      { label: 'Optimise', state: 'todo' },
      { label: 'Scale', state: 'todo' },
    ],
  },
  {
    kind: 'code',
    title: 'server-side tracking',
    icon: 'document',
    codeLines: ["gtag('event', 'generate_lead',", "{ value: 280, currency: 'KES' }", '// conversion attributed'],
  },
  {
    kind: 'alert',
    title: 'Budget leak found',
    subtitle: 'Most audits uncover KES 50K–200K in recoverable spend.',
    icon: 'asterisk',
    tone: 'alert',
  },
  {
    kind: 'whatsapp',
    title: 'New lead · WhatsApp',
    subtitle: 'Instant follow-up from a retargeted virtual tour.',
    icon: 'mail',
  },
  {
    kind: 'simkar',
    title: 'Simkar Group',
    icon: 'chart',
    metrics: [
      { value: '+45%', label: 'lead generation' },
      { value: '+80%', label: 'content engagement' },
    ],
  },
  {
    kind: 'roas',
    title: 'Blended ROAS',
    subtitle: 'Mandevu · Meta + Google',
    footer: 'Up from 1.1× in 90 days',
    delta: '+282%',
    icon: 'chart',
    bars: [18, 26, 34, 47, 61, 77, 89, 100],
  },
  {
    kind: 'attribution',
    title: 'GA4 + GTM + server-side',
    value: '100%',
    valueLabel: 'campaigns tracked to conversion',
    footer: 'No vanity metrics reported',
    icon: 'database',
  },
  {
    kind: 'audit',
    title: 'Measurement health',
    subtitle: 'New account · 27 leaks fixed',
    value: '38 → 92',
    valueLabel: 'audit score',
    delta: '+54 pts',
    progress: 92,
  },
  {
    kind: 'ctr',
    title: 'Prospecting CTR',
    subtitle: 'TikTok + Meta · Nairobi',
    footer: 'Benchmark 1.1%',
    delta: '3.8% · +2.7pts',
    icon: 'bullhorn',
    bars: [30, 42, 38, 55, 68, 74, 88, 95],
  },
  {
    kind: 'funnel',
    title: 'Intent pages + lead scoring',
    value: '6.8%',
    valueLabel: 'visitor → lead rate',
    footer: 'Up from 2.1%',
    delta: '+224%',
    icon: 'layers',
  },
  {
    kind: 'partner',
    title: 'Google',
    subtitle: 'Search · YouTube · Analytics',
    logo: { src: '/img/partners/google.svg', alt: 'Google' },
    logoDark: { src: '/img/partners/google-light.svg', alt: 'Google' },
  },
  {
    kind: 'partner',
    title: 'Meta',
    subtitle: 'Facebook · Instagram · WhatsApp',
    logo: { src: '/img/partners/meta.svg', alt: 'Meta' },
    logoDark: { src: '/img/partners/meta-light.svg', alt: 'Meta' },
  },
  {
    kind: 'partner',
    title: 'HubSpot',
    subtitle: 'CRM & attribution',
    logo: { src: '/img/partners/hubspot.svg', alt: 'HubSpot' },
    logoDark: { src: '/img/partners/hubspot-light.svg', alt: 'HubSpot' },
  },
  {
    kind: 'partner',
    title: 'TikTok',
    subtitle: 'Discovery & prospecting',
    logo: { src: '/img/partners/tiktok.svg', alt: 'TikTok' },
    logoDark: { src: '/img/partners/tiktok-light.svg', alt: 'TikTok' },
  },
  {
    kind: 'partner',
    title: 'LinkedIn',
    subtitle: 'B2B demand',
    logo: { src: '/img/partners/linkedin.svg', alt: 'LinkedIn' },
    logoDark: { src: '/img/partners/linkedin-light.svg', alt: 'LinkedIn' },
  },
];

/** Positional icon per layout — an explicit `icon` in content always wins. */
const DEFAULT_ICON: Record<HeroPanel['kind'], string> = {
  cpl: 'chartBox',
  leads: 'pin',
  revenue: 'tag',
  seo: 'chart',
  process: 'rocket',
  code: 'document',
  alert: 'asterisk',
  whatsapp: 'mail',
  simkar: 'chart',
  roas: 'chart',
  attribution: 'database',
  audit: 'crosshairs',
  ctr: 'bullhorn',
  funnel: 'layers',
  partner: 'check',
};

/** Icon colour per panel — content-editable, token-only, Tailwind-static.
 *  `default` keeps the layout's positional colour (ember headers, soft metric
 *  icons); the three named tones map to fixed token classes so the JIT always
 *  sees full class literals. */
type IconTone = 'accent' | 'primary' | 'muted';

function resolveIconTone(panel: HeroPanel, fallback: IconTone): IconTone {
  return panel.iconTone && panel.iconTone !== 'default' ? panel.iconTone : fallback;
}

function iconTextClass(panel: HeroPanel, fallback: IconTone, dark = false) {
  const tone = resolveIconTone(panel, fallback);
  if (dark) {
    return tone === 'accent' ? 'text-accent-300' : tone === 'primary' ? 'text-primary-200' : 'text-primary-300';
  }
  return tone === 'accent' ? 'text-accent-600' : tone === 'primary' ? 'text-primary-700' : 'text-primary-500';
}

function iconTileClass(panel: HeroPanel, fallback: IconTone, dark = false) {
  const tone = resolveIconTone(panel, fallback);
  if (dark) {
    return tone === 'accent'
      ? 'bg-accent-500/15 text-accent-300'
      : tone === 'primary'
        ? 'bg-primary-50/10 text-primary-200'
        : 'bg-primary-50/10 text-primary-300';
  }
  return tone === 'accent'
    ? 'bg-accent-500/10 text-accent-600'
    : tone === 'primary'
      ? 'bg-primary-700/10 text-primary-700'
      : 'bg-primary-600/10 text-primary-500';
}

function iconDotClass(panel: HeroPanel, fallback: IconTone) {
  const tone = resolveIconTone(panel, fallback);
  return tone === 'accent' ? 'bg-accent-500' : tone === 'primary' ? 'bg-primary-700' : 'bg-primary-500';
}

/** Panel interior tones per hero variant — one map so all seven layouts flip
 *  together. Ember stays the brand value (dots/bars read as marks, not type);
 *  type steps up the ramp on dark per the token rule. */
function panelTones(dark: boolean) {
  return {
    title: dark ? 'text-primary-50' : 'text-primary-900',
    client: dark ? 'text-primary-200' : 'text-primary-700',
    sub: dark ? 'text-primary-300' : 'text-primary-500',
    rule: dark ? 'border-primary-50/10' : 'border-primary-900/10',
    track: dark ? 'bg-primary-50/10' : 'bg-primary-900/10',
    barOff: dark ? 'bg-primary-50/15' : 'bg-primary-600/25',
    dotOff: dark ? 'bg-primary-50/20' : 'bg-primary-600/25',
    delta: dark ? 'text-accent-300' : 'text-accent-600',
  };
}

const FALLBACK = {
  eyebrow: 'Free digital audit: find where your budget is leaking',
  headline: 'Performance marketing &\ngrowth infrastructure.',
  sub: 'We are a specialist performance marketing partner in paid media, measurement infrastructure, and growth strategy. Trusted by SMEs, startups, and B2B/B2C companies scaling across Africa.',
  cta: 'Get Started',
  secondary: 'Request Digital Audit',
} as const;

/** Fallback proof strip (legacy CMS entries without one). */
const FALLBACK_PROOF: HeroProof[] = [
  { value: '100%', label: 'campaigns tracked to conversion' },
  { value: '7-day', label: 'optimization cycle' },
  { value: 'Zero', label: 'vanity metrics reported', ember: true },
];

/** Deterministic RNG so server and client render the same first frame. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bars layout: cpl / roas / ctr — a falling or climbing spend story. */
function BarsPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  const bars = panel.bars?.length ? panel.bars : [100, 82, 64, 46, 31, 22, 17, 15];
  const t = panelTones(dark);
  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
        <span className={iconTextClass(panel, 'accent', dark)}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
        </span>
      </div>
      {panel.subtitle ? <span className={`mb-3 text-[10px] ${t.sub}`}>{panel.subtitle}</span> : null}
      <div className="flex h-14 w-full items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={`${h}-${i}`}
            style={{ height: `${h}%` }}
            className={`w-full rounded-t-sm ${i > 5 ? 'bg-accent-500/80' : t.barOff}`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className={t.sub}>{panel.footer}</span>
        {panel.delta ? <span className={`font-medium ${t.delta}`}>{panel.delta}</span> : null}
      </div>
    </>
  );
}

/** Metric layout: leads / revenue / attribution / funnel — one big figure. */
function MetricPanel({ panel, dark, large }: { panel: HeroPanel; dark: boolean; large?: boolean }) {
  const footer = [panel.footer, panel.delta].filter(Boolean).join(' · ');
  const t = panelTones(dark);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <span className={`text-xs font-medium ${t.client}`}>{panel.title}</span>
        <span className={iconTextClass(panel, 'muted', dark)}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
        </span>
      </div>
      {panel.value ? (
        <span
          className={`mt-1 font-medium tracking-tight ${t.title} ${large ? 'text-3xl' : 'text-2xl'}`}
        >
          {panel.value}
        </span>
      ) : null}
      {panel.valueLabel ? <span className={`text-[10px] ${t.sub}`}>{panel.valueLabel}</span> : null}
      {footer ? (
        <div className={`mt-2 flex items-center gap-1 text-[10px] ${iconTextClass(panel, 'accent', dark)}`}>
          <MdiIcon name="chart" size={0.6} />
          <span>{footer}</span>
        </div>
      ) : null}
    </div>
  );
}

/** Progress layout: seo / audit — a figure with a completion bar. */
function ProgressPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  const t = panelTones(dark);
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
          {panel.subtitle ? <span className={`text-[10px] ${t.sub}`}>{panel.subtitle}</span> : null}
        </div>
        <div className={`h-2 w-2 rounded-full ${iconDotClass(panel, 'accent')}`} aria-hidden />
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        {panel.value ? <span className={`text-2xl font-medium ${t.title}`}>{panel.value}</span> : null}
        {panel.valueLabel ? <span className={`text-[10px] ${t.sub}`}>{panel.valueLabel}</span> : null}
        {panel.delta ? <span className={`text-[10px] font-medium ${t.delta}`}>{panel.delta}</span> : null}
      </div>
      <div className={`mt-3 h-1 w-full rounded-full ${t.track}`}>
        <div className="h-full rounded-full bg-accent-500" style={{ width: `${panel.progress ?? 85}%` }} />
      </div>
    </>
  );
}

/** Steps layout: process — the 90-day plan with per-step state. */
function StepsPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  const steps = panel.steps ?? [];
  const t = panelTones(dark);
  return (
    <>
      <div className={`mb-3 flex items-center gap-2 border-b pb-2 ${t.rule}`}>
        <span className={iconTextClass(panel, 'accent', dark)}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.7} />
        </span>
        <span className={`text-[10px] font-medium ${t.title}`}>{panel.title}</span>
      </div>
      <div className="flex flex-col gap-1.5 text-[11px]">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center gap-2 ${
              step.state === 'active' ? `font-medium ${t.title}` : step.state === 'done' ? t.client : t.sub
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                step.state === 'todo'
                  ? t.dotOff
                  : `${iconDotClass(panel, 'accent')}${step.state === 'active' ? ' motion-safe:animate-pulse' : ''}`
              }`}
            />
            {step.label}
          </div>
        ))}
      </div>
    </>
  );
}

/** Code layout: server-side tracking snippet, one editable line per row. */
function CodePanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  const lines = panel.codeLines ?? [];
  const t = panelTones(dark);
  return (
    <>
      <div className={`mb-3 flex items-center gap-2 border-b pb-2 ${t.rule}`}>
        <span className={iconTextClass(panel, 'muted', dark)}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.7} />
        </span>
        <span className={`text-[10px] font-medium ${t.title}`}>{panel.title}</span>
      </div>
      <div className={`flex flex-col gap-1.5 font-mono text-[10px] ${t.client}`}>
        {lines.map((line, i) => {
          if (line.trimStart().startsWith('//')) {
            return (
              <div key={`${line}-${i}`} className={t.delta}>
                {line}
              </div>
            );
          }
          if (line.trimStart().startsWith('{')) {
            return (
              <div key={`${line}-${i}`} className={`pl-3 ${t.title}`}>
                {line}
              </div>
            );
          }
          return <div key={`${line}-${i}`}>{line}</div>;
        })}
      </div>
    </>
  );
}

/** Notice layout: alert / whatsapp — an icon tile with two lines. */
function NoticePanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  const t = panelTones(dark);
  return (
    <div className="flex items-start gap-3">
      <div className={`rounded p-1.5 ${iconTileClass(panel, 'accent', dark)}`}>
        <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
        {panel.subtitle ? (
          <span className={`text-[10px] leading-tight ${t.sub}`}>{panel.subtitle}</span>
        ) : null}
      </div>
    </div>
  );
}

/** Dual layout: simkar — two side-by-side figures. */
function DualPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  const t = panelTones(dark);
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className={`text-xs font-medium ${t.title}`}>{panel.title}</span>
        <span className={iconTextClass(panel, 'accent', dark)}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
        </span>
      </div>
      <div className="flex gap-5">
        {(panel.metrics ?? []).map((metric) => (
          <div key={metric.value} className="flex flex-col">
            <span className={`text-xl font-medium ${t.title}`}>{metric.value}</span>
            <span className={`text-[10px] ${t.sub}`}>{metric.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/** Logo layout: partner — the mark is the message, centred and prominent. */
function LogoPanel({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  const t = panelTones(dark);
  const logo = dark && panel.logoDark?.src?.trim() ? panel.logoDark : panel.logo;
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-xs font-medium ${t.client}`}>{panel.title}</span>
      <div className="relative flex h-16 items-center justify-center">
        <DynamicImage image={logo ?? null} className="h-full w-full object-contain" sizes="256px" />
      </div>
      {panel.subtitle ? <span className={`text-center text-[10px] ${t.sub}`}>{panel.subtitle}</span> : null}
    </div>
  );
}

function PanelBody({ panel, dark }: { panel: HeroPanel; dark: boolean }) {
  switch (panel.kind) {
    case 'cpl':
    case 'roas':
    case 'ctr':
      return <BarsPanel panel={panel} dark={dark} />;
    case 'leads':
      return <MetricPanel panel={panel} dark={dark} large />;
    case 'revenue':
    case 'attribution':
    case 'funnel':
      return <MetricPanel panel={panel} dark={dark} />;
    case 'seo':
    case 'audit':
      return <ProgressPanel panel={panel} dark={dark} />;
    case 'process':
      return <StepsPanel panel={panel} dark={dark} />;
    case 'code':
      return <CodePanel panel={panel} dark={dark} />;
    case 'alert':
    case 'whatsapp':
      return <NoticePanel panel={panel} dark={dark} />;
    case 'simkar':
      return <DualPanel panel={panel} dark={dark} />;
    case 'partner':
      return <LogoPanel panel={panel} dark={dark} />;
  }
}

/** Partner marks rowed along the hero's foot (fallback when CMS list is empty). */
const FALLBACK_PARTNERS: HeroPartner[] = [
  { label: 'Google Ads Partner', logo: { src: '/img/partners/google.svg', alt: 'Google' }, logoDark: { src: '/img/partners/google-light.svg', alt: 'Google' } },
  { label: 'Meta Business Partner', logo: { src: '/img/partners/meta.svg', alt: 'Meta' }, logoDark: { src: '/img/partners/meta-light.svg', alt: 'Meta' } },
  { label: 'TikTok Marketing Partner', logo: { src: '/img/partners/tiktok.svg', alt: 'TikTok' }, logoDark: { src: '/img/partners/tiktok-light.svg', alt: 'TikTok' } },
  { label: 'LinkedIn Marketing Partner', logo: { src: '/img/partners/linkedin.svg', alt: 'LinkedIn' }, logoDark: { src: '/img/partners/linkedin-light.svg', alt: 'LinkedIn' } },
  { label: 'HubSpot Solutions Partner', logo: { src: '/img/partners/hubspot.svg', alt: 'HubSpot' }, logoDark: { src: '/img/partners/hubspot-light.svg', alt: 'HubSpot' } },
];

/* ------------------------------------------------------------------ */
/* Portal transition — scroll-scrubbed circular reveal into Process     */
/*                                                                    */
/* The hero is a tall runway section with a sticky 100svh stage. As    */
/* scroll progress `p` (one framer-motion source, zero re-renders)     */
/* approaches the end, a Process-ground circle floods out of the 3D    */
/* mark and fills the viewport; the sticky stage then unpins onto the  */
/* Process section, which continues in the same ground with no seam.   */
/* Every window below is a pure function of `p`: fully reversible.     */
/* ------------------------------------------------------------------ */

/** Total runway: 100svh of stage + 150svh of portal beat. */
export const HERO_RUNWAY_SVH = 250;
/** Portal circle window — ends at 0.985 so a hold of flat ground sits
 *  between full coverage and the unpin. */
export const PORTAL_START = 0.78;
export const PORTAL_END = 0.985;
/** Bridge copy window inside the flood. */
export const PORTAL_TEXT_START = 0.8;
export const PORTAL_TEXT_END = 0.93;
/** Fallback bridge exit window — used only when no Process section directly
 *  follows the hero (the handoff below has nothing to hold). Otherwise the
 *  bridge stays up while Process aligns behind the flood, and the exit is
 *  driven by the handoff scroll instead. */
export const PORTAL_EXIT_START = 0.93;
export const PORTAL_EXIT_END = 0.995;
/** Viewport fractions of scroll the handoff exit takes once Process top is
 *  aligned to the viewport top. */
export const HANDOFF_EXIT_SVH = 0.6;
/** Percentage radius at full open. `circle()` resolves % against
 *  sqrt(w²+h²)/√2, so 100% can leave the far corner bare from an
 *  off-centre origin; 125% covers 16:9, ultrawide and portrait. */
export const PORTAL_MAX_RADIUS = 125;
/** Clip origin = the mark's final on-screen position. Desktop: the gather
 *  lays the mark at ~72.5% X; the portal-beat drift (-12vw) and 1.28×
 *  growth about the viewport centre carry it to ~67% X / ~51% Y.
 *  Mobile: the mark sits top-centre (~50% / ~28%) and only grows. */
export const ORIGIN_DESKTOP = '67% 51%';
export const ORIGIN_MOBILE = '50% 26%';

/** Supporting choreography windows (fractions of `p`). */
const CHAPTER_OUT_START = 0.64;
const CHAPTER_OUT_END = 0.78;
const TOOLBAR_FADE_START = 0.66;
const TOOLBAR_FADE_END = 0.79;
/** Past this point the copy is fully transparent, so it leaves the tab
 *  order and the pointer gives up the stage to the portal. The WebGL
 *  canvas itself stays visible — the model must be seen turning as the
 *  circle opens — and only parks its pointer interaction. */
const CONTROLS_PARK_AT = 0.79;
const FOOTER_FADE_START = 0.78;
const FOOTER_FADE_END = 0.87;
const CANVAS_SHIFT_START = 0.62;
const CANVAS_SHIFT_END = 0.82;
const CANVAS_SHIFT_AMOUNT = 0.12;
const CANVAS_GROW_START = 0.57;
const CANVAS_GROW_END = 0.88;
const CANVAS_GROW_DESKTOP = 0.28;
const CANVAS_GROW_MOBILE = 0.16;

export function Hero({ hero, variant, bridge }: { hero?: HeroSection; variant?: HeroSection['variant']; bridge?: HeroBridge }) {
  const eyebrow = hero?.eyebrow || FALLBACK.eyebrow;
  const lines = (hero?.headline || FALLBACK.headline).split('\n');
  const sub = hero?.sub || FALLBACK.sub;
  const ctaHref = hero?.ctaHref ?? '/#contact';
  const cta = hero?.cta || FALLBACK.cta;
  const secondary = hero?.scrollHint || FALLBACK.secondary;
  const proof = hero?.proof?.length ? hero.proof : FALLBACK_PROOF;
  const partners = hero?.marquee?.length ? hero.marquee : FALLBACK_PARTNERS;
  /** Explicit prop wins, then content, then the light stage. Tunnel panels
   *  flip with the variant through `panelTones` + the icon tone helpers. */
  const dark = (variant ?? hero?.variant ?? 'light') === 'dark';
  const reduce = useReducedMotion();

  /* ---- the single scroll-progress source for the portal timeline ---- */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const [isMobile, setIsMobile] = useState(false);
  /* Threshold-crossing flags only: the one acceptable state change on
   * scroll. Everything else rides MotionValues with zero re-renders. */
  const [parked, setParked] = useState(false);
  const [footGone, setFootGone] = useState(false);
  const [portalLive, setPortalLive] = useState(false);
  /* True while the flood circle is open at all — the wireframe's entry
   * trigger. Unlike `portalLive` (the copy window) this stays true across
   * the whole flat-flood hold, so the sweep replays on every entry. */
  const [floodLive, setFloodLive] = useState(false);
  /* Handoff state: at the end of the runway the flood detaches to `fixed`
   * and holds the bridge up while the Process section aligns behind it
   * (top edge to viewport top); further scroll drives `handoffExit`, which
   * reveals the fully-arrived stage. Only engages when Process directly
   * follows the hero — otherwise sections would scroll invisibly behind
   * the held flood, so the fallback timeline exit takes over instead. */
  const [detached, setDetached] = useState(false);
  const [exited, setExited] = useState(false);
  const [handsToProcess, setHandsToProcess] = useState(true);
  const handoffExit = useMotionValue(0);
  const exitAnchor = useRef<number | null>(null);
  const viewportW = useRef(0);

  useEffect(() => {
    const update = () => {
      viewportW.current = window.innerWidth;
      setIsMobile(
        window.innerWidth < 760 || (window.innerHeight > window.innerWidth && window.innerWidth < 1024),
      );
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  useMotionValueEvent(p, 'change', (v) => {
    const nextParked = v > CONTROLS_PARK_AT;
    setParked((prev) => (prev === nextParked ? prev : nextParked));
    const nextFoot = v > FOOTER_FADE_END;
    setFootGone((prev) => (prev === nextFoot ? prev : nextFoot));
    const nextFlood = v >= PORTAL_START;
    setFloodLive((prev) => (prev === nextFlood ? prev : nextFlood));
  });

  useEffect(() => {
    // Adjacent Process section (the renderer wraps it in a plain div, so
    // look inside the next sibling rather than at it).
    setHandsToProcess(!!heroRef.current?.nextElementSibling?.querySelector('#process'));
  }, []);

  /* Handoff scroll driver — runs alongside the framer timeline above.
   * Attached while the runway pins; detached once the hero bottom reaches
   * the viewport bottom (the unpin), holding the flood fixed while Process
   * rises behind it; exiting once Process top aligns to the viewport top.
   * `portalLive` is computed here because it depends on both sources. */
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const vh = window.innerHeight;
      const heroBottom = hero.getBoundingClientRect().bottom;
      const procTop = document.getElementById('process')?.getBoundingClientRect().top ?? vh;
      if (heroBottom > vh + 1 || !handsToProcess) {
        exitAnchor.current = null;
        handoffExit.set(0);
        setExited(false);
        setDetached(false);
      } else if (procTop > 0) {
        exitAnchor.current = null;
        handoffExit.set(0);
        setExited(false);
        setDetached(true);
      } else {
        setDetached(true);
        if (exitAnchor.current == null) exitAnchor.current = window.scrollY;
        const e = Math.min(
          1,
          Math.max(0, (window.scrollY - exitAnchor.current) / (vh * HANDOFF_EXIT_SVH)),
        );
        handoffExit.set(e);
        setExited(e >= 1);
      }
      const enter = smooth(PORTAL_TEXT_START, PORTAL_TEXT_END, p.get());
      const scroll = p.get();
      const timelineExit = handsToProcess ? 0 : smooth(PORTAL_EXIT_START, PORTAL_EXIT_END, scroll);
      const nextLive = enter * (1 - timelineExit) * (1 - handoffExit.get()) >= 0.5;
      setPortalLive((prev) => (prev === nextLive ? prev : nextLive));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, handsToProcess, handoffExit, p]);

  /* ---- the whole timeline as pure functions of `p` ---- */
  const portalOpen = useTransform(p, (v) => smooth(PORTAL_START, PORTAL_END, v));
  const portalRadius = useTransform(portalOpen, (v) => v * PORTAL_MAX_RADIUS);
  const origin = isMobile ? ORIGIN_MOBILE : ORIGIN_DESKTOP;
  const clipPath = useMotionTemplate`circle(${portalRadius}% at ${origin})`;
  /* Bridge copy rides in, holds, then scrolls itself out: opacity is
   * entrance × (1 − exit) with an upward drift and a de-blur in reverse.
   * The exit is whichever is live — the fallback timeline exit when no
   * Process section follows, or the handoff exit driven by the scroll
   * behind the detached flood. All pure functions of scroll. */
  const portalText = useTransform([p, handoffExit], (latest: number[]) => {
    const v = latest[0] ?? 0;
    const e = latest[1] ?? 0;
    const enter = smooth(PORTAL_TEXT_START, PORTAL_TEXT_END, v);
    const timelineExit = handsToProcess ? 0 : smooth(PORTAL_EXIT_START, PORTAL_EXIT_END, v);
    return enter * (1 - timelineExit) * (1 - e);
  });
  const portalTextY = useTransform([p, handoffExit], (latest: number[]) => {
    const v = latest[0] ?? 0;
    const e = latest[1] ?? 0;
    const enter = smooth(PORTAL_TEXT_START, PORTAL_TEXT_END, v);
    const timelineExit = handsToProcess ? 0 : smooth(PORTAL_EXIT_START, PORTAL_EXIT_END, v);
    return (1 - enter) * 45 - (timelineExit + e) * 70;
  });
  const portalTextBlur = useTransform([p, handoffExit], (latest: number[]) => {
    const v = latest[0] ?? 0;
    const e = latest[1] ?? 0;
    const timelineExit = handsToProcess ? 0 : smooth(PORTAL_EXIT_START, PORTAL_EXIT_END, v);
    return `blur(${(timelineExit + e) * 8}px)`;
  });
  const floodOpacity = useTransform(handoffExit, (v) => 1 - v);
  const chapterOut = useTransform(p, (v) => smooth(CHAPTER_OUT_START, CHAPTER_OUT_END, v));
  const copyOpacity = useTransform(chapterOut, (v) => 1 - v);
  const copyY = useTransform(chapterOut, (v) => -v * 80);
  const toolbarOpacity = useTransform(p, (v) => 1 - smooth(TOOLBAR_FADE_START, TOOLBAR_FADE_END, v));
  const footerOpacity = useTransform(p, (v) => 1 - smooth(FOOTER_FADE_START, FOOTER_FADE_END, v));
  const glowOpacity = useTransform(portalOpen, (v) => 1 - v);
  const orbitTurn = useTransform(p, (v) => v * 140);
  const canvasX = useTransform(
    p,
    (v) => (isMobile ? 0 : -smooth(CANVAS_SHIFT_START, CANVAS_SHIFT_END, v) * viewportW.current * CANVAS_SHIFT_AMOUNT),
  );
  const canvasScale = useTransform(
    p,
    (v) =>
      1 +
      smooth(CANVAS_GROW_START, CANVAS_GROW_END, v) * (isMobile ? CANVAS_GROW_MOBILE : CANVAS_GROW_DESKTOP),
  );

  const ground = dark ? 'bg-primary-950 text-primary-100' : 'bg-paper text-ink-800';

  return (
		<section
			ref={heroRef}
			id="hero"
			className={`group relative font-sans ${ground}`}
			style={reduce ? undefined : { height: `${HERO_RUNWAY_SVH}svh` }}
		>
			{/* The stage: pinned for the runway, then unpins onto Process. It —
			 *  not the section — owns `overflow: hidden`, so sticky keeps working. */}
			<div
				data-hero-stage
				className={`flex min-h-[max(100svh,680px)] flex-col overflow-hidden isolate ${
					reduce ? "relative" : "sticky top-0 h-[100svh]"
				} ${ground}`}
			>
				<motion.div
					aria-hidden
					className={`absolute inset-0 -z-30 ${
						dark
							? "bg-primary-950 bg-[radial-gradient(55%_70%_at_70%_48%,rgba(240,79,38,.16),transparent_70%),radial-gradient(45%_55%_at_8%_100%,transparent_70%,transparent_70%)]"
							: "bg-paper bg-[radial-gradient(55%_70%_at_70%_48%,rgba(240,79,38,.11),transparent_70%),radial-gradient(45%_55%_at_8%_100%,transparent_70%,transparent_70%)]"
					}`}
					style={reduce ? undefined : { opacity: glowOpacity, rotate: orbitTurn }}
				/>

				{/* WebGL icon-gather scene — full-bleed layer that drifts + grows into the portal */}
				<motion.div
					aria-hidden
					className="absolute inset-0"
					style={reduce ? undefined : { x: canvasX, scale: canvasScale }}
				>
					<HeroGather progress={reduce ? undefined : p} />
				</motion.div>

				{/* Copy block — bottom on mobile, vertically centered on desktop.
			    Rides out on `chapterOut`, then leaves the tab order once fully
			    transparent so the portal owns the stage. */}
				<motion.div
					className="relative z-30 flex flex-1 items-end px-5 sm:px-[clamp(20px,6vw,96px)] md:items-center"
					style={
						reduce
							? undefined
							: {
									opacity: copyOpacity,
									y: copyY,
									visibility: parked ? "hidden" : "visible",
								}
					}
				>
					<div className="mx-auto w-full max-w-7xl pb-[120px] md:pb-16">
						<div className="w-full max-w-[760px]">
							<a
								href={ctaHref}
								className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all ${
									dark
										? "border-primary-50/15 bg-primary-900/80 text-accent-400 hover:border-accent-500/40 hover:text-accent-300"
										: "border-primary-900/15 bg-paper/80 text-accent hover:border-accent-500/40 hover:text-accent-600"
								}`}
								style={{
									boxShadow: "0 2px 10px rgb(var(--color-primary-600) / 0.06)",
								}}
							>
								{eyebrow}
								<MdiIcon
									name="arrowRight"
									className="text-accent-300"
									size={0.55}
								/>
							</a>

							<h1
								className={`font-display text-[clamp(1.6rem,4.2vw,3.6rem)] font-bold leading-[1.02] tracking-tightest ${
									dark ? "text-primary-50" : "text-primary-900"
								}`}
							>
								{lines.map((line, i) => (
									<span
										key={`${line}-${i}`}
										className={`block whitespace-nowrap ${i === lines.length - 1 ? (dark ? "text-accent-400" : "text-accent-600") : ""}`}

									>
										{line || " "}
									</span>
								))}
							</h1>

							<p
								className={`mt-[18px] max-w-[30em]  leading-relaxed sm:mt-6 ${dark ? "text-primary-200" : "text-ink-500"}`}

								// delay={0.1 + lines.length * 0.1}
							>
								{sub || " "}
							</p>

							<motion.div
								data-rise
								className="mt-[26px] flex flex-wrap items-center gap-4 sm:mt-[34px] sm:gap-[22px]"
								style={reduce ? undefined : { opacity: toolbarOpacity }}
							>
								<a
									href={ctaHref}
									className="group/btn inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-[.95rem] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(240,79,38,.6)] transition hover:bg-accent-600"
								>
									{cta}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
									>
										<path d="M5 12h14M13 6l6 6-6 6" />
									</svg>
								</a>
								<a
									href={ctaHref}
									className={`inline-flex items-center gap-3 rounded-full border px-7 py-4 text-[.95rem] font-semibold transition ${dark ? "border-primary-50/25 text-primary-100 hover:border-accent-500 hover:text-accent-300" : "border-ink-950/20 text-ink-800 hover:border-accent-500 hover:text-accent-600"}`}
								>
									{secondary}
									<MdiIcon name="document" size={0.85} />
								</a>
							</motion.div>

							<motion.div
								className="mt-[30px] sm:mt-11"
								style={reduce ? undefined : { opacity: toolbarOpacity }}
							>
								<div
									aria-hidden
									className="mb-[18px] h-px bg-accent-500 sm:mb-[22px]"
									style={{
										maskImage:
											"linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
										WebkitMaskImage:
											"linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
									}}
								/>
								<div className="grid grid-cols-3 gap-4 md:grid-cols-[repeat(3,auto)] md:justify-start md:gap-14">
									{proof.map((item, i) => {
										const m = /^(-?)(\d+)(.*)$/.exec(item.value);
										return (
											<div data-rise key={`${item.value}-${i}`}>
												<b
													{...(m
														? {
																"data-to": m[2],
																"data-pre": m[1],
																"data-suf": m[3],
															}
														: {})}
													className={`block font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold tracking-tightest ${dark ? "text-primary-50" : ""}`}
												>
													{item.value}
												</b>
												<span
													className={`mt-0.5 block max-w-[11em] text-[.78rem] leading-snug ${dark ? "text-primary-300" : "text-ink-400"}`}
												>
													{item.label}
												</span>
											</div>
										);
									})}
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>

				{/* Partner marquee — bottom of the hero; rides out as the footer cue */}
				<motion.div
					className={`relative z-30 mx-auto w-full max-w-7xl overflow-hidden  py-5 px-5 sm:px-[clamp(20px,6vw,96px)] ${dark ? "border-primary-50/15" : "border-primary-900/15"}`}
					aria-label="Partners"
					style={
						reduce
							? {
									maskImage:
										"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
									WebkitMaskImage:
										"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
								}
							: {
									maskImage:
										"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
									WebkitMaskImage:
										"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
									opacity: footerOpacity,
									visibility: footGone ? "hidden" : "visible",
								}
					}
				>
					<div className="flex w-max animate-marquee motion-reduce:animate-none">
						{[0, 1].map((copy) => (
							<div
								key={copy}
								aria-hidden={copy === 1}
								className="flex items-center gap-16 pr-16"
							>
								{partners.map((p, i) => {
									const logo =
										dark && p.logoDark?.src?.trim() ? p.logoDark : p.logo;
									return (
										<div
											key={`${p.label}-${i}`}
											className="flex items-center gap-3"
										>
											<img
												src={logo.src}
												alt={copy === 0 ? logo.alt : ""}
												className="h-7 w-auto opacity-80 transition-opacity hover:opacity-100 md:h-8"
											/>
											<span
												className={`whitespace-nowrap text-sm font-medium tracking-tight ${dark ? "text-primary-200" : "text-primary-700"}`}
											>
												{p.label}
											</span>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</motion.div>

				{/* The portal: deep-field ground flooding out of the mark. Above every
			    hero layer, never interactive, never carrying layout — only a
			    scroll-driven clip-path. At the end of the runway the flood
			    detaches to fixed and holds the bridge up while the Process
			    section aligns behind it; once Process top meets the viewport
			    top, further scroll exits the bridge and fades the flood to
			    reveal the fully-arrived stage. */}
				{!reduce && !exited && (
					<motion.div
						aria-hidden={portalLive ? undefined : true}
						className={`pointer-events-none bg-primary ${
							detached ? 'fixed inset-0 z-[60]' : 'absolute inset-0 z-[50]'
						}`}
						style={{ clipPath, willChange: 'clip-path', opacity: floodOpacity }}
					>
						{/* Logo wireframe — the Analytt monogram redrawn as a wireframe
						 * on the flood's left half, sweeping on every entry. */}
						{/* <LogoWireframe active={floodLive} /> */}
						<div className="relative flex h-full w-full items-center justify-center">
							{bridge && (
								<motion.div
									className="flex w-full flex-col items-center px-5 sm:px-[clamp(20px,6vw,96px)]"
									style={{ opacity: portalText, y: portalTextY, filter: portalTextBlur }}
								>
									<BridgeAbout data={bridge} live={portalLive} />
								</motion.div>
							)}
						</div>
					</motion.div>
				)}
			</div>
		</section>
  );
}
