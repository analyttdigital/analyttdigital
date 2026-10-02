# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary buyer: the founder, owner, or operator of a startup or small business in Kenya (working across East Africa) who spends on advertising — Google, Meta, TikTok, YouTube, LinkedIn — and cannot trust what the spending returns. They are self-serve on ads: budgets are committed, reporting stops at reach and impressions, and the next budget decision gets made on gut feel.

Job they are hiring Analytt Digital for: make ad spend measurable and defensible — know which channels deserve money, where the funnel leaks, and what each shilling actually returns — then grow from that baseline.

Secondary audience: a small in-house marketer or agency operator who has to read and defend the numbers.

The visitor arrives skeptical of marketing claims and allergic to vanity metrics. Trust is the conversion currency.

## Product Purpose

A single marketing site (one homepage per locale) whose job is to convert a skeptical Kenyan founder into a booked audit call. It exists because the agency's position depends on measurement credibility, not on being the loudest marketer in the room — so the site must itself demonstrate measurement: concrete, specific, plain-language claims that survive scrutiny, and an obvious, low-friction next step.

Success means qualified audit requests booked from the site, and a visitor who leaves understanding exactly what the agency does and what it costs them to find out.

## Positioning

Measurement-first performance marketing, not an ad buyer. The mechanism: measurement and attribution are set up and audited *before* campaigns launch ("if it cannot be measured, it is not launched"), every report ends in a named action — what to scale, what to cut, what to test — and the engagement is designed to end when the client's own team can make the next call unaided.

The differentiator a neighbouring agency cannot truthfully copy is the transfer of capability, not the management of spend. Positioning line in use: "Decisions, not dashboards." "A measurement-first agency, by design."

## Operating Context

- Intake runs through a call scheduler; a booking link is expected to replace or accompany the current `mailto:hello@analyttdigital.com` CTAs. The exact URL is not yet decided.
- The offer that drives conversion is a free audit of the client's current setup, framed around recoverable wasted spend. No deck, no obligation, just findings.
- Delivery model behind the site: a five-step engagement — Diagnose → Blueprint → Launch → Optimise → Scale — with weekly optimisation reviews and a 90-day planning horizon.
- The agency works with real budgets in Kenyan shillings and talks in ROAS, CPL, CPA and revenue attribution; the site's language should stay in those units rather than abstract marketing terms.
- Content is edited by the team through Keystatic at `/keystatic` (local-storage mode, no login), which writes YAML into `src/content/<locale>/` at build time. Code defaults in `src/lib/content/defaults.ts` are the fallback, so a fresh checkout renders a complete site with zero CMS edits.
- Locales: English at `/`, Kiswahili at `/sw/home`. Both locales are maintained as peers; neither is a secondary afterthought.

## Capabilities and Constraints

- Scope is a landing page, not a product surface: one long scrolling homepage per locale, no app, dashboard, login, or member area.
- Channels and services named in positioning: Google Ads, YouTube, Meta, TikTok, LinkedIn, GA4 + GTM / Tag Manager, server-side tracking, multi-touch attribution, content and SEO, monthly reporting.
- Proof assets in the content model: selected-work case entries, a four-number proof band, an industries index, an insights article list. Insights rows currently point at `#`; there are no published articles yet.
- Copy lives in `defaults.ts` (en + sw) and is overridable per-block in Keystatic. Section components must not hard-code marketing copy.
- Locale routing is route-based (`/` for en, `/sw/home` for sw); there is no bare `/sw` route and no bare client-side locale switcher today.
- Reduced motion is a durable requirement: Lenis smooth scroll and all scroll reveals must respect `prefers-reduced-motion`.
- Undecided: the scheduler URL; whether named clients are replaced with anonymised labels or published with permission; where real insight articles will come from; whether insight content becomes its own collection once articles exist.

## Brand Commitments

- Name: **Analytt Digital**. Wordmark is set as `analytt` + emphasized `digital`; `public/img/logo.svg` and `public/img/logo-text.svg` are the only committed assets, and the site currently falls back to inline text branding.
- Colors are fixed brand identity: primary `#4f4b63`, accent `#f04f26`, light theme. No ad-hoc colors outside these token families.
- Voice: plain-spoken, specific, measurement-first. Confident and diagnostic rather than hyped. Explicitly anti-vanity-metric — the copy rejects reach and impression reporting as outcomes.
- Positioning lines are owned copy, not filler: "Decisions, not dashboards.", "A measurement-first agency, by design.", "Performance marketing & growth infrastructure, from Nairobi."
- Provenance: Nairobi, Kenya; serves East Africa; legal line "© 2026 Analytt Digital."
- Canonical domain `analyttdigital.com`; contact `hello@analyttdigital.com`.

## Evidence on Hand

- **Case studies (Work section):** four engagements — a Nairobi beard-care retailer, a tech company, a real-estate developer, a logistics company. **The performance figures are real** (KES 2.4M monthly revenue within 90 days; 1,200+ leads/month at KES 280 CPL, −84%; 37 property inquiries/week, 9×; 47 page-1 keywords in 8 months). **The client names are not cleared for publication** — they need anonymised labels or explicit permission before this content can be shown as social proof. Do not present these as attributable case studies until then.
- **Proof band (Stats):** 100% of campaigns tracked to conversion, 7-day optimisation cycle, zero vanity metrics reported, 8+ years driving growth. Treat the first three as operating commitments the agency actually makes; the "8+ yrs" figure needs confirming against company fact.
- **Hero dashboard cluster:** ROAS 4.2×, CPL KES 280, leads 1,200+ appear as a floating product-UI demonstration. These are illustrative product display values, not verified client proof, and must not be read as claims.
- **Recoverable-spend claim:** "Most audits surface KES 50K–200K in recoverable spend" is a headline claim that has not been substantiated with data.
- **No testimonials, no client logos, no case-study documents, no pricing, no screenshots of real dashboards** exist in the repo. Nothing in the site's proof layer may be invented to fill those gaps.
- Assets on disk: `public/img/logo.svg`, `public/img/logo-text.svg`. No favicon set, no og-image, no sitemap/robots.

## Product Principles

1. **Proof over promise.** Every persuasive claim must be traceable to something real. When evidence is missing, the site argues from method and mechanism instead of inventing a number.
2. **Measurement is the product.** The site's own behaviour should model the discipline it sells — specific numbers, named actions, no decoration that contradicts the claim of rigor.
3. **Skepticism is the default visitor.** Assume the reader has seen ten agencies claim "we grow your revenue". Earn attention with one concrete, checkable detail rather than volume.
4. **One obvious next step.** The page's job ends at a booked audit call. Every section either builds the case for that call or gets out of the way.
5. **Capability transfer, not dependency.** Language and structure should leave the client more able to run their own numbers — that is the offer, and it is also the differentiator.
6. **Both locales are the product.** English and Kiswahili ship together; no section may ship in one language only.

## Accessibility & Inclusion

No formal conformance target has been set for this site.

Known requirement: `prefers-reduced-motion` must be honoured by smooth scroll and every scroll-driven reveal (established in the repo rules, `AGENTS.md`).

Standing constraint on any new capability: interactive elements must be reachable and operable by keyboard, and any new motion or 3D layer must degrade to a static, readable state — the audience includes readers on low-power devices and constrained connections across the region.