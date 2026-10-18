#!/usr/bin/env node
/**
 * Seed `src/content/pages/**` YAML from the code-default pages (K2).
 *
 * Keystatic arrays start empty and image fields are upload-backed, so the
 * code defaults cannot simply be copied into `src/content`: an image ref
 * must point at a real file under the field's upload directory or the admin
 * preview reads it as empty (and saving would then drop it). This script:
 *
 * 1. Writes one YAML document per `defaults.en.pages` slug (nested slugs
 *    like `services/paid-media` become nested directories; the collection
 *    path uses `**` so Keystatic lists them).
 * 2. Copies every image the defaults reference into
 *    `public/media/uploads/<page-slug>/<field-path>.<ext>` and rewrites the
 *    stored `src` to that upload path.
 * 3. Omits the page `title`: `slugField: 'title'` makes the text field the
 *    slug carrier (Keystatic stores the slug as the filename and reads the
 *    field back as `null`), so writing a title only creates drift.
 * 4. Reads the result back through the real Keystatic reader and checks the
 *    merged document equals the code default — the parity gate for K2.
 *
 * Run from the repo root with Node 22.6+ (type stripping):
 *   node scripts/seed-pages.mjs            # write + verify
 *   node scripts/seed-pages.mjs --check    # verify only (no writes)
 *
 * Safe to re-run: it overwrites the seeded YAML and reuses copied images.
 */

import fs from 'node:fs';
import path from 'node:path';

import { config, collection } from '@keystatic/core';
import { createReader } from '@keystatic/core/reader';
import { dump } from 'js-yaml';

import { defaults } from '../src/lib/content/defaults.ts';
import { pageFields } from '../src/lib/keystatic/schemas.ts';

const root = path.resolve(import.meta.dirname, '..');
const pagesDir = path.join(root, 'src/content/pages');
const uploadsDir = path.join(root, 'public/media/uploads');
const publicDir = path.join(root, 'public');
const checkOnly = process.argv.includes('--check');

/** Keys in `pageFields` that hold a `{ src, alt }` upload object. */
const IMAGE_KEYS = new Set(['image', 'logo', 'logoDark', 'featuredImage']);

/** Arrays a page keeps on its code default until an explicit upload/edit
 *  pass: a CMS array replaces the code array wholesale, and these carry an
 *  optional object (`visual` / `readout`) that Keystatic materialises with
 *  defaults when absent — which would draw a figure the default page does
 *  not have. Content-page process steps are copy-only today, and
 *  `capabilities-alt` ignores the readout, so the text-only variants are
 *  safe; only the process variants without figure data are held back. */
const HOLD_BACK_STEPS = new Set(['process-alt', 'how-we-work', 'next-steps', 'booking-flow']);

const warnings = [];
let copied = 0;

const slugifySegment = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Copy one default image into the page's upload folder and return the
 *  stored `{ src, alt }` upload object. Empty/missing sources return
 *  `{ alt }` only — the reader treats a missing `src` as "no image", so the
 *  code default still wins at render time. */
function seedImage(image, pageSlug, fieldPath) {
  const alt = typeof image?.alt === 'string' ? image.alt : '';
  const src = typeof image?.src === 'string' ? image.src.trim() : '';
  if (!src) return { alt };

  const source = path.join(publicDir, src.replace(/^\//, ''));
  if (!fs.existsSync(source)) {
    warnings.push(`missing default image ${src} (${pageSlug}:${fieldPath}) — left empty`);
    return { alt };
  }

  const extension = path.extname(source);
  const filename = `${slugifySegment(fieldPath) || 'image'}${extension}`;
  const uploadPath = `${pageSlug}/${filename}`;
  const target = path.join(uploadsDir, uploadPath);

  if (!checkOnly) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const sameFile =
      fs.existsSync(target) && fs.statSync(target).size === fs.statSync(source).size;
    if (!sameFile) fs.copyFileSync(source, target);
  }
  copied += 1;

  return { src: `/media/uploads/${uploadPath}`, alt };
}

/** Recursively rewrite an image object; everything else passes through. */
function transform(value, pageSlug, fieldPath) {
  if (Array.isArray(value)) {
    return value.map((item, index) => transform(item, pageSlug, `${fieldPath}-${index}`));
  }
  if (value !== null && typeof value === 'object') {
    const out = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry === undefined) continue;
      if (
        IMAGE_KEYS.has(key) &&
        entry !== null &&
        typeof entry === 'object' &&
        ('src' in entry || 'alt' in entry)
      ) {
        out[key] = seedImage(entry, pageSlug, `${fieldPath}-${key}`);
      } else {
        out[key] = transform(entry, pageSlug, `${fieldPath}-${key}`);
      }
    }
    return out;
  }
  return value;
}

