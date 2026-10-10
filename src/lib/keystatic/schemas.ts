import { fields } from '@keystatic/core';

/**
 * Keystatic schema factories.
 *
 * Structure:
 * - `layoutFields` — shared chrome (nav, footer, site meta) per locale, edited
 *   via the `layout-<locale>` singletons.
 * - `pageFields` — a page document: title + slug + an ordered list of section
 *   blocks. Section content reuses the same field groups the renderer reads,
 *   so any page can compose sections in any order.
 * - Section field groups are exported individually and also consumed by the
 *   section block definitions.
 *
 * List defaults intentionally live in code (src/lib/content/defaults.ts):
 * Keystatic arrays start empty, and the reader falls back to code defaults
 * when a CMS list is empty.
 */

/* ------------------------------ layout ------------------------------ */

export const layoutFields = {
  brand: fields.text({ label: 'Brand', defaultValue: 'analytt' }),
  brandEmphasis: fields.text({ label: 'Brand emphasis (colored)', defaultValue: 'digital' }),
  logo: fields.object(
    {
      src: fields.text({ label: 'Logo URL (header, top)', defaultValue: '/img/logo-alt.svg' }),
      alt: fields.text({ label: 'Logo alt text', defaultValue: 'Analytt Digital' }),
    },
    { label: 'Logo (header, unscrolled)' },
  ),
  logoAlt: fields.object(
    {
      src: fields.text({ label: 'Logo URL (header, scrolled)', defaultValue: '/img/logo-alt-light.svg' }),
      alt: fields.text({ label: 'Logo alt text', defaultValue: 'Analytt Digital' }),
    },
    { label: 'Logo (header, scrolled)' },
  ),
  navLinks: fields.array(
    fields.object({
      label: fields.text({ label: 'Label' }),
      href: fields.text({ label: 'Href' }),
    }),
    { label: 'Nav links', itemLabel: (props) => props.fields.label.value || 'Link' },
  ),
  navCta: fields.text({ label: 'Nav CTA label', defaultValue: 'Get a free audit' }),
  navCtaHref: fields.text({ label: 'Nav CTA href', defaultValue: '#contact' }),
  footerHeadline: fields.text({
    label: 'Footer closing line',
    defaultValue: 'Ready to see exactly where your growth is hiding?',
    multiline: true,
  }),
  footerCta: fields.text({ label: 'Footer CTA label', defaultValue: 'Start with a free audit' }),
  footerCtaHref: fields.text({ label: 'Footer CTA href', defaultValue: '#contact' }),
  tagline: fields.text({
    label: 'Tagline',
    defaultValue: 'Performance marketing & growth infrastructure, from Nairobi.',
    multiline: true,
  }),
  footnote: fields.text({ label: 'Footnote', defaultValue: 'A measurement-first agency, by design.' }),
  footerColumns: fields.array(
    fields.object({
      title: fields.text({ label: 'Title' }),
      links: fields.array(
        fields.object({
          label: fields.text({ label: 'Label' }),
          href: fields.text({ label: 'Href' }),
        }),
        { label: 'Links', itemLabel: (props) => props.fields.label.value || 'Link' },
      ),
    }),
    { label: 'Footer link columns', itemLabel: (props) => props.fields.title.value || 'Column' },
  ),
  contactEmail: fields.text({ label: 'Contact email', defaultValue: 'hello@analyttdigital.com' }),
  contactNote: fields.text({ label: 'Location note', defaultValue: 'Nairobi · across East Africa' }),
  legal: fields.text({ label: 'Legal line', defaultValue: '© 2026 Analytt Digital. All rights reserved.' }),
};

/* ------------------- icon + media field conventions ----------------
 * Single source of truth for field shape (M2). Rules:
 * - `icon` is a plain text field holding a key from the shared MDI map
 *   (`src/lib/icons/resolve-icon.tsx`).
 *   Empty string means "keep the section's positional default", so legacy
 *   entries and code defaults render exactly as before.
 * - `image` is a plain `{ src, alt }` object — never a Keystatic-managed
 *   asset field. Resolution to `<Image>` happens in components through the
 *   shared media resolver (M3), with empty `src` treated as absent.
 * ---------------------------------------------------------------------- */

export const iconField = (label = 'MDI icon name (e.g. chart — empty keeps default)') =>
  fields.text({ label, defaultValue: '' });

