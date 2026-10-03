import type { AppProps } from 'next/app';

import { SiteLayout } from '@/components/layout/site-layout';
import { LocaleProvider } from '@/lib/content/chrome';
// Imported here as well as in `_document` on purpose: Next extracts a
// `next/font` family's `@font-face` and variable class through the `_app`
// module graph, so a family imported only by `_document` never has its
// variable defined. `_document` mounts the classes on `<Html>` (where `body`
// can see them); this import is what makes the CSS exist at all.
import { fontsClass } from '@/lib/fonts';
import type { PageProps } from '@/lib/keystatic/getStaticProps';

import '@/styles/globals.css';

type Props = AppProps & { pageProps: PageProps };

export default function App({ Component, pageProps, router }: Props) {
  // /keystatic renders the admin UI untouched, outside the site layout.
  if (router.pathname.startsWith('/keystatic')) {
    return <div className={fontsClass} />;
  }

  return (
    <div className={fontsClass}>
      <LocaleProvider locale={pageProps.locale}>
        <SiteLayout layout={pageProps.bundle?.layout}>
          <Component {...pageProps} />
        </SiteLayout>
      </LocaleProvider>
    </div>
  );
}