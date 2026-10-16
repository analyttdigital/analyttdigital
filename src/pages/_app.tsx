import type { AppProps } from 'next/app';
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { SiteLayout } from '@/components/layout/site-layout';
import { LocaleProvider } from '@/lib/content/chrome';
import { defaults } from '@/lib/content/defaults';
import { defaultLocale, type Locale } from '@/lib/content/types';
// Imported here as well as in `_document` on purpose: Next extracts a
// `next/font` family's `@font-face` and variable class through the `_app`
// module graph, so a family imported only by `_document` never has its
// variable defined. `_document` mounts the classes on `<Html>` (where `body`
// can see them); this import is what makes the CSS exist at all.
import { fontsClass } from '@/fonts/fonts';
import type { PageProps } from '@/lib/keystatic/getStaticProps';
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { useEffect, useRef } from "react";

import '../styles/globals.css';
// Puck editor styles (M3). Global CSS must live in `_app` under Pages Router;
// it loads site-wide but only paints inside `/admin` and builder pages.
import "@measured/puck/puck.css";
// Builder curated faces (Fontsource, self-hosted woff2). Same global-CSS rule.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/700.css";

type Props = AppProps & { pageProps: PageProps };

export default function App({ Component, pageProps, router }: Props) {
    const lenisRef = useRef<LenisRef>(null);

    useEffect(() => {
        if (!router.pathname.startsWith("/keystatic")) {
            function update(data: { timestamp: number }) {
				const time = data.timestamp;
				lenisRef.current?.lenis?.raf(time);
			}

			frame.update(update, true);

			return () => cancelFrame(update);
		}
		
	}, []);
  // /keystatic renders the admin UI untouched, outside the site layout.
  // It still goes through `<Component />`: a bare wrapper here would drop the
  // page and the admin UI would never mount.
  // /admin (M3 visual builder) likewise needs the bare canvas, free of the
  // site nav/footer, or the Puck shell would render inside the marketing chrome.
  // (M9 visual check) /p likewise renders bare: builder pages get their chrome
  // from layouts.json shared docs, never the Keystatic site layout.
  // (M7) The admin branch additionally gets the NextAuth session provider.
  if (
    router.pathname.startsWith('/keystatic') ||
    router.pathname.startsWith('/admin') ||
    router.pathname === '/p' ||
    router.pathname.startsWith('/p/')
  ) {
    const session = (pageProps as { session?: Session }).session;
    return (
      <SessionProvider session={session}>
        <div className={fontsClass}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    );
  }
  // Typed once: `AppProps` types pageProps as `any`, which cannot index `defaults`.
  const locale: Locale = (pageProps as PageProps).locale ?? defaultLocale;

	return (
		<div className={fontsClass}>
			<ReactLenis root options={{ autoRaf: false }} ref={lenisRef} >
			{/* Error pages (404/500) carry no bundle, so they render from code
			 * defaults instead of the header's demo fallback. The cast recovers
			 * the `PageProps` type `AppProps`'s `any` pageProps swallows. */}
			<LocaleProvider locale={(pageProps as PageProps).locale ?? defaultLocale}>
				<SiteLayout layout={(pageProps as PageProps).bundle?.layout ?? defaults[locale].layout}>
					<Component {...pageProps} />
				</SiteLayout>
              </LocaleProvider>
            </ReactLenis>
		</div>
	);
}