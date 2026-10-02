/**
 * Backwards-compat shim — the icon map, resolver, and `MdiIcon` now live in
 * `@/lib/icons/resolve-icon` (single source of truth, M3). Existing section
 * imports keep working; new code should import from `@/lib/icons/resolve-icon`
 * directly. Removed once M5 restyles migrate every section.
 */
export {
  MdiIcon,
  capabilityIcons,
  fallbackIcon,
  isMdiName,
  mdi,
  resolveIcon,
  statIcons,
  type MdiName,
} from '@/lib/icons/resolve-icon';
