# DESIGN.md — Homepage Visual System (agent reference)

> Source of truth for new page sections. Match this language; do not invent new tokens, radii, or motion. No global restyle in this task.

## Tokens (Tailwind only, no ad-hoc hex)

- Families `50-950` via CSS channels in `src/styles/globals.css`, consumed as `primary-*`, `ink-*`, `surface-*`, `paper-*`, `accent-*` (`tailwind.config.ts`).
- `primary` (#4f4b63 at 600): violet-ink field; deep grounds `primary-800/900/950`.
- `paper` (#fff stock): light stage `bg-paper`, plates `bg-paper-50`, hairlines `ink-950/10`.
- `ink`: type on paper (`ink-950` headlines, `ink-500` body, `ink-400/300` meta).
- `accent` (#f04f26 ember): live only (active node, recovering figure, primary ask, meter fill, resolve edge). Never decoration.
- Grounds: `ground` (field), `ground--deep`, `ground--paper`; joins via `Band` (`src/components/layout/band.tsx`): rare pixel-dither `resolve`, otherwise `seam` hairline + travelling packet (`globals.css` `.seam`).

## Type

- Faces via `_app` vars: `font-display` (headlines, numerals `.num`), `font-sans` (body), `font-mono` (labels, eyebrows, meta).
- Eyebrow: `.label` mono uppercase tracked (`text-ink-500` on paper, `text-primary-300` on dark); live dot variant `.label--live`.
- Headlines: `.title` display tight (`tracking-tightest`), ink-950 on paper / primary-50 on dark, ember accent span for last line or key phrase. Sizes `clamp(2.2rem,4-5vw,3.4-4.4rem)`.
- Body: `13-14px/1.8-1.85 ink-500`, max `52-62ch`; meta mono `9.5-10px tracking .14-.16em ink-400`.
- Headline entrances: `InViewTitle` blur or `MaskedLine`/`GsapReveal[data-rise]` rise + de-blur; never plain fade.

## Section rhythm (homepage)

- Stage: `relative overflow-hidden bg-paper py-24 md:py-32`, inner `mx-auto max-w-7xl px-5 md:px-8`. Dark discussions use `bg-ink-950` rounded panel (`rounded-[2rem]`, ring `paper-50/10`).
- Head pattern: eyebrow + huge title left, lede paragraph right (`flex flex-wrap items-end justify-between gap-8`), then instrument below (`mt-12/14`).
- Instruments: ledger panel (`bg-paper-50 rounded-[2rem] ring-ink-950/10 shadow-soft`), ink plates (`bg-ink-950`), tilt plates (`rounded-3xl bg-paper-50`), strip (`Stats`: hairline-ruled 4-col, `CountUp` figures, ghost icon chip, ember dot + `01/04` index).
- Mosaic (`Industries`): display names at positional scales + mono index, hover ember.
- Filmstrip (`Work`): snap-x cards `max-w-[400px]`, top media (photo else token flow-lines), ember `CountUp` proof, progress meter + `01/04` counter, ink pill prev/next.
- Asks: `Cta` (paper close, orb backdrop, `GlowButton` ember magnetic, last headline line ember), `CtaSplit` (ink panel + violet card), `CtaBanner` (ember panel, paper pill, ghost rings).
- Buttons: ink pill (`bg-ink-950 text-paper-50 rounded-full`) or `GlowButton` ember; chips `rounded-full border-ink-950/15`; trail `arrowRight` MDI.
- Media: always `DynamicImage`/`MediaSlot` (`.slot` frame + corner squares until artwork ships); decorative layers `aria-hidden`, radial washes only.
- Motion: `ScrollSection` pins (portal, shrink+cover), `GsapReveal` rises, `TiltCard(max 5)` + ember spotlight, `Magnetic` on asks, `CountUp` on proof figures; honor `prefers-reduced-motion`.

## New sections must

- Accept `data` + `classes` (+ `className`/`id`), resolve icons via `MdiIcon`, media via `DynamicImage`/`MediaSlot`, keep copy in `defaults.ts` (en+sw), positional defaults (alternate tints, icon cycles, scale rhythms) in code, not content.
