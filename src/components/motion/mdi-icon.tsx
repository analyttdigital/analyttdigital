import Icon from '@mdi/react';
import {
  mdiAnchor,
  mdiArrowDown,
  mdiArrowRight,
  mdiArrowTopRight,
  mdiAsterisk,
  mdiBullhornOutline,
  mdiChartLine,
  mdiCompassOutline,
  mdiCrosshairsGps,
  mdiMapMarkerOutline,
  mdiRadar,
  mdiRadioTower,
  mdiRocketLaunchOutline,
  mdiWaves,
} from '@mdi/js';

/**
 * Shared MDI icon map — single import surface for the whole site.
 * Token-currentColor only; sizing via `size` (1 = 24px, matches @mdi/react).
 * Add new entries here, never import @mdi/js directly in sections.
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
  crosshairs: mdiCrosshairsGps,
  bullhorn: mdiBullhornOutline,
  chart: mdiChartLine,
  rocket: mdiRocketLaunchOutline,
  radio: mdiRadioTower,
  pin: mdiMapMarkerOutline,
} as const;

export type MdiName = keyof typeof mdi;

/** Dive-instrument icons for capability cards, by position. */
export const capabilityIcons: MdiName[] = ['bullhorn', 'radar', 'compass', 'radio'];

/** Depth-zone icons for stat cards, by position. */
export const statIcons: MdiName[] = ['crosshairs', 'waves', 'chart', 'rocket'];

/** Consistent MDI wrapper: inherits text color, decorative by default. */
export function MdiIcon({
  name,
  size = 0.8,
  className,
  title,
}: {
  name: MdiName;
  size?: number;
  className?: string;
  title?: string;
}) {
  if (title) {
    return (
      <span role="img" aria-label={title} className={`inline-flex ${className ?? ''}`}>
        <Icon path={mdi[name]} size={size} title={title} />
      </span>
    );
  }
  return <Icon path={mdi[name]} size={size} className={className} aria-hidden={true} />;
}
