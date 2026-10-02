import { MdiIcon, type MdiName } from '@/lib/icons/resolve-icon';

/**
 * IconPanel — big-icon feature block that replaces chart-style SVG graphics.
 * A soft tinted disc, a large MDI glyph, and a caption row — readable at a
 * glance from across the viewport, no data-chart pretense.
 */
export function IconPanel({
  icon,
  label,
  value,
  tint = 'brand',
  size = 'md',
}: {
  icon: MdiName;
  label?: string;
  value?: string;
  tint?: 'brand' | 'ink' | 'accent';
  size?: 'md' | 'lg';
}) {
  const disc =
    size === 'lg'
      ? tint === 'accent'
        ? 'h-28 w-28 bg-accent-500 text-paper'
        : tint === 'ink'
          ? 'h-28 w-28 bg-ink-950 text-paper'
          : 'h-28 w-28 bg-accent-50 text-accent-500'
      : tint === 'accent'
        ? 'h-20 w-20 bg-accent-500 text-paper'
        : tint === 'ink'
          ? 'h-20 w-20 bg-ink-950 text-paper'
          : 'h-20 w-20 bg-accent-50 text-accent-500';

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <span className={`flex items-center justify-center rounded-full shadow-float ${disc}`}>
        <MdiIcon name={icon} size={size === 'lg' ? 2.4 : 1.7} />
      </span>
      {value ? <p className="font-display text-[24px] font-bold tracking-tight text-ink-950">{value}</p> : null}
      {label ? <p className="text-[13px] font-medium text-ink-600">{label}</p> : null}
    </div>
  );
}
