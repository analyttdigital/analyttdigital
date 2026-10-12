import { MdiIcon, type MdiName } from '@/lib/icons/resolve-icon';

/** The arrow that arrives on hover is the one travelling out, mirrored. */
const MIRROR: Partial<Record<string, MdiName>> = {
  arrowTopRight: 'arrowBottomRight',
  arrowBottomRight: 'arrowTopRight',
  arrowDown: 'arrowDown',
};

function mirrorOf(icon: string): string {
  return MIRROR[icon] ?? icon;
}

/**
 * Action — the one control in this world.
 *
 * A plate with the label set on it and a square key attached at the right
 * carrying the direction of travel. The key is the affordance: it is the only
 * part that changes on hover, and it fills with ember, so the whole page has
 * exactly one gesture the reader is invited to try.
 */
export function Action({
  href,
  label,
  icon = 'arrowTopRight',
  variant = 'paper',
  className,
  ...rest
}: {
  href: string;
  label: string;
  /** Icon-name string from the shared resolver. */
  icon?: string;
  variant?: 'paper' | 'ember' | 'ghost';
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>) {
  const skin = variant === 'ember' ? 'btn--ember' : variant === 'ghost' ? 'btn--ghost' : '';

  return (
    <a href={href} className={`btn ${skin} ${className ?? ''}`} {...rest}>
      <span className="btn__label">{label}</span>
      <span className="btn__key">
        <span className="key-arrow key-arrow--out">
          <MdiIcon name={icon} size={0.75} />
        </span>
        <span className="key-arrow key-arrow--in">
          <MdiIcon name={mirrorOf(icon)} size={0.75} />
        </span>
      </span>
    </a>
  );
}