export const imageField = (label = 'Image') =>
  fields.object(
    {
      src: fields.text({ label: 'Image URL', defaultValue: '' }),
      alt: fields.text({ label: 'Alt text', defaultValue: '' }),
    },
    { label },
  );

/* ------------------------- section field groups ---------------------- */

/* Shared shape for one floating result panel (the bak tunnel cards). `kind`
 *  picks the layout, only its fields are read. */
const heroPanelFields = {
  kind: fields.select({
    label: 'Panel layout',
    options: [
      { label: 'Cost per lead (bars)', value: 'cpl' },
      { label: 'Leads (metric)', value: 'leads' },
      { label: 'Revenue (metric)', value: 'revenue' },
      { label: 'SEO rankings (progress)', value: 'seo' },
      { label: '90-day plan (steps)', value: 'process' },
      { label: 'Tracking code', value: 'code' },
      { label: 'Budget leak (notice)', value: 'alert' },
      { label: 'WhatsApp lead (notice)', value: 'whatsapp' },
      { label: 'Simkar (dual metric)', value: 'simkar' },
      { label: 'Blended ROAS (bars)', value: 'roas' },
      { label: 'Attribution (metric)', value: 'attribution' },
      { label: 'Audit score (progress)', value: 'audit' },
      { label: 'Prospecting CTR (bars)', value: 'ctr' },
      { label: 'Landing conversion (metric)', value: 'funnel' },
      { label: 'Partner logo', value: 'partner' },
    ],
    defaultValue: 'cpl',
  }),
  title: fields.text({ label: 'Title' }),
  subtitle: fields.text({ label: 'Subtitle', defaultValue: '' }),
  value: fields.text({ label: 'Big value', defaultValue: '' }),
  valueLabel: fields.text({ label: 'Value label', defaultValue: '' }),
  footer: fields.text({ label: 'Footer line', defaultValue: '' }),
  delta: fields.text({ label: 'Delta (e.g. -84% in 60 days)', defaultValue: '' }),
  icon: iconField(),
  iconTone: fields.select({
    label: 'Icon colour',
    options: [
      { label: 'Layout default', value: 'default' },
      { label: 'Ember', value: 'accent' },
      { label: 'Field', value: 'primary' },
      { label: 'Soft', value: 'muted' },
    ],
    defaultValue: 'default',
  }),
  logo: imageField('Partner logo (partner layout only)'),
  logoDark: imageField('Partner logo on dark (partner layout only)'),
  tone: fields.select({
    label: 'Tone',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Alert (ember border)', value: 'alert' },
    ],
    defaultValue: 'default',
  }),
  bars: fields.array(fields.integer({ label: 'Bar height (0–100)', defaultValue: 50 }), {
    label: 'Bars (bars layout only)',
    itemLabel: (props) => String(props.value ?? ''),
  }),
  progress: fields.integer({ label: 'Progress % (progress layout only)', defaultValue: 85 }),
  metrics: fields.array(
    fields.object({
      value: fields.text({ label: 'Value' }),
      label: fields.text({ label: 'Label' }),
    }),
    { label: 'Metrics (dual layout only)', itemLabel: (props) => props.fields.value.value || 'Metric' },
  ),
  steps: fields.array(
    fields.object({
      label: fields.text({ label: 'Step label' }),
      state: fields.select({
        label: 'State',
        options: [
          { label: 'Done', value: 'done' },
          { label: 'Active', value: 'active' },
          { label: 'Todo', value: 'todo' },
        ],
        defaultValue: 'todo',
      }),
    }),
    { label: 'Steps (steps layout only)', itemLabel: (props) => props.fields.label.value || 'Step' },
  ),
  codeLines: fields.array(fields.text({ label: 'Line', multiline: true }), {
    label: 'Code lines (code layout only)',
    itemLabel: (props) => props.value?.slice(0, 32) || 'Line',
  }),
};

const heroFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'NAIROBI — ACROSS EAST AFRICA' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Ad spend,\nturned into\nmeasurable growth.', multiline: true }),
  sub: fields.text({
    label: 'Subheadline',
    defaultValue:
      'Analytt Digital is a performance marketing partner for startups and small businesses — paid media, measurement and growth strategy, all tracked to revenue.',
    multiline: true,
  }),
  cta: fields.text({ label: 'Primary CTA', defaultValue: 'Start with a free audit' }),
  ctaHref: fields.text({ label: 'Primary CTA href', defaultValue: '#contact' }),
  variant: fields.select({
    label: 'Variant',
    options: [
      { label: 'Light (paper stage)', value: 'light' },
      { label: 'Dark (violet-ink stage)', value: 'dark' },
    ],
    defaultValue: 'light',
  }),
  scrollHint: fields.text({ label: 'Scroll hint', defaultValue: 'Scroll' }),
  dashboardTitle: fields.text({ label: 'Dashboard title', defaultValue: 'Campaign / Live' }),
  dashboardMetric: fields.text({ label: 'Dashboard metric', defaultValue: 'ROAS 4.2×' }),
  statA_label: fields.text({ label: 'Stat A label', defaultValue: 'CPL this month' }),
  statA_value: fields.text({ label: 'Stat A value', defaultValue: 'KES 280' }),
  statA_delta: fields.text({ label: 'Stat A delta', defaultValue: '-84%' }),
  statB_label: fields.text({ label: 'Stat B label', defaultValue: 'Leads / month' }),
  statB_value: fields.text({ label: 'Stat B value', defaultValue: '1,200+' }),
  marquee: fields.array(
    fields.object({
      label: fields.text({ label: 'Label (e.g. Meta Business Partner)' }),
      logo: imageField('Logo'),
      logoDark: imageField('Logo (dark stage)'),
    }),
    { label: 'Partner marquee', itemLabel: (props) => props.fields.label.value || 'Partner' },
  ),
  panels: fields.array(fields.object(heroPanelFields), {
    label: 'Tunnel panels (empty = code defaults)',
    itemLabel: (props) => props.fields.title.value || props.fields.kind.value || 'Panel',
  }),
  proof: fields.array(
    fields.object({
      value: fields.text({ label: 'Value (e.g. 100%)' }),
      label: fields.text({ label: 'Label' }),
      ember: fields.checkbox({ label: 'Ember value (live)', defaultValue: false }),
    }),
    {
      label: 'Proof strip (empty = code defaults)',
      itemLabel: (props) => `${props.fields.value.value || ''} ${props.fields.label.value || ''}`.trim() || 'Item',
    },
  ),
};

const aboutFields = {
  tag: fields.text({ label: 'Tag (e.g. ABOUT US)', defaultValue: 'About Us' }),
  title: fields.text({
    label: 'Headline (keep short — also echoed as the hero-portal bridge copy)',
    defaultValue: 'Data at the heart of every move.',
  }),
  introLead: fields.text({
    label: 'Intro lead (bold)',
    defaultValue: 'Analytt Digital is a performance marketing agency.',
  }),
  description: fields.text({
    label: 'Intro rest',
    defaultValue:
      'We put data at the heart of every move, turning data-driven strategy into measurable growth in a competitive online realm.',
    multiline: true,
  }),
  baseLabel: fields.text({ label: 'Starting-line label', defaultValue: 'Where we started' }),
  axisLeft: fields.text({ label: 'Axis label (left)', defaultValue: 'Raw signals' }),
  axisRight: fields.text({ label: 'Axis label (right)', defaultValue: 'Measured growth' }),
  moveLabel: fields.text({ label: 'Readout label (move)', defaultValue: 'The move' }),
  resultLabel: fields.text({ label: 'Readout label (result)', defaultValue: 'What we measured' }),
  hint: fields.text({
    label: 'Plot hint',
    defaultValue: 'Select a point on the line to see the decision behind it.',
  }),
  moves: fields.array(
    fields.object({
      x: fields.number({ label: 'Position on the line (0–1)', defaultValue: 0.5 }),
      move: fields.text({ label: 'The move', multiline: true }),
      result: fields.text({ label: 'What we measured', multiline: true }),
    }),
    { label: 'Plot points', itemLabel: (props) => props.fields.move.value?.slice(0, 40) || 'Point' },
  ),
};

const problemFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'The Problem' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'The spend was never the problem.' }),
  paragraphs: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
    label: 'Paragraphs',
    itemLabel: (props) => props.value?.slice(0, 48) || 'Paragraph',
  }),
  closing: fields.text({ label: 'Closing line', defaultValue: 'Analytt exists to close that gap.' }),
  panelTitle: fields.text({ label: 'Sonar panel title', defaultValue: 'Account snapshot' }),
  panelAlert: fields.text({ label: 'Sonar panel alert', defaultValue: 'Wasting −38%' }),
  panelChips: fields.array(
    fields.object({
      label: fields.text({ label: 'Label' }),
      value: fields.text({ label: 'Value' }),
    }),
    { label: 'Sonar chips', itemLabel: (props) => props.fields.label.value || 'Chip' },
  ),
};

const beliefFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Our Philosophy' }),
  headline: fields.text({ label: 'Headline', defaultValue: "Data is not a dashboard, it's your" }),
  headlineAccent: fields.text({ label: 'Headline accent (ember)', defaultValue: 'competitive edge.' }),
  lede: fields.text({
    label: 'Intro paragraph',
    defaultValue:
      'We harness the power of data to inform and optimise every aspect of our clients’ marketing across Kenya and East Africa.',
    multiline: true,
  }),
  terrain: fields.object(
    {
      title: fields.text({ label: 'Card title', defaultValue: 'When your customers actually convert' }),
      caption: fields.text({ label: 'Card caption', defaultValue: '', multiline: true }),
      metricGroupLabel: fields.text({ label: 'Metric group label', defaultValue: 'Metric' }),
      viewGroupLabel: fields.text({ label: 'Camera group label', defaultValue: 'Camera view' }),
      perspectiveLabel: fields.text({ label: 'Perspective label', defaultValue: 'Perspective' }),
      topLabel: fields.text({ label: 'Top view label', defaultValue: 'Top view' }),
      resetLabel: fields.text({ label: 'Reset view label', defaultValue: 'Reset view' }),
      clearLabel: fields.text({ label: 'Clear-selection label', defaultValue: 'Clear selection' }),
      canvasLabel: fields.text({ label: 'Canvas accessible label', defaultValue: '', multiline: true }),
      hintTouch: fields.text({ label: 'Touch hint', defaultValue: '' }),
      hintDesktop: fields.text({ label: 'Desktop hint', defaultValue: '' }),
      statsNote: fields.text({ label: 'Stats note (e.g. vs last week)', defaultValue: 'vs last week' }),
      avgNote: fields.text({ label: 'Average note', defaultValue: 'on average' }),
      belowNote: fields.text({ label: 'Below-average note', defaultValue: 'below the week average' }),
      betweenNote: fields.text({ label: 'Work-hours note', defaultValue: 'between 08:00 and 18:00' }),
      tableCaption: fields.text({ label: 'Data-table caption', defaultValue: 'Hourly values by day of the week' }),
      days: fields.array(fields.text({ label: 'Day' }), {
        label: 'Axis day labels (7)',
        itemLabel: (props) => props.value || 'Day',
      }),
      dayNames: fields.array(fields.text({ label: 'Day' }), {
        label: 'Full day names (7)',
        itemLabel: (props) => props.value || 'Day',
      }),
      metrics: fields.array(
        fields.object({
          key: fields.select({
            label: 'Dataset',
            options: [
              { label: 'Leads', value: 'leads' },
              { label: 'Ad clicks', value: 'clicks' },
              { label: 'Cost per lead', value: 'cpl' },
            ],
            defaultValue: 'leads',
          }),
          label: fields.text({ label: 'Tab label' }),
          title: fields.text({ label: 'Stats title' }),
          peakLabel: fields.text({ label: 'Peak stat label' }),
          dayLabel: fields.text({ label: 'Best-day stat label' }),
          noun: fields.text({ label: 'Noun (e.g. leads)' }),
          lessLabel: fields.text({ label: 'Legend “low” end', defaultValue: 'Fewer' }),
          moreLabel: fields.text({ label: 'Legend “high” end', defaultValue: 'More' }),
          delta: fields.number({ label: 'Week delta %', defaultValue: 0 }),
        }),
        { label: 'Metrics', itemLabel: (props) => props.fields.label.value || 'Metric' },
      ),
    },
    { label: 'Activity terrain' },
  ),
};

const barToneField = (label = 'Bar tone') =>
  fields.select({
    label,
    options: [
      { label: 'Soft', value: 'soft' },
      { label: 'Mid', value: 'mid' },
      { label: 'Deep', value: 'deep' },
      { label: 'Field', value: 'field' },
      { label: 'Ember', value: 'ember' },
    ],
    defaultValue: 'mid',
  });

const processFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Our Process' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'A rigorous, data-driven process,' }),
  headlineAccent: fields.text({ label: 'Headline accent (ember)', defaultValue: 'from day one to compounding growth.' }),
  lede: fields.text({ label: 'Intro paragraph', defaultValue: '', multiline: true }),
  chapterTitle: fields.text({ label: 'Legacy rail title (unused)', defaultValue: '' }),
  cardTitle: fields.text({ label: 'Card title', defaultValue: 'Five steps, one system' }),
  cardSub: fields.text({ label: 'Card subtitle', defaultValue: 'Pick a step, or let it play through.' }),
  playLabel: fields.text({ label: 'Play label', defaultValue: 'Play' }),
  pauseLabel: fields.text({ label: 'Pause label', defaultValue: 'Pause' }),
  stepOfTemplate: fields.text({ label: 'Step counter (use {n} and {total})', defaultValue: 'Step {n} of {total}' }),
  illustrativeNote: fields.text({ label: 'Visual note', defaultValue: 'Illustrative' }),
  dwellMs: fields.integer({ label: 'Autoplay hold per step (ms)', defaultValue: 7000 }),
  steps: fields.array(
    fields.object({
      n: fields.text({ label: 'Index (e.g. 01)' }),
      title: fields.text({ label: 'Title' }),
      desc: fields.text({ label: 'Description', multiline: true }),
      chips: fields.array(fields.text({ label: 'Chip' }), {
        label: 'Chips',
        itemLabel: (props) => props.value || 'Chip',
      }),
      visual: fields.object(
        {
          kind: fields.select({
            label: 'Visual',
            options: [
              { label: 'Funnel with leak', value: 'funnel' },
              { label: 'Channel mix + targets', value: 'channels' },
              { label: 'Launch checklist', value: 'checklist' },
              { label: 'Weekly bars', value: 'weekly' },
              { label: 'Scale bars + markets', value: 'scale' },
            ],
            defaultValue: 'funnel',
          }),
          title: fields.text({ label: 'Visual eyebrow (weekly/scale)', defaultValue: '' }),
          leakNote: fields.text({ label: 'Leak caption (funnel)', defaultValue: '' }),
          rows: fields.array(
            fields.object({
              label: fields.text({ label: 'Label' }),
              width: fields.integer({ label: 'Width % (0–100)', defaultValue: 50 }),
              tone: barToneField(),
            }),
            { label: 'Funnel rows', itemLabel: (props) => props.fields.label.value || 'Row' },
          ),
          mixTitle: fields.text({ label: 'Mix title (channels)', defaultValue: '' }),
          channels: fields.array(
            fields.object({
              label: fields.text({ label: 'Channel' }),
              pct: fields.integer({ label: 'Share %', defaultValue: 25 }),
              tone: barToneField(),
            }),
            { label: 'Channels', itemLabel: (props) => props.fields.label.value || 'Channel' },
          ),
          targetsTitle: fields.text({ label: 'Targets title (channels)', defaultValue: '' }),
          targets: fields.array(fields.text({ label: 'Target' }), {
            label: 'Targets',
            itemLabel: (props) => props.value?.slice(0, 32) || 'Target',
          }),
          items: fields.array(fields.text({ label: 'Item' }), {
            label: 'Checklist items',
            itemLabel: (props) => props.value?.slice(0, 32) || 'Item',
          }),
          doneNote: fields.text({ label: 'Done row note (checklist)', defaultValue: '' }),
          doneTag: fields.text({ label: 'Done row tag (checklist)', defaultValue: '' }),
          values: fields.array(fields.integer({ label: 'Value', defaultValue: 50 }), {
            label: 'Bar values (weekly/scale)',
            itemLabel: (props) => String(props.value ?? ''),
          }),
          winnerNote: fields.text({ label: 'Winner badge (weekly)', defaultValue: '' }),
          tags: fields.array(fields.text({ label: 'Tag' }), {
            label: 'Market tags (scale)',
            itemLabel: (props) => props.value || 'Tag',
          }),
        },
        { label: 'Step visual' },
      ),
    }),
    { label: 'Process steps', itemLabel: (props) => props.fields.title.value || 'Step' },
  ),
  closing: fields.text({ label: 'Closing line', defaultValue: '', multiline: true }),
  cta: fields.text({ label: 'CTA label', defaultValue: 'Request Digital Audit' }),
  ctaHref: fields.text({ label: 'CTA href', defaultValue: '/#contact' }),
};

