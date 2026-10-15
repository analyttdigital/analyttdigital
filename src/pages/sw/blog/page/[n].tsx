import Head from 'next/head';

import { BlogList } from '@/components/sections/blog-list';
import { BLOG_PAGE_SIZE, blogBasePath } from '@/lib/content/blog';
import {
  blogPagePaths,
  getBlogIndexStaticProps,
  type BlogIndexProps,
} from '@/lib/keystatic/getStaticProps';
import { site } from '@/lib/site';

export async function getStaticPaths() {
  const pages = await blogPagePaths('sw');
  return {
    paths: pages.map((n) => ({ params: { n: String(n) } })),
    fallback: 'blocking' as const,
  };
}

export async function getStaticProps({ params }: { params?: { n?: string } }) {
  const n = Number(params?.n);
  if (n === 1) return { redirect: { destination: '/sw/blog', permanent: false } };
  return getBlogIndexStaticProps('sw', n);
}

/** SW blog index, pages 2+. Page 1 redirects to `/sw/blog`. */
export default function SwBlogPageN({ blogIndex, locale }: BlogIndexProps) {
  const basePath = blogBasePath(locale);
  return (
    <>
      <Head>
        <title>{`${site.name} — ${blogIndex.headline.replace(/\n/g, ' ')}`}</title>
        <meta name="description" content={blogIndex.body} />
        <meta property="og:title" content={site.name} />
        <meta property="og:description" content={blogIndex.body} />
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
