import Image from 'next/image';

import { useChrome } from '@/lib/content/chrome';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import type { ContentImage } from '@/lib/content/types';

/**
 * Media/image resolver — single shared component for `{ src, alt }` content
 * refs (M3). Sections must render CMS-driven media through this, never via
 * raw `<img>` tags, so cropping, fallback, and optimization stay consistent.
 *
 * - Empty/absent `src` renders nothing (callers keep their generated-graphic
 *   or gradient fallback) — sections stay render-safe on legacy entries.
 * - Fluid `fill` mode by default (parent supplies size + positioning);
 *   pass `width` + `height` for fixed-size rendering instead.
 * - Remote URLs render `unoptimized` until `remotePatterns` land (M8 asset
 *   hardening); local paths get full Next.js optimization.
 */
export type DynamicImageProps = {
  image?: ContentImage | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

function isRemote(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

export function DynamicImage({
  image,
  className,
  sizes = '100vw',
  priority = false,
  width,
  height,
}: DynamicImageProps) {
  const src = image?.src?.trim() ?? '';
  if (!src) return null;

  const alt = image?.alt ?? '';
  const unoptimized = isRemote(src);

  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={true}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={className ?? 'object-cover'}
    />
  );
}

/**
 * MediaSlot — one frame for a piece of media, whichever of the two states it
 * is in. Sections never decide for themselves whether there is an image.
 *
 * With a `src` it is a plain cropped `DynamicImage`. Without one it is the
 * placeholder the client will fill later: the world's hairline frame over a
 * grid, an icon from the shared resolver, and an honest mono note saying what
 * belongs there. The frame is sized by the parent, so a slot can be a 4:3
 * plate, a 16:9 thumb, or a square avatar without a variant prop.
 */
export function MediaSlot({
  image,
  icon = 'image',
  label,
  className,
  tone = 'dark',
  sizes = '100vw',
  priority = false,
}: {
  image?: ContentImage | null;
  /** Icon-name string from the shared resolver. */
  icon?: string;
  /** Overrides the default placeholder note. */
  label?: string;
  className?: string;
  tone?: 'dark' | 'paper';
  sizes?: string;
  priority?: boolean;
}) {
  const chrome = useChrome();
  const frameClass = tone === 'paper' ? 'slot slot--paper' : 'slot';

  if (image?.src?.trim()) {
    return (
      <div className={`relative overflow-hidden ${frameClass} ${className ?? ''}`}>
        <DynamicImage
          image={image}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={label ?? chrome.mediaSlot}
      role="img"
      className={`${frameClass} ${className ?? ''}`}
    >
      <div className="flex flex-col items-center gap-3 p-4">
        <MdiIcon name={icon} size={1.5} />
        <span className="label label--plain text-center leading-relaxed">
          {label ?? chrome.mediaSlot}
        </span>
      </div>
    </div>
  );
}
