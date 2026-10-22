import { component, fields } from '@keystatic/core';
import { createElement } from 'react';

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
      children: fields.array(
        fields.object({
          label: fields.text({ label: 'Label' }),
          href: fields.text({ label: 'Href' }),
        }),
        { label: 'Submenu links (empty = plain link)', itemLabel: (props) => props.fields.label.value || 'Link' },
      ),
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
  socialTitle: fields.text({ label: 'Social rail title', defaultValue: 'Follow the signal' }),
  socialLinks: fields.array(
    fields.object({
      label: fields.text({ label: 'Label (e.g. LinkedIn)' }),
      href: fields.text({ label: 'URL or tel: link' }),
      // Icon-name string resolved through the shared MDI resolver in
      // components — same convention as the section `iconField`.
      icon: fields.text({ label: 'Icon name (e.g. linkedin, musicNote for TikTok, phone)' }),
    }),
    { label: 'Social / contact links', itemLabel: (props) => props.fields.label.value || 'Link' },
  ),
  contactEmail: fields.text({ label: 'Contact email', defaultValue: 'hello@analyttdigital.com' }),
  contactNote: fields.text({ label: 'Location note', defaultValue: 'Nairobi · across East Africa' }),
  legal: fields.text({ label: 'Legal line', defaultValue: '© 2026 Analytt Digital. All rights reserved.' }),
};

/* ------------------- icon + media field conventions ----------------
 * Single source of truth for field shape (M2, upload-backed M7). Rules:
 * - `icon` is a plain text field holding a key from the shared MDI map
 *   (`src/lib/icons/resolve-icon.tsx`).
 *   Empty string means "keep the section's positional default", so legacy
 *   entries and code defaults render exactly as before.
 * - `image` is a `{ src, alt }` object where `src` is a Keystatic-managed
 *   upload (`fields.image` → `public/media/uploads`, served from
 *   `/media/uploads/`). Resolution to `<Image>` happens in components
 *   through the shared media resolver (M3), with empty/missing `src`
 *   treated as absent — so legacy `/img/...` text URLs and remote URLs
 *   stay render-safe (`MediaSlot` placeholder / `unoptimized`).
 * ---------------------------------------------------------------------- */

/** Upload-backed image asset: file lands in `public/media/uploads`, the
 *  stored YAML value is the `/media/uploads/...` front-end path. */
export const uploadImageField = (label = 'Image file') =>
  fields.image({ label, directory: 'public/media/uploads', publicPath: '/media/uploads/' });

/** Upload-backed generic file asset (M8+ post attachments, etc.). */
export const uploadFileField = (label = 'File') =>
  fields.file({ label, directory: 'public/media/uploads', publicPath: '/media/uploads/' });

export const iconField = (label = 'MDI icon name (e.g. chart — empty keeps default)') =>
  fields.text({ label, defaultValue: '' });

export const imageField = (label = 'Image') =>
  fields.object(
    {
      // Upload-backed (M7): CMS stores `/media/uploads/...`; legacy text
      // URLs (`/img/...`, remote) read back as the same string shape, so
      // `DynamicImage`/`MediaSlot` and the reader merge need no changes.
      src: uploadImageField('Image file (upload — blank keeps the default)'),
      alt: fields.text({ label: 'Alt text', defaultValue: '' }),
    },
    { label },
  );

/** Shared, optional search and social metadata. Blank text fields deliberately
 * defer to the content-layer fallback; this keeps existing entries complete
 * while letting editors override an individual tag when needed. */
export const seoFields = {
  metaTitle: fields.text({ label: 'SEO title (blank uses page/post title)', defaultValue: '' }),
  metaDescription: fields.text({ label: 'SEO description (blank uses summary)', defaultValue: '', multiline: true }),
  canonical: fields.text({ label: 'Canonical URL (blank uses this page URL)', defaultValue: '' }),
  ogImage: imageField('Social share image (blank uses featured image)'),
  noindex: fields.checkbox({ label: 'Prevent search indexing', defaultValue: false }),
};

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

const processFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Our Process' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'A rigorous, data-driven process,' }),
  headlineAccent: fields.text({ label: 'Headline accent (ember)', defaultValue: 'from day one to compounding growth.' }),
  lede: fields.text({ label: 'Intro paragraph', defaultValue: '', multiline: true }),
  cardTitle: fields.text({ label: 'Card title', defaultValue: 'Five steps, one system' }),
  steps: fields.array(
    fields.object({
      n: fields.text({ label: 'Index (e.g. 01)' }),
      title: fields.text({ label: 'Title' }),
      desc: fields.text({ label: 'Description', multiline: true }),
      chips: fields.array(fields.text({ label: 'Chip' }), {
        label: 'Chips',
        itemLabel: (props) => props.value || 'Chip',
      }),
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

const regionsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Where we work' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Serving Kenya, East Africa, and beyond.' }),
  body: fields.text({
    label: 'Body',
    defaultValue: 'Clients across Kenya, East Africa, and global brands entering African markets.',
    multiline: true,
  }),
  hint: fields.text({ label: 'Hint line', defaultValue: 'Regions we serve' }),
  items: fields.array(fields.text({ label: 'Region' }), {
    label: 'Regions',
    itemLabel: (props) => props.value?.slice(0, 48) || 'Region',
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

/* ---------------- M1 content-page section field groups --------------- */

const pageHeroFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Analytt Digital' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Page headline.', multiline: true }),
  lede: fields.text({ label: 'Lede', defaultValue: '', multiline: true }),
  quote: fields.text({ label: 'Pull quote (empty hides it)', defaultValue: '', multiline: true }),
  cta: fields.text({ label: 'Primary CTA (empty hides it)', defaultValue: '' }),
  ctaHref: fields.text({ label: 'Primary CTA href', defaultValue: '' }),
  secondaryCta: fields.text({ label: 'Secondary CTA (empty hides it)', defaultValue: '' }),
  secondaryCtaHref: fields.text({ label: 'Secondary CTA href', defaultValue: '' }),
};

const teamGridFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Team' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Meet the team.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  members: fields.array(
    fields.object({
      name: fields.text({ label: 'Name' }),
      role: fields.text({ label: 'Role' }),
      body: fields.text({ label: 'Bio', multiline: true }),
      icon: iconField(),
      image: imageField('Photo (optional — empty keeps the initial tile)'),
    }),
    { label: 'Members', itemLabel: (props) => props.fields.name.value || 'Member' },
  ),
};

const contactChannelsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Contact' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Get in touch.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  channels: fields.array(
    fields.object({
      label: fields.text({ label: 'Label (e.g. Call or WhatsApp)' }),
      value: fields.text({ label: 'Value (e.g. +254 784 488 542)' }),
      href: fields.text({ label: 'Href (tel:, mailto:, or URL)' }),
      note: fields.text({ label: 'Note (empty hides it)', defaultValue: '', multiline: true }),
      icon: iconField(),
    }),
    { label: 'Channels', itemLabel: (props) => props.fields.label.value || 'Channel' },
  ),
};

const formShellFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Message us' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'General inquiries.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  submitLabel: fields.text({ label: 'Submit label', defaultValue: 'Send message' }),
  fallbackHref: fields.text({ label: 'Fallback href', defaultValue: 'mailto:hello@analyttdigital.com' }),
  fallbackLabel: fields.text({ label: 'Fallback label', defaultValue: 'Or email us directly' }),
  note: fields.text({ label: 'Note (empty hides it)', defaultValue: '', multiline: true }),
  fields: fields.array(
    fields.object({
      name: fields.text({ label: 'Field name' }),
      label: fields.text({ label: 'Field label' }),
      kind: fields.select({
        label: 'Field kind',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Textarea', value: 'textarea' },
          { label: 'Select', value: 'select' },
          { label: 'Radio buttons', value: 'radio' },
          { label: 'Checkboxes', value: 'checkboxes' },
        ],
        defaultValue: 'text',
      }),
      options: fields.array(
        fields.object({
          value: fields.text({ label: 'Option value' }),
          label: fields.text({ label: 'Option label' }),
        }),
        { label: 'Options', itemLabel: (props) => props.fields.label.value || 'Option' },
      ),
      dependsOn: fields.text({ label: 'Show when field name (optional)', defaultValue: '' }),
      dependsOnValue: fields.text({ label: 'Show when field value (optional)', defaultValue: '' }),
    }),
    { label: 'Fields', itemLabel: (props) => props.fields.label.value || 'Field' },
  ),
};

const faqFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'FAQ' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Questions, answered.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  items: fields.array(
    fields.object({
      question: fields.text({ label: 'Question' }),
      answer: fields.text({ label: 'Answer', multiline: true }),
    }),
    { label: 'Questions', itemLabel: (props) => props.fields.question.value?.slice(0, 48) || 'Question' },
  ),
};

const pricingTiersFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Plans' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Plans for every stage.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  note: fields.text({ label: 'Note (empty hides it)', defaultValue: '', multiline: true }),
  tiers: fields.array(
    fields.object({
      name: fields.text({ label: 'Name' }),
      tagline: fields.text({ label: 'Tagline' }),
      body: fields.text({ label: 'Body', multiline: true }),
      cta: fields.text({ label: 'CTA label', defaultValue: 'Choose plan' }),
      ctaHref: fields.text({ label: 'CTA href', defaultValue: '/contact/' }),
      bestFor: fields.text({ label: 'Best for (empty hides it)', defaultValue: '' }),
      featured: fields.checkbox({ label: 'Featured (most popular)', defaultValue: false }),
      features: fields.array(fields.text({ label: 'Feature' }), {
        label: 'Features',
        itemLabel: (props) => props.value?.slice(0, 48) || 'Feature',
      }),
    }),
    { label: 'Tiers', itemLabel: (props) => props.fields.name.value || 'Tier' },
  ),
};

const compareTableFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Compare' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Compare plans at a glance.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  columns: fields.array(fields.text({ label: 'Column' }), {
    label: 'Columns (first is the feature column)',
    itemLabel: (props) => props.value || 'Column',
  }),
  rows: fields.array(
    fields.object({
      feature: fields.text({ label: 'Feature' }),
      cells: fields.array(fields.text({ label: 'Cell' }), {
        label: 'Cells (one per plan column)',
        itemLabel: (props) => props.value?.slice(0, 32) || 'Cell',
      }),
    }),
    { label: 'Rows', itemLabel: (props) => props.fields.feature.value?.slice(0, 48) || 'Row' },
  ),
};

const exclusionsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Honest scope' }),
  headline: fields.text({ label: 'Headline', defaultValue: "What's not included." }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  note: fields.text({ label: 'Note (empty hides it)', defaultValue: '', multiline: true }),
  items: fields.array(
    fields.object({
      title: fields.text({ label: 'Title' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
    { label: 'Exclusions', itemLabel: (props) => props.fields.title.value?.slice(0, 48) || 'Item' },
  ),
};

const planPickerFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Find your fit' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Which plan is right for you?' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  options: fields.array(
    fields.object({
      value: fields.text({ label: 'Value (plan key)' }),
      label: fields.text({ label: 'Label' }),
      hint: fields.text({ label: 'Hint (empty hides it)', defaultValue: '', multiline: true }),
    }),
    { label: 'Options', itemLabel: (props) => props.fields.label.value || 'Option' },
  ),
  cta: fields.text({ label: 'CTA label', defaultValue: 'Book a free audit' }),
  ctaHref: fields.text({ label: 'CTA href', defaultValue: '/digital-audit/' }),
  note: fields.text({ label: 'Note (empty hides it)', defaultValue: '', multiline: true }),
};

const leakListFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Common mistakes we fix' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Six leaks we plug first.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  items: fields.array(
    fields.object({
      title: fields.text({ label: 'Title' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
    { label: 'Leaks', itemLabel: (props) => props.fields.title.value?.slice(0, 48) || 'Leak' },
  ),
  closing: fields.text({ label: 'Closing line', defaultValue: '', multiline: true }),
};

const testimonialFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Client voices' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Results our clients feel.' }),
  body: fields.text({ label: 'Body', defaultValue: '', multiline: true }),
  items: fields.array(
    fields.object({
      quote: fields.text({ label: 'Quote', multiline: true }),
      name: fields.text({ label: 'Name' }),
      role: fields.text({ label: 'Role (empty hides it)', defaultValue: '' }),
    }),
    { label: 'Testimonials', itemLabel: (props) => props.fields.name.value || 'Testimonial' },
  ),
};

/* ------------------------- M8 blog post fields ------------------------ */
/* Convention: `slug` is the bare URL segment (`/blog/<slug>`). `body` is a
 * `fields.document` (deprecated upstream, but `fields.mdx` needs a pipeline
 * that is not installed): headings/lists/links/dividers/tables plus M7
 * upload-backed images, and an `embed` block for video/iframe. In
 * `markdown`-format collections the document is the file body, the rest is
 * frontmatter. Rendered by `DocumentRenderer` in `blog-post.tsx`. */

/** Video/iframe insert for post bodies. The preview stays dependency-free
 *  (`createElement`, no JSX — this file is `.ts`); the front-end renderer in
 *  `blog-post.tsx` normalises YouTube/Vimeo URLs to their player form. */
const embedBlock = component({
  label: 'Embed (video / iframe)',
  schema: {
    url: fields.text({ label: 'Embed URL (YouTube, Vimeo, or iframe src)' }),
    caption: fields.text({ label: 'Caption (empty hides it)', defaultValue: '' }),
  },
  preview: (props) =>
    createElement(
      'div',
      null,
      String((props.fields as { url: { value: unknown } }).url.value || 'Embed — no URL yet'),
    ),
});

/** Tinted aside for key takeaways. Rendered as an accent-washed panel
 *  in `blog-post.tsx`; empty title/body counts as empty in the reader. */
const calloutBlock = component({
  label: 'Callout',
  schema: {
    title: fields.text({ label: 'Title (empty hides it)', defaultValue: '' }),
    body: fields.text({ label: 'Body', multiline: true }),
  },
  preview: (props) =>
    createElement(
      'div',
      null,
      String((props.fields as { title: { value: unknown } }).title.value || 'Callout'),
    ),
});

export const postFields = {
  title: fields.text({ label: 'Title' }),
  // Auto-generating slug: typing the name fills the slug (still editable).
  // Reads back as a plain string, so the reader/defaults shape is unchanged.
  slug: fields.slug({
    name: {
      label: 'Title for the slug',
      description: 'Repeat the post title here — the slug below generates from it.',
    },
  }),
  excerpt: fields.text({ label: 'Excerpt (card summary + meta description)', multiline: true }),
  category: fields.text({ label: 'Category', defaultValue: '' }),
  publishedAt: fields.date({ label: 'Publish date', defaultValue: { kind: 'today' } }),
  author: fields.text({ label: 'Author', defaultValue: 'Analytt Digital' }),
  featuredImage: imageField('Featured image (empty hides the figure)'),
  ...seoFields,
  body: fields.document({
    label: 'Body',
    formatting: {
      headingLevels: [1, 2, 3, 4, 5, 6],
      inlineMarks: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        code: true,
        superscript: true,
        subscript: true,
        keyboard: true,
      },
      listTypes: { ordered: true, unordered: true },
      alignment: { center: true, end: true },
      blockTypes: { blockquote: true, code: true },
      softBreaks: true,
    },
    links: true,
    dividers: true,
    tables: true,
    images: {
      directory: 'public/media/uploads',
      publicPath: '/media/uploads/',
    },
    componentBlocks: { embed: embedBlock, callout: calloutBlock },
  }),
};

/* --------------------------- page document --------------------------- */

/**
 * A page is an ordered list of section blocks. `discriminant` switches the
 * form + stored shape per block; the renderer maps `type` to a component.
 */
export const pageFields = {
  title: fields.text({ label: 'Page title' }),
  description: fields.text({ label: 'Meta description', multiline: true }),
  // Page-level social/preview image. Same `{ src, alt }` upload object as
  // posts; empty `src` hides the image (and the reader defers to the code
  // default, which is empty for every page).
  featuredImage: imageField('Featured image (empty hides it)'),
  ...seoFields,
  sections: fields.array(
    fields.conditional(fields.select({
      label: 'Section type',
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'About', value: 'about' },
        { label: 'Problem', value: 'problem' },
        { label: 'Problem alt', value: 'problem-alt' },
        { label: 'Belief', value: 'belief' },
        { label: 'Belief alt', value: 'belief-alt' },
        { label: 'Process', value: 'process' },
        { label: 'Process alt', value: 'process-alt' },
        { label: 'How we work', value: 'how-we-work' },
        { label: 'Next steps', value: 'next-steps' },
        { label: 'Booking flow', value: 'booking-flow' },
        { label: 'Capabilities', value: 'capabilities' },
        { label: 'Capabilities alt', value: 'capabilities-alt' },
        { label: 'Work', value: 'work' },
        { label: 'Work alt', value: 'work-alt' },
        { label: 'Stats', value: 'stats' },
        { label: 'Stats alt', value: 'stats-alt' },
        { label: 'Industries', value: 'industries' },
        { label: 'Regions', value: 'regions' },
        { label: 'Industries alt', value: 'industries-alt' },
        { label: 'Insights', value: 'insights' },
        { label: 'Insights alt', value: 'insights-alt' },
        { label: 'CTA', value: 'cta' },
        { label: 'CTA alt', value: 'cta-alt' },
        { label: 'CTA banner', value: 'cta-banner' },
        { label: 'CTA split', value: 'cta-split' },
        { label: 'Page hero', value: 'page-hero' },
        { label: 'Page hero alt', value: 'page-hero-alt' },
        { label: 'Team grid', value: 'team-grid' },
        { label: 'Team grid alt', value: 'team-grid-alt' },
        { label: 'Contact channels', value: 'contact-channels' },
        { label: 'Contact channels alt', value: 'contact-channels-alt' },
        { label: 'Form shell', value: 'form-shell' },
        { label: 'Form shell alt', value: 'form-shell-alt' },
        { label: 'FAQ', value: 'faq' },
        { label: 'FAQ alt', value: 'faq-alt' },
        { label: 'Pricing tiers', value: 'pricing-tiers' },
        { label: 'Pricing tiers alt', value: 'pricing-tiers-alt' },
        { label: 'Compare table', value: 'compare-table' },
        { label: 'Compare table alt', value: 'compare-table-alt' },
        { label: 'Exclusions', value: 'exclusions' },
        { label: 'Exclusions alt', value: 'exclusions-alt' },
        { label: 'Plan picker', value: 'plan-picker' },
        { label: 'Plan picker alt', value: 'plan-picker-alt' },
        { label: 'Leak list', value: 'leak-list' },
        { label: 'Testimonials', value: 'testimonials' },
      ],
      defaultValue: 'hero',
    }), {
      hero: fields.object(heroFields, { label: 'Hero content' }),
      about: fields.object(aboutFields, { label: 'About content' }),
      problem: fields.object(problemFields, { label: 'Problem content' }),
      // Alt variants share their base's content shape — same fields,
      // different presentation (see the `-alt` components).
      'problem-alt': fields.object(problemFields, { label: 'Problem alt content' }),
      belief: fields.object(beliefFields, { label: 'Belief content' }),
      'belief-alt': fields.object(beliefFields, { label: 'Belief alt content' }),
      process: fields.object(processFields, { label: 'Process content' }),
      // The alt variant shares the process content shape — same fields,
      // static card presentation (no scroll-driven stage).
      'process-alt': fields.object(processFields, { label: 'Process alt content' }),
      'how-we-work': fields.object(processFields, { label: 'How we work content' }),
      'next-steps': fields.object(processFields, { label: 'Next steps content' }),
      'booking-flow': fields.object(processFields, { label: 'Booking flow content' }),
      capabilities: fields.object(capabilitiesFields, { label: 'Capabilities content' }),
      'capabilities-alt': fields.object(capabilitiesFields, { label: 'Capabilities alt content' }),
      work: fields.object(workFields, { label: 'Work content' }),
      'work-alt': fields.object(workFields, { label: 'Work alt content' }),
      stats: fields.object(statsFields, { label: 'Stats content' }),
      'stats-alt': fields.object(statsFields, { label: 'Stats alt content' }),
      industries: fields.object(industriesFields, { label: 'Industries content' }),
      'industries-alt': fields.object(industriesFields, { label: 'Industries alt content' }),
      regions: fields.object(regionsFields, { label: 'Regions content' }),
      insights: fields.object(insightsFields, { label: 'Insights content' }),
      'insights-alt': fields.object(insightsFields, { label: 'Insights alt content' }),
      cta: fields.object(ctaFields, { label: 'CTA content' }),
      'cta-alt': fields.object(ctaFields, { label: 'CTA alt content' }),
      // The CTA variants share the CTA content shape — same fields,
      // different presentation — except the banner, which alone carries a
      // panel background (drawn by `CtaBanner`'s `background` support). The
      // reader defers a blank image ref to the code default, so blanking
      // falls back to the default backdrop instead of hiding it.
      'cta-banner': fields.object(
        { ...ctaFields, image: imageField('Panel background (blank falls back to the default)') },
        { label: 'CTA banner content' },
      ),
      'cta-split': fields.object(ctaFields, { label: 'CTA split content' }),
      'page-hero': fields.object(pageHeroFields, { label: 'Page hero content' }),
      'page-hero-alt': fields.object(pageHeroFields, { label: 'Page hero alt content' }),
      'team-grid': fields.object(teamGridFields, { label: 'Team grid content' }),
      'team-grid-alt': fields.object(teamGridFields, { label: 'Team grid alt content' }),
      'contact-channels': fields.object(contactChannelsFields, { label: 'Contact channels content' }),
      'contact-channels-alt': fields.object(contactChannelsFields, { label: 'Contact channels alt content' }),
      'form-shell': fields.object(formShellFields, { label: 'Form shell content' }),
      'form-shell-alt': fields.object(formShellFields, { label: 'Form shell alt content' }),
      faq: fields.object(faqFields, { label: 'FAQ content' }),
      'faq-alt': fields.object(faqFields, { label: 'FAQ alt content' }),
      'pricing-tiers': fields.object(pricingTiersFields, { label: 'Pricing tiers content' }),
      'pricing-tiers-alt': fields.object(pricingTiersFields, { label: 'Pricing tiers alt content' }),
      'compare-table': fields.object(compareTableFields, { label: 'Compare table content' }),
      'compare-table-alt': fields.object(compareTableFields, { label: 'Compare table alt content' }),
      exclusions: fields.object(exclusionsFields, { label: 'Exclusions content' }),
      'exclusions-alt': fields.object(exclusionsFields, { label: 'Exclusions alt content' }),
      'plan-picker': fields.object(planPickerFields, { label: 'Plan picker content' }),
      'plan-picker-alt': fields.object(planPickerFields, { label: 'Plan picker alt content' }),
      'leak-list': fields.object(leakListFields, { label: 'Leak list content' }),
      testimonials: fields.object(testimonialFields, { label: 'Testimonials content' }),
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
