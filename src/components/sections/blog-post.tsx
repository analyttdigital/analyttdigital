import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';
import { DocumentRenderer, type DocumentRendererProps } from '@keystatic/core/renderer';

import { InViewTitle } from '@/components/graphics/in-view-title';
import { DynamicImage } from '@/components/media/dynamic-image';
import { fillTemplate, formatPostDate } from '@/lib/content/blog';
import type { BlogPost, BlogPostCopy, DataProps, Locale } from '@/lib/content/types';
import { MdiIcon } from '@/lib/icons/resolve-icon';
import { GsapReveal } from '@/lib/motion/gsap-reveal';

type RendererDoc = DocumentRendererProps['document'];

export type BlogPostData = { post: BlogPost; copy: BlogPostCopy };

/** Normalise an editor pasted URL to its player form (YouTube/Vimeo); anything
 *  else passes through as a generic iframe src. */
function embedSrc(url: string): string {
  const value = url.trim();
  const yt = value.match(/(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  if (/youtube\.com\/embed\/[\w-]+/.test(value)) return value;
  const vimeo = value.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return value;
}

function Embed({ url, caption }: { url: string; caption?: string }): ReactElement | null {
  if (!url?.trim()) return null;
  return (
    <figure className="my-10">
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-ink-950/[0.07]">
        <iframe
          src={embedSrc(url)}
          title={caption?.trim() || 'Embedded video'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {caption?.trim() ? (
        <figcaption className="mt-3 font-mono text-[10px]  text-ink-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Para({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-[15px] leading-[1.9] text-ink-600 first:mt-0">{children}</p>;
}

function Heading({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: ReactNode }) {
  if (level <= 2) {
    return (
      <h2 className="verb mt-12 text-[clamp(1.4rem,2.4vw,1.8rem)] leading-snug text-ink-950">
        {children}
      </h2>
    );
  }
  return (
    <h3 className="verb mt-10 text-[clamp(1.1rem,1.8vw,1.3rem)] leading-snug text-ink-950">
      {children}
    </h3>
  );
}

function PostList({ type, children }: { type: 'ordered' | 'unordered'; children: ReactElement[] }) {
  const Tag = type === 'ordered' ? 'ol' : 'ul';
  return (
    <Tag
      className={
        type === 'ordered'
          ? 'mt-6 list-decimal space-y-3 pl-6 text-[15px] leading-[1.9] text-ink-600 marker:text-accent-600'
          : 'mt-6 list-disc space-y-3 pl-6 text-[15px] leading-[1.9] text-ink-600 marker:text-accent-600'
      }
    >
      {children}
    </Tag>
  );
}

function PostTable({
  head,
  body,
}: {
  head?: { children: ReactNode }[];
  body: { children: ReactNode }[][];
}) {
  return (
    <div className="my-10 overflow-x-auto rounded-3xl border border-ink-950/[0.07]">
      <table className="w-full min-w-[36rem] border-collapse bg-paper-50 text-left text-[13px] leading-[1.7]">
        {head && head.length > 0 ? (
          <thead>
            <tr>
              {head.map((cell, i) => (
                <th
                  key={i}
                  className="border-b border-ink-950/10 px-5 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-500"
                >
                  {cell.children}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-b border-ink-950/[0.05] last:border-0">
              {row.map((cell, c) => (
                <td key={c} className="px-5 py-4 align-top text-ink-600">
                  {cell.children}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * BlogPost — the post page. Back link, mono byline, display title, excerpt
 * lede, featured figure (hidden when the CMS/default art is empty), then the
 * Keystatic document body with the site's long-form rhythm. Inline images
 * resolve through `DynamicImage`; the `embed` block renders a video frame.
 */
export function BlogPostView({
  data,
  basePath,
  locale,
  classes,
  className,
  id,
}: DataProps<BlogPostData, 'head' | 'body' | 'figure'> & { basePath: string; locale: Locale }) {
  const { post, copy } = data;
  const byline = fillTemplate(copy.bylineTemplate, {
    date: formatPostDate(post.publishedAt, locale),
    author: post.author,
    category: post.category,
  });
  const featuredSrc = post.featuredImage?.src?.trim() ?? '';

  return (
    <article id={id} className={className}>
      <section className="relative overflow-hidden bg-paper pb-10 pt-28 md:pb-12 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgb(var(--color-primary-200)/0.5),transparent_70%)]"
        />
        <div
          className={['relative mx-auto w-full max-w-4xl px-5 md:px-8', classes?.head]
            .filter(Boolean)
            .join(' ')}
        >
          <GsapReveal>
            <Link
              data-rise
              href={basePath}
              className="inline-flex items-center gap-2.5 rounded-full border border-ink-950/15 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors duration-200 hover:border-ink-950/30"
            >
              <MdiIcon name="arrowLeft" size={0.8} />
              {copy.backLabel}
            </Link>
            <div data-rise="1">
              {byline ? (
                <p className="label mt-10 text-ink-500">{byline}</p>
              ) : null}
              <InViewTitle
                text={(post.title ?? '').replace(/\n/g, ' ')}
                variant="blur"
                as="h1"
                className="title mt-6 text-[clamp(2rem,4.6vw,3.2rem)] text-ink-950"
              />
              {post.excerpt ? (
                <p className="mt-6 max-w-[58ch] text-base leading-[1.85] text-ink-500">
                  {post.excerpt}
                </p>
              ) : null}
            </div>
          </GsapReveal>
        </div>
      </section>

      {featuredSrc ? (
        <div className="bg-paper pb-4">
          <div
            className={['relative mx-auto w-full max-w-4xl px-5 md:px-8', classes?.figure]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-ink-950/[0.07]">
              <DynamicImage
                image={post.featuredImage}
                sizes="(max-width: 56rem) 100vw, 56rem"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}

      <section className="bg-paper pb-20 pt-8 md:pb-28">
        <div
          className={['relative mx-auto w-full max-w-4xl px-5 md:px-8', classes?.body]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="max-w-[68ch]">
            <DocumentRenderer
              document={post.body as unknown as RendererDoc}
              renderers={{
                inline: {
                  bold: ({ children }: { children: ReactNode }) => (
                    <strong className="font-semibold text-ink-900">{children}</strong>
                  ),
                  link: ({ children, href }: { children: ReactNode; href: string }) => (
                    <a
                      href={href}
                      className="font-medium text-accent-600 underline decoration-accent-500/40 underline-offset-4 transition-colors duration-200 hover:text-accent-500"
                    >
                      {children}
                    </a>
                  ),
                },
                block: {
                  paragraph: Para,
                  heading: Heading,
                  list: PostList,
                  divider: () => (
                    <hr className="my-10 border-0 border-t border-ink-950/10" />
                  ),
                  image: ({ src, alt }: { src: string; alt: string }) =>
                    src?.trim() ? (
                      <span className="relative my-10 block aspect-[16/9] overflow-hidden rounded-3xl border border-ink-950/[0.07]">
                        <DynamicImage
                          image={{ src, alt }}
                          sizes="(max-width: 44rem) 100vw, 44rem"
                          className="h-full w-full object-cover"
                        />
                      </span>
                    ) : null,
                  table: PostTable,
                },
              }}
              componentBlocks={{ embed: Embed }}
            />
          </div>
        </div>
      </section>
    </article>
  );
}
