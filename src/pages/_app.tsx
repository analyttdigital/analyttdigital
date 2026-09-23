import type { AppProps } from 'next/app';
import { Inter, Manrope, Newsreader, Roboto_Mono } from 'next/font/google';

import { SiteLayout } from '@/components/layout/site-layout';
import { defaultLocale } from '@/lib/content/types';
import type { PageProps } from '@/lib/keystatic/getStaticProps';

import '@/styles/globals.css';

// Self-hosted fonts wired to the CSS variables referenced in tailwind.config.ts.
const display = Manrope({ subsets: ['latin'], variable: '--font-display' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif' });
const mono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

type Props = AppProps & { pageProps: PageProps };

export default function App({ Component, pageProps, router }: Props) {
  // /keystatic renders the admin UI untouched, outside the site layout.
  if (router.pathname.startsWith('/keystatic')) {
    return (
      <div className={`${display.variable} ${mono.variable}`}>
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <div className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable}`}>
      <SiteLayout layout={pageProps.bundle?.layout}>
        <Component {...pageProps} />
      </SiteLayout>
    </div>
  );
}
