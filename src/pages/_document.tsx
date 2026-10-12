import { Head, Html, Main, NextScript } from 'next/document';

import { fontsClass } from '@/fonts/fonts';

export default function Document() {
  return (
    <Html lang="en" className={fontsClass}>
      <Head>
        {/* The rail is transparent over the field at rest, so the browser
            chrome is tinted with the field itself. */}
        <meta name="theme-color" content="#393154" />
      </Head>
      {/* Page ground is the deep band; each band paints its own ground over it. */}
      <body className="font-sans text-primary-100 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}