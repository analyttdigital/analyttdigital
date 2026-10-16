import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { BuilderRender } from "@/builder/render/render";
import { ThemeProvider } from "@/builder/render/theme-provider";
import { fileToRoute, routeToSlug } from "@/builder/render/routes";
import { PageSchema } from "@/builder/schema/page";
import type { Page } from "@/builder/schema/page";
import { parseThemeFile } from "@/builder/schema/theme-file";
import type { Theme } from "@/builder/schema/theme-file";
import { builderFontsClass } from "@/builder/theme/fonts";
import { defaultTheme } from "@/builder/theme/defaults";

/**
 * Builder public renderer (M3). Builder pages live under `/p/*` (never the
 * site root) — see `src/builder/render/routes.ts`. Drafts and unknown slugs
 * 404. Content is build-time JSON; a publish commit redeploys the site.
 */

interface Props {
  page: Page;
  theme: Theme;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { getStore } = await import("@/builder/storage");
  const store = getStore();
  const files = await store.list("pages");
  const paths = files
    .map((f) => fileToRoute(f))
    .filter((r): r is string => r !== null)
    .map((route) => ({ params: { slug: route === "/p" ? [] : [route.slice(3)] } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const segments = params?.slug;
  const slug = routeToSlug(Array.isArray(segments) ? segments : undefined);
  if (slug === null) return { notFound: true };

  const { getStore } = await import("@/builder/storage");
  const store = getStore();

  const stored = await store.read<unknown>(`pages/${slug}.json`);
  if (stored === null) return { notFound: true };
  const parsed = PageSchema.safeParse(stored.data);
  if (!parsed.success || parsed.data.draft) return { notFound: true };

  const themeStored = await store.read<unknown>("theme.json");
  const themeResult = themeStored ? parseThemeFileSafe(themeStored.data) : null;

  return {
    props: {
      page: parsed.data,
      theme: themeResult ?? defaultTheme,
    },
  };
};

function parseThemeFileSafe(data: unknown): Theme | null {
  try {
    return parseThemeFile(data);
  } catch {
    return null;
  }
}

export default function BuilderPage({ page, theme }: Props) {
  return (
    <>
      <Head>
        <title>{page.meta.title}</title>
        {page.meta.description && <meta name="description" content={page.meta.description} />}
        {page.meta.ogImage && <meta property="og:image" content={page.meta.ogImage} />}
      </Head>
      <div className={builderFontsClass}>
        <ThemeProvider theme={theme}>
          <BuilderRender page={page} />
        </ThemeProvider>
      </div>
    </>
  );
}
