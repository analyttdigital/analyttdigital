import Link from '@/components/ui/link';

import { MediaSlot } from '@/components/media/dynamic-image';
import { useChrome } from '@/lib/content/chrome';
import { formatPostDate } from '@/lib/content/blog';
import type { BlogPost, DataProps, Locale } from '@/lib/content/types';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { TiltCard } from '@/lib/motion/gsap-reveal';

// Re-exported for the list below; `href` stays a plain prop (route-derived),
// everything editorial rides in `data` per the component contract.
export type BlogCardData = {
  post: BlogPost;
  index: string;
  readMoreLabel: string;
};

/**
 * BlogCard — one post plate in the listing grid. Same plate language as the
 * insights section (media mount, mono meta row, display title, summary, arrow
 * read-more), but the plate links to a real post. Artwork missing → the honest
 * `MediaSlot` placeholder, exactly as elsewhere.
 */
export function BlogCard({
  data,
  href,
  locale,
  classes,
  className,
}: DataProps<BlogCardData, 'card'> & { href: string; locale: Locale }) {
  const chrome = useChrome();
  const { post, index, readMoreLabel } = data;
  const date = formatPostDate(post.publishedAt, locale);

  return (
    <TiltCard
      className={`h-full rounded-3xl bg-paper-50 shadow-[0_22px_50px_-24px_rgb(var(--color-primary-600)/0.28)] ${className ?? ''} ${classes?.card ?? ''}`}
      max={5}
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-950/[0.07]">
        <MediaSlot
          image={post.featuredImage}
          icon="document"
          label={chrome.mediaSlot}
          tone="paper"
          className="aspect-[16/10] w-full overflow-hidden"
        />
        <div className="flex flex-1 flex-col p-6">
          <p className="flex items-center justify-between gap-3 font-mono text-[9.5px] capitalize  text-ink-400">
            <span>
              {index} /{post.category ? ` ${post.category}` : ''}
            </span>
            {date ? <span>{date}</span> : null}
          </p>
          <h3 className="verb mt-4 max-w-[24ch] text-[clamp(1.2rem,1.9vw,1.5rem)] text-ink-950 transition-colors duration-300 group-hover:text-accent-600">
            <Link href={href} className="before:absolute before:inset-0">
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-[52ch] text-[12.5px] leading-[1.8] text-ink-500">{post.excerpt}</p>
          <p className="mt-auto flex items-center gap-3 pt-6 font-mono text-[9.5px] capitalize  text-ink-400 transition-colors duration-300 group-hover:text-accent-600">
            {readMoreLabel}
            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
              <MdiIcon name="arrowTopRight" size={0.75} />
            </span>
          </p>
        </div>
      </article>
    </TiltCard>
  );
}