const capabilityReadoutFields = {
  kind: fields.select({
    label: 'Figure',
    options: [
      { label: 'Channels — spend vs attributed return', value: 'channels' },
      { label: 'Attribution — unknown share before/after', value: 'attribution' },
      { label: 'Descent — CPL against a target', value: 'descent' },
      { label: 'Organic — sessions building over time', value: 'organic' },
    ],
    defaultValue: 'channels',
  }),
  caption: fields.text({ label: 'Caption above the figure', defaultValue: '' }),
  value: fields.text({ label: 'Measurement (e.g. 4.2x)', defaultValue: '' }),
  valueLabel: fields.text({ label: 'Measurement label', defaultValue: '' }),
  tag: fields.text({ label: 'Live tag (empty = no live state)', defaultValue: '' }),
  values: fields.array(fields.number({ label: 'Value', defaultValue: 0 }), {
    label: 'Series',
    itemLabel: (props) => String(props.value ?? ''),
  }),
  prior: fields.array(fields.number({ label: 'Value', defaultValue: 0 }), {
    label: 'Comparison series (attribution before, prior organic period)',
    itemLabel: (props) => String(props.value ?? ''),
  }),
  labels: fields.array(fields.text({ label: 'Label' }), {
    label: 'Series labels (channel names, share names)',
    itemLabel: (props) => props.value || '',
  }),
  targetLabel: fields.text({ label: 'Target line label (descent only)', defaultValue: '' }),
  target: fields.number({ label: 'Target value in the series (descent only)', defaultValue: 0 }),
};

const capabilitiesFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Our Services' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Performance-led services,\nmeasured to the shilling.', multiline: true }),
  lede: fields.text({
    label: 'Lede',
    defaultValue: 'Four things we are hired for, and the order they happen in.',
    multiline: true,
  }),
  orderLabel: fields.text({ label: 'Order control label', defaultValue: 'Reading order' }),
  orderServices: fields.text({ label: 'Order — by service', defaultValue: 'By service' }),
  orderSequence: fields.text({ label: 'Order — by engagement', defaultValue: 'By engagement' }),
  illustrativeNote: fields.text({
    label: 'Figure note',
    defaultValue: 'Figures are illustrative samples of a measured account, not client results.',
    multiline: true,
  }),
  items: fields.array(
    fields.object({
      tag: fields.text({ label: 'Tag' }),
      depth: fields.text({ label: 'Index in the engagement order (e.g. 01)', defaultValue: '' }),
      title: fields.text({ label: 'Title' }),
      body: fields.text({ label: 'Body', multiline: true }),
      icon: iconField(),
      readout: fields.object(capabilityReadoutFields, {
        label: 'Readout figure (optional — empty renders the row without one)',
      }),
    }),
    { label: 'Capabilities', itemLabel: (props) => props.fields.title.value || 'Capability' },
  ),
};

const workFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Selected Work' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Proof, not promises.', multiline: true }),
  body: fields.text({
    label: 'Intro paragraph',
    defaultValue: 'Engagements measured to the shilling — the proof behind the promises.',
    multiline: true,
  }),
  cta: fields.text({ label: 'CTA label (empty hides it)', defaultValue: 'View cases' }),
  ctaHref: fields.text({ label: 'CTA href', defaultValue: '#' }),
  cases: fields.array(
    fields.object({
      client: fields.text({ label: 'Client' }),
      industry: fields.text({ label: 'Industry' }),
      depth: fields.text({ label: 'Index (e.g. Case 01)', defaultValue: '' }),
      tag: fields.text({ label: 'Badge (e.g. NEW — empty hides it)', defaultValue: '' }),
      headline: fields.text({ label: 'Result headline', multiline: true }),
      body: fields.text({ label: 'Body', multiline: true }),
      metric: fields.text({ label: 'Big metric' }),
      metricLabel: fields.text({ label: 'Metric label' }),
      image: imageField('Case image (optional — empty keeps the generated graphic)'),
    }),
    { label: 'Case studies', itemLabel: (props) => props.fields.client.value || 'Case' },
  ),
};

const statsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'By the Numbers' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'How we work,\nin four numbers.', multiline: true }),
  body: fields.text({
    label: 'Body',
    defaultValue:
      'No vanity metrics. Every engagement is tracked to conversion, reviewed weekly, and reported in plain language.',
    multiline: true,
  }),
  stats: fields.array(
    fields.object({
      value: fields.text({ label: 'Value' }),
      label: fields.text({ label: 'Label' }),
      icon: iconField(),
    }),
    { label: 'Stats', itemLabel: (props) => props.fields.value.value || 'Stat' },
  ),
};

const industriesFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Industries' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Sectors we know.' }),
  body: fields.text({
    label: 'Body',
    defaultValue:
      'From e-commerce in Nairobi to logistics across the region — where we have done the work.',
    multiline: true,
  }),
  hint: fields.text({ label: 'Hint line', defaultValue: 'Selected sectors' }),
  image: imageField('Backdrop image (filled — empty hides it)'),
  items: fields.array(fields.text({ label: 'Industry' }), {
    label: 'Industries',
    itemLabel: (props) => props.value,
  }),
};

const insightsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Insights' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Notes from the work.' }),
  articles: fields.array(
    fields.object({
      index: fields.text({ label: 'Index', defaultValue: '01' }),
      title: fields.text({ label: 'Title' }),
      description: fields.text({ label: 'Description', multiline: true }),
      href: fields.text({ label: 'Link href' }),
    }),
    { label: 'Articles', itemLabel: (props) => props.fields.title.value || 'Article' },
  ),
};

const ctaFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Start' }),
  headline: fields.text({
    label: 'Headline',
    defaultValue: 'Most audits surface KES 50K–200K in recoverable spend.',
    multiline: true,
  }),
  body: fields.text({
    label: 'Body',
    defaultValue:
      'A free audit of your current setup — where budget is wasted and where the opportunity is. No obligation.',
    multiline: true,
  }),
  cta: fields.text({ label: 'CTA label', defaultValue: 'Request a free audit' }),
  ctaHref: fields.text({ label: 'CTA href', defaultValue: 'mailto:hello@analyttdigital.com' }),
  note: fields.text({ label: 'Small note', defaultValue: 'No deck. No obligation. Just the findings.' }),
  portalLabel: fields.text({ label: 'Portal label', defaultValue: 'Free · No commitment' }),
};

/* --------------------------- page document --------------------------- */

/**
 * A page is an ordered list of section blocks. `discriminant` switches the
 * form + stored shape per block; the renderer maps `type` to a component.
 */
export const pageFields = {
  title: fields.text({ label: 'Page title' }),
  description: fields.text({ label: 'Meta description', multiline: true }),
  sections: fields.array(
    fields.conditional(fields.select({
      label: 'Section type',
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'About', value: 'about' },
        { label: 'Problem', value: 'problem' },
        { label: 'Belief', value: 'belief' },
        { label: 'Process', value: 'process' },
        { label: 'Capabilities', value: 'capabilities' },
        { label: 'Work', value: 'work' },
        { label: 'Stats', value: 'stats' },
        { label: 'Industries', value: 'industries' },
        { label: 'Insights', value: 'insights' },
        { label: 'CTA', value: 'cta' },
      ],
      defaultValue: 'hero',
    }), {
      hero: fields.object(heroFields, { label: 'Hero content' }),
      about: fields.object(aboutFields, { label: 'About content' }),
      problem: fields.object(problemFields, { label: 'Problem content' }),
      belief: fields.object(beliefFields, { label: 'Belief content' }),
      process: fields.object(processFields, { label: 'Process content' }),
      capabilities: fields.object(capabilitiesFields, { label: 'Capabilities content' }),
      work: fields.object(workFields, { label: 'Work content' }),
      stats: fields.object(statsFields, { label: 'Stats content' }),
      industries: fields.object(industriesFields, { label: 'Industries content' }),
      insights: fields.object(insightsFields, { label: 'Insights content' }),
      cta: fields.object(ctaFields, { label: 'CTA content' }),
    }),
    {
      label: 'Sections',
      itemLabel: (props) => {
        const disc = props.discriminant as string;
        const titleField = (props.value as Record<string, { fields?: Record<string, { value?: string }> }>)?.[disc];
        const first = titleField?.fields?.headline?.value ?? titleField?.fields?.eyebrow?.value;
        return `${disc}${first ? ` — ${String(first).slice(0, 36)}` : ''}`;
      },
    },
  ),
};
