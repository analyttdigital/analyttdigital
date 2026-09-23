import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="grain">
      <Head>
        <meta name="theme-color" content="#4f4b63" />
      </Head>
      <body className="bg-paper font-sans text-ink antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
