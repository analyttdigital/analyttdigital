import Icon from '@mdi/react';
import {
  mdiAnchor,
  mdiArrowDown,
  mdiArrowRight,
  mdiArrowTopRight,
  mdiAsterisk,
  mdiBullhornOutline,
  mdiChartLine,
  mdiCheck,
  mdiClose,
  mdiCompassOutline,
  mdiCrosshairsGps,
  mdiMapMarkerOutline,
  mdiMenu,
  mdiPlus,
  mdiRadar,
  mdiRadioTower,
  mdiRocketLaunchOutline,
  mdiWaves,
} from '@mdi/js';

/**
 * Icon-name → MDI SVG resolver — single source of truth (M3).
 *
 * Content carries icons as plain strings (see `iconField` in schemas.ts);
 * this module is the only place that maps those strings to `@mdi/js`
 * paths. Never import `@mdi/js` directly in sections — resolve here.
 * Token-currentColor only; sizing via `size` (1 = 24px, matches @mdi/react).
 * Add new entries to `mdi` below; the type + guard pick them up.
 */
export const mdi = {
  arrowRight: mdiArrowRight,
  arrowDown: mdiArrowDown,
  arrowTopRight: mdiArrowTopRight,
  asterisk: mdiAsterisk,
  anchor: mdiAnchor,
  waves: mdiWaves,
  radar: mdiRadar,
  compass: mdiCompassOutline,
  close: mdiClose,
  crosshairs: mdiCrosshairsGps,
  bullhorn: mdiBullhornOutline,
  chart: mdiChartLine,
  rocket: mdiRocketLaunchOutline,
  radio: mdiRadioTower,
  pin: mdiMapMarkerOutline,
  menu: mdiMenu,
  check: mdiCheck,
  plus: mdiPlus,
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
 * missing names fall back instead of crashing — sections stay render-safe
 * no matter what the CMS holds.
 */
export function resolveIcon(name: string | undefined, fallback: MdiName = fallbackIcon): string {
  return isMdiName(name) ? mdi[name] : mdi[fallback];
}

/** Positional defaults (M2 convention: empty `icon` keeps these). */
export const capabilityIcons: MdiName[] = ['bullhorn', 'radar', 'compass', 'radio'];

/** Positional defaults (M2 convention: empty `icon` keeps these). */
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