/** One page doc → Keystatic's stored shape (conditional section blocks). */
function seedPage(slug, page) {
  const sections = page.sections.map((section) => {
    const { type, steps, ...rest } = section;
    const value = transform(rest, slug, type);
    if (steps && HOLD_BACK_STEPS.has(type)) delete value.steps;
    return { discriminant: type, value };
  });
  return {
    description: page.description,
    featuredImage: seedImage(page.featuredImage, slug, 'featuredImage'),
    sections,
  };
}

function writePage(slug, page) {
  const seeded = seedPage(slug, page);
  const file = path.join(pagesDir, `${slug}.yaml`);
  if (!checkOnly) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, dump(seeded, { lineWidth: -1, noRefs: true }));
  }
  return { slug, seeded };
}

/* ------------------------------ run ---------------------------------- */

const pageEntries = Object.entries(defaults.en.pages);
for (const [slug, page] of pageEntries) writePage(slug, page);

/* ------------------------- parity verification ------------------------ */

const keystaticConfig = config({
  storage: { kind: 'local' },
  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/**',
      format: 'yaml',
      schema: pageFields,
    }),
  },
  singletons: {},
});

function isEmptyImage(value) {
  if (typeof value !== 'object' || value === null || !('src' in value)) return false;
  const src = value.src;
  return src == null || (typeof src === 'string' && src.trim() === '');
}

function mergeValue(defaultValue, cmsValue) {
  if (Array.isArray(cmsValue) && cmsValue.length === 0) return defaultValue;
  if (isEmptyImage(cmsValue)) return defaultValue;
  return cmsValue;
}

function mergeSection(defaultsSection, cmsSection) {
  if (!defaultsSection || defaultsSection.type !== cmsSection.type) return cmsSection;
  const merged = { ...defaultsSection };
  for (const [key, value] of Object.entries(cmsSection)) {
    if (key === 'type') continue;
    merged[key] = mergeValue(merged[key], value);
  }
  return merged;
}

function mergeImage(fallback, cmsValue) {
  if (cmsValue == null || isEmptyImage(cmsValue)) return fallback ?? { src: '', alt: '' };
  return cmsValue;
}

function normalizeSection(raw) {
  if (raw !== null && typeof raw === 'object' && 'discriminant' in raw && 'value' in raw) {
    return { ...(raw.value ?? {}), type: raw.discriminant };
  }
  return raw;
}

function mergePage(fallback, entry) {
  return {
    title: entry.title || fallback.title,
    description: entry.description || fallback.description,
    featuredImage: mergeImage(fallback.featuredImage, entry.featuredImage),
    sections: entry.sections
      .map(normalizeSection)
      .map((section, index) => mergeSection(fallback.sections[index], section)),
  };
}

/** Report leaf-level differences between the merged doc and the default. */
function diff(expected, actual, at = 'page') {
  if (expected === actual) return [];
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) return [`${at}: type mismatch`];
    if (expected.length !== actual.length) {
      return [`${at}: length ${actual.length} vs ${expected.length}`];
    }
    return expected.flatMap((item, index) => diff(item, actual[index], `${at}[${index}]`));
  }
  if (expected !== null && actual !== null && typeof expected === 'object' && typeof actual === 'object') {
    const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
    return [...keys].flatMap((key) => {
      if (!(key in actual)) return [`${at}.${key}: missing in CMS`];
      if (!(key in expected)) return [`${at}.${key}: extra in CMS`];
      return diff(expected[key], actual[key], `${at}.${key}`);
    });
  }
  return [`${at}: ${JSON.stringify(actual)} vs ${JSON.stringify(expected)}`];
}

const reader = createReader(root, keystaticConfig);
const entries = await reader.collections.pages.all();
const bySlug = new Map(entries.map((entry) => [entry.slug, entry.entry]));

let failures = 0;
for (const [slug, page] of pageEntries) {
  const entry = bySlug.get(slug);
  if (!entry) {
    console.error(`✗ ${slug}: no Keystatic entry`);
    failures += 1;
    continue;
  }
  const differences = diff(page, mergePage(page, entry));
  if (differences.length) {
    failures += 1;
    console.error(`✗ ${slug}`);
    for (const line of differences.slice(0, 12)) console.error(`  ${line}`);
    if (differences.length > 12) console.error(`  … ${differences.length - 12} more`);
  } else {
    console.log(`✓ ${slug}`);
  }
}

for (const warning of warnings) console.warn(`! ${warning}`);
console.log(
  `${checkOnly ? 'checked' : 'seeded'} ${pageEntries.length} pages, ` +
    `${copied} image refs, ${failures} parity failure(s)`,
);

if (failures) process.exitCode = 1;
