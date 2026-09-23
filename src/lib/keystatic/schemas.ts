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
  headline: fields.text({ label: 'Headline', defaultValue: 'Ad spend, turned into measurable growth.', multiline: true }),
  sub: fields.text({
    label: 'Subheadline',
    defaultValue:
      'Analytt Digital is a performance marketing partner for startups and small businesses — paid media, measurement and growth strategy, all tracked to revenue.',
    multiline: true,
  }),
  cta: fields.text({ label: 'Primary CTA', defaultValue: 'Start with a free audit' }),
  ctaHref: fields.text({ label: 'Primary CTA href', defaultValue: '#contact' }),
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
  closing: fields.text({ label: 'Closing line', defaultValue: 'Analytt Digital exists to close that gap.' }),
};

const beliefFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'WHAT WE BELIEVE' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'The value of data is the decision, not the dashboard.' }),
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
      title: fields.text({ label: 'Title' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
    { label: 'Capabilities', itemLabel: (props) => props.fields.title.value || 'Capability' },
  ),
};

const workFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'CLIENT RESULTS' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Proof, not promises.' }),
  cases: fields.array(
    fields.object({
      client: fields.text({ label: 'Client' }),
      industry: fields.text({ label: 'Industry' }),
      headline: fields.text({ label: 'Result headline', multiline: true }),
      body: fields.text({ label: 'Body', multiline: true }),
      metric: fields.text({ label: 'Big metric' }),
      metricLabel: fields.text({ label: 'Metric label' }),
    }),
    { label: 'Case studies', itemLabel: (props) => props.fields.client.value || 'Case' },
  ),
};

const statsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'OUR PHILOSOPHY' }),
  headline: fields.text({ label: 'Headline', defaultValue: "Data is not a dashboard. It's your competitive edge.", multiline: true }),
  body: fields.text({
    label: 'Body',
    defaultValue:
      'In a market where most agencies still report reach and impressions, we treat data as a strategic asset — the thing that separates agencies who guess from agencies who know.',
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
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'SECTORS' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Industries we have grown.' }),
  body: fields.text({
    label: 'Body',
    defaultValue:
      'From scaling e-commerce in Nairobi to expanding logistics into Kampala and Dar es Salaam — we have helped brands like yours generate revenue faster, and prove it.',
    multiline: true,
  }),
  items: fields.array(fields.text({ label: 'Industry' }), {
    label: 'Industries',
    itemLabel: (props) => props.value,
  }),
};

const insightsFields = {
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'INSIGHTS' }),
  headline: fields.text({ label: 'Headline', defaultValue: 'Notes from the data.' }),
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
  eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'START GROWING' }),
  headline: fields.text({
    label: 'Headline',
    defaultValue: 'Most businesses find KES 50K–200K in recoverable spend in the first audit.',
    multiline: true,
  }),
  body: fields.text({
    label: 'Body',
    defaultValue:
      'We will audit your current marketing setup for free — no obligation — and show you precisely where budget is being wasted and where your biggest opportunities lie.',
    multiline: true,
  }),
  cta: fields.text({ label: 'CTA label', defaultValue: 'Request a free digital audit' }),
  ctaHref: fields.text({ label: 'CTA href', defaultValue: 'mailto:hello@analyttdigital.com' }),
  note: fields.text({ label: 'Small note', defaultValue: 'No deck. No obligation. Just the findings.' }),
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
