#!/usr/bin/env node
/**
 * Seed the `layout` singleton's YAML from the code default (K9).
 *
 * The `layout` singleton (path `src/content/layout`, yaml, no slug) stores
 * as `src/content/layout.yaml` directly (Keystatic keeps the configured
 * path and appends the data extension — `dataLocation: 'outer'`). The
 * layout default carries exactly the keys `layoutFields` defines, and its
 * logo/image entries are plain-text URL fields rather than upload-backed
 * `fields.image`, so unlike `seed-pages.mjs` there is no image copy/rewrite
 * step: the seed is a straight dump of `defaults.en.layout`.
 *
 * The parity gate mirrors `readLayout` (src/lib/content/reader.ts): read
 * the written singleton back through the real Keystatic reader, merge it
 * over the code default key by key (CMS wins; empty lists defer), and
 * require the merged document to equal the default — which must hold by
 * construction when every value is non-empty, so any diff is real drift.
 *
 * Run from the repo root with Node 22.6+ (type stripping):
 *   node scripts/seed-layout.mjs            # write + verify
 *   node scripts/seed-layout.mjs --check    # verify only (no writes)
 *
 * Safe to re-run: it overwrites the seeded YAML with the same content,
 * which would erase UI edits — treat like committing: the team's live
 * edits belong in Keystatic, and the default dump is only the starting
 * point (same contract as `scripts/seed-pages.mjs`).
 */

import fs from 'node:fs';
import path from 'node:path';

import { config, singleton } from '@keystatic/core';
import { createReader } from '@keystatic/core/reader';
import { dump } from 'js-yaml';

import { defaults } from '../src/lib/content/defaults.ts';
import { layoutFields } from '../src/lib/keystatic/schemas.ts';

const root = path.resolve(import.meta.dirname, '..');
const layoutFile = path.join(root, 'src/content/layout.yaml');
const checkOnly = process.argv.includes('--check');

const layout = defaults.en.layout;

if (!checkOnly) fs.writeFileSync(layoutFile, dump(layout, { lineWidth: -1, noRefs: true }));

/* ------------------------- parity verification ------------------------ */

const keystaticConfig = config({
  storage: { kind: 'local' },
  collections: {},
  singletons: {
    layout: singleton({
      label: 'Layout',
      path: 'src/content/layout',
      format: 'yaml',
      schema: layoutFields,
    }),
  },
});

// Same rules as `readLayout`: an empty CMS list defers to the code default;
// every other CMS value (non-empty here) wins. Omitted keys materialise
// from field defaults, which is why the seed writes every key.
function mergeValue(defaultValue, cmsValue) {
  if (Array.isArray(cmsValue) && cmsValue.length === 0) return defaultValue;
  return cmsValue;
}

function mergeLayout(fallback, entry) {
  const merged = { ...fallback };
  for (const [key, value] of Object.entries(entry)) {
    if (value === undefined) continue;
    merged[key] = mergeValue(fallback[key], value);
  }
  return merged;
}

function diff(expected, actual, at = 'layout') {
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
      // Rendered-contract equivalence: Keystatic materialises `fields.array`
      // as an empty array even when the seed omitted it (a plain nav item
      // reads back with `children: []`), and consumers treat empty arrays
      // and absent keys identically (`link.children?.length`). So a key
      // that is empty on one side and missing on the other is not drift.
      if (!(key in actual)) return Array.isArray(expected[key]) && expected[key].length === 0 ? [] : [`${at}.${key}: missing in CMS`];
      if (!(key in expected)) return Array.isArray(actual[key]) && actual[key].length === 0 ? [] : [`${at}.${key}: extra in CMS (schema default?)`];
      return diff(expected[key], actual[key], `${at}.${key}`);
    });
  }
  return [`${at}: ${JSON.stringify(actual)} vs ${JSON.stringify(expected)}`];
}

const reader = createReader(root, keystaticConfig);
const entry = await reader.singletons.layout.read();
if (!entry) {
  console.error('✗ layout: no Keystatic entry');
  process.exitCode = 1;
} else {
  const differences = diff(layout, mergeLayout(layout, entry));
  if (differences.length) {
    console.error('✗ layout');
    for (const line of differences.slice(0, 12)) console.error(`  ${line}`);
    if (differences.length > 12) console.error(`  … ${differences.length - 12} more`);
    process.exitCode = 1;
  } else {
    console.log('✓ layout');
  }
}
console.log(`${checkOnly ? 'checked' : 'seeded'} layout.yaml, parity checked against the code default`);
