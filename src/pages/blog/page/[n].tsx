import Head from 'next/head';

import { BlogList } from '@/components/sections/blog-list';
import { BLOG_PAGE_SIZE, blogBasePath } from '@/lib/content/blog';
import { resolveSeo } from '@/lib/content/seo';
import {
  blogPagePaths,
  getBlogIndexStaticProps,
  type BlogIndexProps,
} from '@/lib/keystatic/getStaticProps';

export async function getStaticPaths() {
  const pages = await blogPagePaths('en');
  return {
    paths: pages.map((n) => ({ params: { n: String(n) } })),
    fallback: 'blocking' as const,
  };
}

export async function getStaticProps(ctx: { params?: { n?: string }, preview?: boolean, previewData?: unknown }) {
  const n = Number(ctx.params?.n);
  if (n === 1) return { redirect: { destination: '/blog', permanent: false } };
  return getBlogIndexStaticProps('en', n, ctx.preview, ctx.previewData);
}

/** EN blog index, pages 2+. Page 1 redirects to `/blog`. */
export default function BlogPageN({ blogIndex, locale }: BlogIndexProps) {
  const basePath = blogBasePath(locale);
  const seo = resolveSeo(
    { title: `${blogIndex.headline.replace(/\n/g, ' ')} — Page ${blogIndex.page}`, description: blogIndex.body },
    `${basePath}/page/${blogIndex.page}`,
  );
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
      </Head>

      <BlogList
        data={blogIndex}
        basePath={basePath}
        locale={locale}
        startIndex={(blogIndex.page - 1) * BLOG_PAGE_SIZE}
      />
    </>
  );
}
