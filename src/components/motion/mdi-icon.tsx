/**
 * Backwards-compat shim — the icon map, resolver, and `MdiIcon` live in
 * `@/lib/icons/resolve-icon` (single source of truth). Existing imports keep
 * working; new code should import from `@/lib/icons/resolve-icon` directly.
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