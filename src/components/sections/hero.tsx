'use client';

import { Fragment, useEffect, useMemo, useRef } from 'react';

import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { HeroPanel, HeroProof, HeroSection } from '@/lib/content/types';

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
};

/** Icon colour per panel — content-editable, token-only, Tailwind-static.
 *  `default` keeps the layout's positional colour (ember headers, soft metric
 *  icons); the three named tones map to fixed token classes so the JIT always
 *  sees full class literals. */
type IconTone = 'accent' | 'primary' | 'muted';

function resolveIconTone(panel: HeroPanel, fallback: IconTone): IconTone {
  return panel.iconTone && panel.iconTone !== 'default' ? panel.iconTone : fallback;
}

function iconTextClass(panel: HeroPanel, fallback: IconTone) {
  const tone = resolveIconTone(panel, fallback);
  return tone === 'accent' ? 'text-accent-600' : tone === 'primary' ? 'text-primary-700' : 'text-primary-500';
}

function iconTileClass(panel: HeroPanel, fallback: IconTone) {
  const tone = resolveIconTone(panel, fallback);
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
function BarsPanel({ panel }: { panel: HeroPanel }) {
  const bars = panel.bars?.length ? panel.bars : [100, 82, 64, 46, 31, 22, 17, 15];
  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-primary-900">{panel.title}</span>
        <span className={iconTextClass(panel, 'accent')}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
        </span>
      </div>
      {panel.subtitle ? <span className="mb-3 text-[10px] text-primary-500">{panel.subtitle}</span> : null}
      <div className="flex h-14 w-full items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={`${h}-${i}`}
            style={{ height: `${h}%` }}
            className={`w-full rounded-t-sm ${i > 5 ? 'bg-accent-500/80' : 'bg-primary-600/25'}`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className="text-primary-500">{panel.footer}</span>
        {panel.delta ? <span className="font-medium text-accent-600">{panel.delta}</span> : null}
      </div>
    </>
  );
}

/** Metric layout: leads / revenue / attribution / funnel — one big figure. */
function MetricPanel({ panel, large }: { panel: HeroPanel; large?: boolean }) {
  const footer = [panel.footer, panel.delta].filter(Boolean).join(' · ');
  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-medium text-primary-700">{panel.title}</span>
        <span className={iconTextClass(panel, 'muted')}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
        </span>
      </div>
      {panel.value ? (
        <span
          className={`mt-1 font-medium tracking-tight text-primary-900 ${large ? 'text-3xl' : 'text-2xl'}`}
        >
          {panel.value}
        </span>
      ) : null}
      {panel.valueLabel ? <span className="text-[10px] text-primary-500">{panel.valueLabel}</span> : null}
      {footer ? (
        <div className={`mt-2 flex items-center gap-1 text-[10px] ${iconTextClass(panel, 'accent')}`}>
          <MdiIcon name="chart" size={0.6} />
          <span>{footer}</span>
        </div>
      ) : null}
    </div>
  );
}

/** Progress layout: seo / audit — a figure with a completion bar. */
function ProgressPanel({ panel }: { panel: HeroPanel }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-primary-900">{panel.title}</span>
          {panel.subtitle ? <span className="text-[10px] text-primary-500">{panel.subtitle}</span> : null}
        </div>
        <div className={`h-2 w-2 rounded-full ${iconDotClass(panel, 'accent')}`} aria-hidden />
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        {panel.value ? <span className="text-2xl font-medium text-primary-900">{panel.value}</span> : null}
        {panel.valueLabel ? <span className="text-[10px] text-primary-500">{panel.valueLabel}</span> : null}
        {panel.delta ? <span className="text-[10px] font-medium text-accent-600">{panel.delta}</span> : null}
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-primary-900/10">
        <div className="h-full rounded-full bg-accent-500" style={{ width: `${panel.progress ?? 85}%` }} />
      </div>
    </>
  );
}

