import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Faces, declared once and mounted on `<html>` in `_document.tsx` (and on a
 * wrapper div in `_app.tsx`, because Next only extracts the `@font-face`
 * rules through the `_app` module graph).
 *
 * Three jobs. Mont-Black fronts Brother 1816 for every display size; Google
 * Sans Flex is the default face for all reading text; IBM Plex Mono keeps the
 * label/unit voice. Kiswahili uses no diacritics, so `latin` covers both
 * locales.
 */

export const mont = localFont({
	src: "./mont/Mont-Heavy.woff2",
	weight: "900",
	variable: "--font-display",
	display: "swap",
});

export const brother = localFont({
  src: './Brother1816/Brother-1816-Black.woff2',
  weight: '900',
  variable: '--font-brother',
  display: 'swap',
});

export const sans = localFont({
  src: [
    { path: './GoogleSansFlex/google-sans-flex-latin-100-normal.woff2', weight: '100', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-200-normal.woff2', weight: '200', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-800-normal.woff2', weight: '800', style: 'normal' },
    { path: './GoogleSansFlex/google-sans-flex-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const mono = localFont({
	src: "./mont/Mont-Variable-Regular.woff2",
	variable: "--font-mono",
	display: "swap",
});

export const fontsClass = `${mont.variable} ${brother.variable} ${sans.variable} ${mono.variable}`;
