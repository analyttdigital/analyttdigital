import Icon from '@mdi/react';
import {
  mdiAccessPoint,
  mdiAnchor,
  mdiArrowBottomRight,
  mdiArrowDown,
  mdiArrowRight,
  mdiArrowTopRight,
  mdiAsterisk,
  mdiBullhornOutline,
  mdiChartBoxOutline,
  mdiChartLine,
  mdiCheck,
  mdiClose,
  mdiCompassOutline,
  mdiCrosshairsGps,
  mdiDatabaseOutline,
  mdiEmailOutline,
  mdiFileDocumentOutline,
  mdiImageOutline,
  mdiLayersOutline,
  mdiMapMarkerOutline,
  mdiMenu,
  mdiOpenInNew,
  mdiPercentOutline,
  mdiRadar,
  mdiRadioTower,
  mdiRefresh,
  mdiRocketLaunchOutline,
  mdiSitemapOutline,
  mdiCreation,
  mdiTagOutline,
  mdiTarget,
  mdiViewGridOutline,
  mdiWaves,
} from '@mdi/js';

/**
 * Icon-name → MDI SVG resolver — single source of truth.
 *
 * Content carries icons as plain strings (see `iconField` in schemas.ts); this
 * module is the only place that maps those strings to `@mdi/js` paths. Never
 * import `@mdi/js` directly in sections — resolve here. Token-currentColor
 * only; sizing via `size` (1 = 24px, matches @mdi/react).
 * Add new entries to `mdi` below; the type + guard pick them up.
 */
export const mdi = {
  arrowRight: mdiArrowRight,
  arrowDown: mdiArrowDown,
  arrowBottomRight: mdiArrowBottomRight,
  arrowTopRight: mdiArrowTopRight,
  open: mdiOpenInNew,
  asterisk: mdiAsterisk,
  anchor: mdiAnchor,
  waves: mdiWaves,
  radar: mdiRadar,
  compass: mdiCompassOutline,
  close: mdiClose,
  crosshairs: mdiCrosshairsGps,
  target: mdiTarget,
  node: mdiAccessPoint,
  net: mdiSitemapOutline,
  bullhorn: mdiBullhornOutline,
  chart: mdiChartLine,
  chartBox: mdiChartBoxOutline,
  database: mdiDatabaseOutline,
  layers: mdiLayersOutline,
  percent: mdiPercentOutline,
  rocket: mdiRocketLaunchOutline,
  radio: mdiRadioTower,
  refresh: mdiRefresh,
  pin: mdiMapMarkerOutline,
  menu: mdiMenu,
  grid: mdiViewGridOutline,
  image: mdiImageOutline,
  document: mdiFileDocumentOutline,
  tag: mdiTagOutline,
  mail: mdiEmailOutline,
  check: mdiCheck,
  sparkles: mdiCreation,
} as const;

export type MdiName = keyof typeof mdi;

/** Fallback glyph for unknown/empty content icon names — neutral by design. */
export const fallbackIcon: MdiName = 'asterisk';

/** Type guard: is this string a known MDI key? */
export function isMdiName(name: string | undefined): name is MdiName {
  return typeof name === 'string' && name !== '' && name in mdi;
}

/**
 * Resolve a content icon-name string to an SVG path. Unknown, empty, or
 * missing names fall back instead of crashing — sections stay render-safe no
 * matter what the CMS holds.
 */
export function resolveIcon(name: string | undefined, fallback: MdiName = fallbackIcon): string {
  return isMdiName(name) ? mdi[name] : mdi[fallback];
}

/** Positional defaults (content convention: an empty `icon` keeps these). */
export const capabilityIcons: MdiName[] = ['bullhorn', 'database', 'compass', 'layers'];

/** Positional defaults (content convention: an empty `icon` keeps these). */
export const statIcons: MdiName[] = ['crosshairs', 'waves', 'chart', 'rocket'];

/**
 * Consistent MDI wrapper: inherits text color, decorative by default.
 * Accepts any string — resolution + fallback happen inside, so content
 * values can be passed straight through (`data.icon`).
 */
export function MdiIcon({
  name,
  size = 0.8,
  className,
  title,
}: {
  name: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const path = resolveIcon(name);
  if (title) {
    return (
      <span role="img" aria-label={title} className={`inline-flex ${className ?? ''}`}>
        <Icon path={path} size={size} title={title} />
      </span>
    );
  }
  return <Icon path={path} size={size} className={className} aria-hidden={true} />;
}