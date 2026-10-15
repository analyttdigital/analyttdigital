import Head from 'next/head';

import { BlogList } from '@/components/sections/blog-list';
import { BLOG_PAGE_SIZE, blogBasePath } from '@/lib/content/blog';
import {
  getBlogIndexStaticProps,
  type BlogIndexProps,
} from '@/lib/keystatic/getStaticProps';
import { site } from '@/lib/site';

export async function getStaticProps() {
  return getBlogIndexStaticProps('sw', 1);
}

/** SW blog index (page 1). Later pages live under `/sw/blog/page/[n]`. */
export default function SwBlogIndexPage({ blogIndex, locale }: BlogIndexProps) {
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
