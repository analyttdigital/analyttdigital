import type { AppProps } from 'next/app';

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
import { site } from '@/lib/site';
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { useEffect, useRef } from "react";
import PageTransitionLoader from "@/components/layout/PageTransitionLoader";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// @ts-expect-error
import '../styles/globals.css';

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
  if (router.pathname.startsWith('/keystatic')) {
    return (
      <div className={fontsClass}>
        <Component {...pageProps} />
      </div>
    );
  }

  // Typed once: `AppProps` types pageProps as `any`, which cannot index `defaults`.
  const locale: Locale = (pageProps as PageProps).locale ?? defaultLocale;

	return (
		<div className={fontsClass}>
			<ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
				{/* Error pages (404/500) carry no bundle, so they render from code
				 * defaults instead of the header's demo fallback. The cast recovers
				 * the `PageProps` type `AppProps`'s `any` pageProps swallows. */}
				<LocaleProvider locale={(pageProps as PageProps).locale ?? defaultLocale}>
					<PageTransitionLoader
						img={{ src: "/img/logo-alt.svg" }}
						message="Loading"
					/>
					<SiteLayout
						layout={(pageProps as PageProps).bundle?.layout ?? defaults[locale].layout}
					>
						<Component {...pageProps} />
					</SiteLayout>
				</LocaleProvider>
			</ReactLenis>
			{/* Draft-mode banner (K5): `preview` in page props means draft mode
			 * turned this view into a fresh (uncached) render, so offer the
			 * way out. A plain form POST keeps the banner JS-free. */}
			{(pageProps as PageProps).preview ? (
				<form
					action="/api/preview/end"
					method="POST"
					className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center gap-3 px-4 py-2 text-xs font-medium"
					style={{ backgroundColor: site.themeColor, color: "#ffffff" }}
				>
					<span>
						Preview mode
						{typeof (pageProps as PageProps).preview?.branch === "string"
							? ` · branch ${(pageProps as PageProps).preview?.branch}`
							: " · local"}
					</span>
					<button
						type="submit"
						className="rounded px-2 py-1 border border-white/40 hover:bg-white/10"
					>
						End preview
					</button>
				</form>
			) : null}
			<Analytics />
			<SpeedInsights />
		</div>
	);
}