import { Archivo, Fragment_Mono, Space_Grotesk } from 'next/font/google';

/**
 * Faces, declared once and mounted on `<html>` in `_document.tsx`.
 *
 * They have to live here rather than in `_app.tsx` for a specific reason:
 * `next/font`'s `variable` option emits a class that defines the CSS variable,
 * and if that class is applied to a div inside `<body>` then `body` itself
 * cannot see the variable — so any `font-sans` declared on `body` resolves to
 * an empty `var()` and the whole declaration is dropped at computed-value time,
 * silently leaving the page in Times New Roman. Mounting on `<Html>` puts the
 * variables in scope for `body` and everything below it.
 *
 * Three faces, three jobs. Space Grotesk is set light and very tight and owns
 * every display size; Archivo reads; Fragment Mono is the reference's own mono
 * and labels every figure, unit and state. `latin` covers both locales —
 * Kiswahili uses no diacritics.
 */

export const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const sans = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const mono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
});

export const fontsClass = `${display.variable} ${sans.variable} ${mono.variable}`;