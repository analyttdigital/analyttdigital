import type { AppProps } from 'next/app';
import { Archivo } from 'next/font/google';

import { SiteLayout } from '@/components/layout/site-layout';
import { LocaleProvider } from '@/lib/content/chrome';
import type { PageProps } from '@/lib/keystatic/getStaticProps';

import '@/styles/globals.css';

// The sheet is set in one variable family, both weight and width axes —
// condensed for table columns, expanded black for mastheads. `latin`
// covers both locales: Kiswahili uses no diacritics.
const sheet = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sheet',
  display: 'swap',
});

type Props = AppProps & { pageProps: PageProps };

export default function App({ Component, pageProps, router }: Props) {
  // /keystatic renders the admin UI untouched, outside the site layout.
  if (router.pathname.startsWith('/keystatic')) {
    return (
      <div className={sheet.variable}>
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <div className={sheet.variable}>
      <LocaleProvider locale={pageProps.locale}>
        <SiteLayout layout={pageProps.bundle?.layout}>
          <Component {...pageProps} />
        </SiteLayout>
      </LocaleProvider>
    </div>
  );
}
