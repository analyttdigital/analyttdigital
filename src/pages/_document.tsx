import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#4f4b63" />
      </Head>
      {/* Page ground comes from the `body` rule (mist-100); sections paint
          their own canvas/stage surfaces over it. */}
      <body className="bg-mist-100 font-sans text-ink antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
