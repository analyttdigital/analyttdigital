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

/* ------------------------- section field groups ---------------------- */

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
  scrollHint: fields.text({ label: 'Scroll hint', defaultValue: 'Scroll' }),
  dashboardTitle: fields.text({ label: 'Dashboard title', defaultValue: 'Campaign / Live' }),
  dashboardMetric: fields.text({ label: 'Dashboard metric', defaultValue: 'ROAS 4.2×' }),
  statA_label: fields.text({ label: 'Stat A label', defaultValue: 'CPL this month' }),
  statA_value: fields.text({ label: 'Stat A value', defaultValue: 'KES 280' }),
  statA_delta: fields.text({ label: 'Stat A delta', defaultValue: '-84%' }),
  statB_label: fields.text({ label: 'Stat B label', defaultValue: 'Leads / month' }),
  statB_value: fields.text({ label: 'Stat B value', defaultValue: '1,200+' }),
  marquee: fields.array(fields.text({ label: 'Item' }), {
    label: 'Marquee items',
    itemLabel: (props) => props.value,
  }),
};

const problemFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'THE PROBLEM' }),
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
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'WHAT WE BELIEVE' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Decisions, not dashboards.' }),
  stripLabel: fields.text({ label: 'Tunnel strip label', defaultValue: 'Measured · Attributed · Scaled' }),
  points: fields.array(
    fields.object({
      title: fields.text({ label: 'Title' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
    { label: 'Belief points', itemLabel: (props) => props.fields.title.value || 'Point' },
  ),
};

const processFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'HOW WE WORK' }),
  chapterTitle: fields.text({ label: 'Section name (nav rail)', defaultValue: 'PROCESS' }),
  steps: fields.array(
    fields.object({
      title: fields.text({ label: 'Title' }),
      depth: fields.text({ label: 'Step index (e.g. 01 / 05 — Audit)', defaultValue: '' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
    { label: 'Process steps', itemLabel: (props) => props.fields.title.value || 'Step' },
  ),
};

const capabilitiesFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'OUR SERVICES' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Performance-led services,\nmeasured to the shilling.', multiline: true }),
  items: fields.array(
    fields.object({
      tag: fields.text({ label: 'Tag' }),
      depth: fields.text({ label: 'Index (e.g. 01)', defaultValue: '' }),
      title: fields.text({ label: 'Title' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
    { label: 'Capabilities', itemLabel: (props) => props.fields.title.value || 'Capability' },
  ),
};

const workFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'SELECTED WORK' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Proof, not promises.', multiline: true }),
  cases: fields.array(
    fields.object({
      client: fields.text({ label: 'Client' }),
      industry: fields.text({ label: 'Industry' }),
      depth: fields.text({ label: 'Index (e.g. Case 01)', defaultValue: '' }),
      headline: fields.text({ label: 'Result headline', multiline: true }),
      body: fields.text({ label: 'Body', multiline: true }),
      metric: fields.text({ label: 'Big metric' }),
      metricLabel: fields.text({ label: 'Metric label' }),
    }),
    { label: 'Case studies', itemLabel: (props) => props.fields.client.value || 'Case' },
  ),
};

const statsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'BY THE NUMBERS' }),
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
    }),
    { label: 'Stats', itemLabel: (props) => props.fields.value.value || 'Stat' },
  ),
};

const industriesFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'INDUSTRIES' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Sectors we know.' }),
  body: fields.text({
    label: 'Body',
    defaultValue:
      'From e-commerce in Nairobi to logistics across the region — where we have done the work.',
    multiline: true,
  }),
  hint: fields.text({ label: 'Hint line', defaultValue: 'Selected sectors' }),
  items: fields.array(fields.text({ label: 'Industry' }), {
    label: 'Industries',
    itemLabel: (props) => props.value,
  }),
};

const insightsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'INSIGHTS' }),
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
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'START' }),
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
