import Head from 'next/head';

import { BlogPostView } from '@/components/sections/blog-post';
import { blogBasePath } from '@/lib/content/blog';
import {
  blogPostPaths,
  getBlogPostStaticProps,
  type BlogPostProps,
} from '@/lib/keystatic/getStaticProps';
import { site } from '@/lib/site';

export async function getStaticPaths() {
  const slugs = await blogPostPaths('en');
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking' as const,
  };
}

export async function getStaticProps({ params }: { params?: { slug?: string } }) {
  if (!params?.slug) return { notFound: true as const };
  return getBlogPostStaticProps('en', params.slug);
}

/** EN post page. Unknown slugs are 404 — never another post. */
export default function BlogPostPage({ blogPost, blogCopy, locale }: BlogPostProps) {
  return (
    <>
      <Head>
        <title>{`${site.name} — ${blogPost.title}`}</title>
        <meta name="description" content={blogPost.excerpt} />
        <meta property="og:title" content={blogPost.title} />
        <meta property="og:description" content={blogPost.excerpt} />
        <meta property="og:type" content="article" />
      </Head>

      <BlogPostView
        data={{ post: blogPost, copy: blogCopy }}
        basePath={blogBasePath(locale)}
        locale={locale}
      />
    </>
  );
}
