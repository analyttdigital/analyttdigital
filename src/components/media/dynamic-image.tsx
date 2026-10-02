import Image from 'next/image';

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