/** Steps layout: process — the 90-day plan with per-step state. */
function StepsPanel({ panel }: { panel: HeroPanel }) {
  const steps = panel.steps ?? [];
  return (
    <>
      <div className="mb-3 flex items-center gap-2 border-b border-primary-900/10 pb-2">
        <span className={iconTextClass(panel, 'accent')}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.7} />
        </span>
        <span className="text-[10px] font-medium text-primary-900">{panel.title}</span>
      </div>
      <div className="flex flex-col gap-1.5 text-[11px]">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center gap-2 ${
              step.state === 'active' ? 'font-medium text-primary-900' : step.state === 'done' ? 'text-primary-700' : 'text-primary-500'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                step.state === 'todo'
                  ? 'bg-primary-600/25'
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
function CodePanel({ panel }: { panel: HeroPanel }) {
  const lines = panel.codeLines ?? [];
  return (
    <>
      <div className="mb-3 flex items-center gap-2 border-b border-primary-900/10 pb-2">
        <span className={iconTextClass(panel, 'muted')}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.7} />
        </span>
        <span className="text-[10px] font-medium text-primary-900">{panel.title}</span>
      </div>
      <div className="flex flex-col gap-1.5 font-mono text-[10px] text-primary-700">
        {lines.map((line, i) => {
          if (line.trimStart().startsWith('//')) {
            return (
              <div key={`${line}-${i}`} className="text-accent-600">
                {line}
              </div>
            );
          }
          if (line.trimStart().startsWith('{')) {
            return (
              <div key={`${line}-${i}`} className="pl-3 text-primary-900">
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
function NoticePanel({ panel }: { panel: HeroPanel }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`rounded p-1.5 ${iconTileClass(panel, 'accent')}`}>
        <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-primary-900">{panel.title}</span>
        {panel.subtitle ? (
          <span className="text-[10px] leading-tight text-primary-500">{panel.subtitle}</span>
        ) : null}
      </div>
    </div>
  );
}

/** Dual layout: simkar — two side-by-side figures. */
function DualPanel({ panel }: { panel: HeroPanel }) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-primary-900">{panel.title}</span>
        <span className={iconTextClass(panel, 'accent')}>
          <MdiIcon name={panel.icon || DEFAULT_ICON[panel.kind]} size={0.75} />
        </span>
      </div>
      <div className="flex gap-5">
        {(panel.metrics ?? []).map((metric) => (
          <div key={metric.value} className="flex flex-col">
            <span className="text-xl font-medium text-primary-900">{metric.value}</span>
            <span className="text-[10px] text-primary-500">{metric.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function PanelBody({ panel }: { panel: HeroPanel }) {
  switch (panel.kind) {
    case 'cpl':
    case 'roas':
    case 'ctr':
      return <BarsPanel panel={panel} />;
    case 'leads':
      return <MetricPanel panel={panel} large />;
    case 'revenue':
    case 'attribution':
    case 'funnel':
      return <MetricPanel panel={panel} />;
    case 'seo':
    case 'audit':
      return <ProgressPanel panel={panel} />;
    case 'process':
      return <StepsPanel panel={panel} />;
    case 'code':
      return <CodePanel panel={panel} />;
    case 'alert':
    case 'whatsapp':
      return <NoticePanel panel={panel} />;
    case 'simkar':
      return <DualPanel panel={panel} />;
  }
}

export function Hero({ hero, variant }: { hero?: HeroSection; variant?: HeroSection['variant'] }) {
  const tunnelRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const eyebrow = hero?.eyebrow || FALLBACK.eyebrow;
  const lines = (hero?.headline || FALLBACK.headline).split('\n');
  const sub = hero?.sub || FALLBACK.sub;
  const ctaHref = hero?.ctaHref ?? '/#contact';
  const cta = hero?.cta || FALLBACK.cta;
  const secondary = hero?.scrollHint || FALLBACK.secondary;
  const contentPanels = hero?.panels?.length ? hero.panels : FALLBACK_PANELS;
  const proof = hero?.proof?.length ? hero.proof : FALLBACK_PROOF;
  /** Explicit prop wins, then content, then the light stage. Panels stay
   *  paper on both variants — floating light cards over the dark field. */
  const dark = (variant ?? hero?.variant ?? 'light') === 'dark';

  // Seeded placements — identical on server and client first paint. Positions
  // are content-agnostic; each slot cycles through the content panels so every
  // entry in `hero.panels` shows up regardless of list length.
  const placements = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: 40 }, (_, i) => {
      const angle = rand() * Math.PI * 2;
      const radiusX = 350 + rand() * 400;
      const radiusY = 250 + rand() * 300;
      return {
        x: Math.cos(angle) * radiusX,
        y: Math.sin(angle) * radiusY,
        z: -rand() * 4000,
        extra: i >= 20 ? 'hidden md:flex' : 'flex',
      };
    });
  }, []);

  useEffect(() => {
    const tunnel = tunnelRef.current;
    const scene = sceneRef.current;
    if (!tunnel || !scene) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.55 : 1;
    const cameraZ = 300;
    const maxDepth = 4000;
    const speed = reduce ? 0 : 1.5;

    const els = Array.from(tunnel.children) as HTMLElement[];
    const state = placements.map((p, i) => ({ ...p, x: p.x * scale, y: p.y * scale, el: els[i] })).filter((p) => p.el);

    const paint = () => {
      for (const p of state) {
        const blur = p.z < -1200 ? Math.min(6, (-p.z - 1200) / 400) : 0;
        const opacity =
          p.z < -3200 ? Math.max(0, 1 - (-p.z - 3200) / 800) : p.z > 0 ? Math.max(0, 1 - p.z / cameraZ) : 1;
        p.el.style.transform = `translate(-50%, -50%) translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, ${p.z.toFixed(1)}px)`;
        p.el.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none';
        p.el.style.opacity = opacity.toFixed(2);
        p.el.style.zIndex = String(Math.round(p.z + maxDepth));
      }
    };
    paint();

    if (reduce) return;

    let raf = 0;
    const tick = () => {
      for (const p of state) {
        p.z += speed;
        if (p.z > cameraZ) p.z -= maxDepth + cameraZ;
      }
      paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let parRaf = 0;
    let mouseX = 50;
    let mouseY = 50;
    let targetX = 50;
    let targetY = 50;
    const onMove = (e: MouseEvent) => {
      mouseX = 50 + (e.clientX / window.innerWidth - 0.5) * 20;
      mouseY = 50 + (e.clientY / window.innerHeight - 0.5) * 20;
    };
    const parTick = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      scene.style.perspectiveOrigin = `${targetX.toFixed(2)}% ${targetY.toFixed(2)}%`;
      parRaf = requestAnimationFrame(parTick);
    };
    if (!isMobile) {
      document.addEventListener('mousemove', onMove);
      parRaf = requestAnimationFrame(parTick);
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(parRaf);
      document.removeEventListener('mousemove', onMove);
    };
  }, [placements]);

  return (
    <section
      id="hero"
      className={`relative flex min-h-screen w-full flex-col overflow-hidden font-sans ${
        dark ? 'bg-primary-950 text-primary-100' : 'bg-paper text-ink-800'
      }`}
    >
      {/* Soft primary-tinted glow — token channels, decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 78% 18%, rgb(var(--color-accent-500) / 0.07) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgb(var(--color-primary-600) / 0.08) 0%, transparent 50%)',
        }}
      />

      {/* 3D tunnel of floating result panels — decorative, never information */}
      <div
        ref={sceneRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        style={{ perspective: '800px', perspectiveOrigin: '50% 50%' }}
      >
        <div ref={tunnelRef} className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
          {placements.map((p, i) => {
            const panel = contentPanels[i % contentPanels.length];
            return (
              <div
                key={`${panel.kind}-${i}`}
                className={`absolute left-1/2 top-1/2 w-64 flex-col rounded-xl border border-primary-900/10 bg-paper p-5 backdrop-blur-lg will-change-transform ${p.extra} ${
                  panel.tone === 'alert' ? 'border-accent-500/30' : ''
                }`}
                style={{ boxShadow: '0 10px 30px rgb(var(--color-primary-600) / 0.10)' }}
              >
                <PanelBody panel={panel} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Readability halo behind the copy — paper on light, ink on dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background: dark
            ? 'radial-gradient(ellipse 52% 44% at 50% 50%, rgb(var(--color-primary-950) / 0.94) 0%, rgb(var(--color-primary-950) / 0.7) 55%, rgb(var(--color-primary-950) / 0) 100%)'
            : 'radial-gradient(ellipse 52% 44% at 50% 50%, rgb(var(--color-paper-50) / 0.94) 0%, rgb(var(--color-paper-50) / 0.7) 55%, rgb(var(--color-paper-50) / 0) 100%)',
        }}
      />

      <div className="pointer-events-none relative z-40 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="pointer-events-auto flex flex-col items-center">
          <a
            href={ctaHref}
            className={`mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all ${
              dark
                ? 'border-primary-50/15 bg-primary-900/80 text-primary-100 hover:border-accent-500/40 hover:text-accent-300'
                : 'border-primary-900/15 bg-paper/80 text-primary-700 hover:border-accent-500/40 hover:text-accent-600'
            }`}
            style={{ boxShadow: '0 2px 10px rgb(var(--color-primary-600) / 0.06)' }}
          >
            {/* <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
            </span> */}
            {eyebrow}
            <MdiIcon name="arrowRight" className="text-accent" size={0.55} />
          </a>

          <h1
            className={`mb-6 max-w-4xl text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl lg:text-7xl ${
              dark ? 'text-primary-50' : 'text-primary-900'
            }`}
          >
            {lines.map((line, i) => (
              <span
                key={`${line}-${i}`}
                className={`block ${i === lines.length - 1 ? (dark ? 'text-accent-300' : 'text-accent-600') : ''}`}
              >
                {line || ' '}
              </span>
            ))}
          </h1>

          <p
            className={`mb-10 max-w-2xl text-sm leading-relaxed md:text-base ${
              dark ? 'text-primary-200' : 'text-primary-700'
            }`}
          >
            {sub}
          </p>

          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <a
              href={ctaHref}
              className="w-full rounded-md bg-accent-500 px-6 py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-accent-600 sm:w-auto"
              style={{ boxShadow: '0 8px 24px rgb(var(--color-accent-500) / 0.28)' }}
            >
              {cta}
            </a>
            <a
              href={ctaHref}
              className={`flex w-full items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm font-medium backdrop-blur-md transition-colors sm:w-auto ${
                dark
                  ? 'border-primary-50/20 bg-primary-900/80 text-primary-50 hover:border-primary-50/50 hover:bg-primary-800'
                  : 'border-primary-900/20 bg-paper/80 text-primary-900 hover:border-primary-900/50 hover:bg-paper'
              }`}
            >
              <MdiIcon name="document" size={0.7} />
              {secondary}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t to-transparent ${
          dark ? 'from-primary-950' : 'from-paper'
        }`}
      />

      {/* Proof strip — operating commitments, also stated in Stats */}
      <div className="relative z-40 px-4 pb-6">
        <div
          className={`mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] md:text-xs ${
            dark ? 'text-primary-200' : 'text-primary-700'
          }`}
        >
          {proof.map((item, i) => (
            <Fragment key={`${item.value}-${i}`}>
              {i > 0 ? (
                <span
                  aria-hidden
                  className={`hidden h-3 w-px sm:block ${dark ? 'bg-primary-50/20' : 'bg-primary-900/20'}`}
                />
              ) : null}
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    item.ember
                      ? dark
                        ? 'text-accent-300'
                        : 'text-accent-600'
                      : dark
                        ? 'text-primary-50'
                        : 'text-primary-900'
                  }`}
                >
                  {item.value}
                </span>{' '}
                {item.label}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
