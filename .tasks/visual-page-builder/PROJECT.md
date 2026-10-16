# Project: Visual Page Builder CMS

## 1. Goal
A visual, drag and drop page and layout builder for Next.js (Pages Router, `src/` directory) used as a Git backed CMS for landing pages and dashboards. It replaces form based editing (Keystatic) while keeping its best traits: content stored as files in the repo, editable locally, and editable in production by committing to GitHub.

### Objectives
- Visual editing of pages with a component palette, canvas, property panel, and responsive preview.
- Theme customization: color palette, border radius, typography scale, fonts, spacing density, shadows. Applied globally via design tokens.
- Built in components: layout (row, column, grid, section, container, spacer), typography, buttons, images, lists, tables, forms/inputs, cards, icons.
- Custom component registry so developers can add complex components (GSAP, three.js, charts) and expose their props as editable fields.
- Global shared elements (header, footer, optionally announcement bar) edited once, reused by every page.
- Storage adapters: local filesystem in development, GitHub commit/push in production, behind one interface.
- Icons via Material Design Icons (`@mdi/js` + `@mdi/react`, optional `@mdi/font`).

### Non goals (for now)
- Real time multi user collaboration.
- Hosting a database. Git is the database.
- App Router support.

## 2. Approved libraries
| Library | Purpose |
|---|---|
| `@measured/puck` (Puck) | Visual editor core: canvas, drag and drop, fields, config driven component registry |
| `@octokit/rest` | GitHub commits (Git Data API) from production |
| `zod` | Schemas for content, theme, and component props; validation on read and write |
| `tailwindcss` | Styling, driven by CSS variable design tokens |
| `@mdi/js`, `@mdi/react` | Tree shakable icons (`@mdi/font` optional for class based usage) |
| `next-auth` (GitHub provider) | Editor authentication in production, repo permission check |
| `gsap`, `three` | Only for custom registered components (loaded dynamically) |

Not approved unless the user confirms: Craft.js, Zustand (Puck exposes `usePuck`), any CSS-in-JS library.
Verify Puck API details (slots, overrides, plugins, `resolveData`) against the current Puck docs before implementing; names may differ by version.

## 3. Architecture

### 3.1 High level
```
Editor (/admin)  --Puck onPublish-->  /api/builder/*  --ContentStore-->  fs (dev) | GitHub (prod)
                                                                              |
Public site (/[[...slug]]) <-- getStaticProps reads content JSON <-- build <-- commit triggers deploy
```

### 3.2 Folder structure
```
src/
  pages/
    [[...slug]].tsx            # public renderer (getStaticPaths/getStaticProps, ISR optional)
    admin/[[...puckPath]].tsx  # Puck editor (auth gated, client only)
    api/
      auth/[...nextauth].ts
      builder/
        page.ts                # GET/PUT one page
        pages.ts               # GET list, POST create, DELETE
        shared.ts              # GET/PUT header, footer, layouts
        theme.ts               # GET/PUT theme tokens
        media.ts               # POST upload (commits file to /public/uploads)
  builder/
    config/                    # buildConfig(): merges built ins + registered components + root
    registry/                  # registerComponent(), getRegistry(), types
    components/                # built in components, one folder each
      layout/ typography/ forms/ data/ media/ content/
    fields/                    # custom Puck fields: ColorField, RadiusField, FontField, IconField, SpacingField
    theme/                     # token schema, defaults, toCssVars(), tailwind preset, font loader
    shared/                    # global header/footer/layout docs and loader
    storage/
      types.ts                 # ContentStore interface
      fs-store.ts              # dev adapter
      github-store.ts          # prod adapter (Octokit, atomic multi file commit)
      index.ts                 # picks adapter from env
    schema/                    # Zod schemas: Page, SharedDoc, Theme, ComponentData
    render/                    # <Render/> wrapper, theme provider, editing flag context
    custom/                    # project specific registered components (examples: GsapReveal, ThreeScene)
  content/                     # source of truth, committed
    pages/*.json               # one file per page (path derived from filename or `meta.path`)
    shared/header.json
    shared/footer.json
    shared/layouts.json
    theme.json
  styles/
    globals.css                # tailwind + token CSS variables
```

### 3.3 Content model
Page file (`src/content/pages/<slug>.json`):
```json
{
  "schemaVersion": 1,
  "meta": { "title": "", "description": "", "path": "/", "layout": "default", "ogImage": "" },
  "puck": { "root": { "props": {} }, "content": [], "zones": {} }
}
```
- `puck` is Puck's native data shape. Everything else is ours.
- `layout` references an id in `shared/layouts.json`, which lists which shared docs (header, footer) wrap the page.
- Shared docs (header, footer) use the same Puck data shape and are edited in the same editor via a "Global" document switcher.
- Always carry `schemaVersion`; add migrations in `schema/migrations.ts` when shape changes.

### 3.4 Component registry
```ts
registerComponent({
  name: "ThreeScene",            // unique, PascalCase
  label: "3D Scene",
  category: "Advanced",
  icon: mdiCube,                 // optional mdi path
  schema: z.object({ model: z.string(), autoRotate: z.boolean().default(true) }), // source of truth
  fields: { ... },               // optional overrides; otherwise derived from schema
  defaultProps: { model: "", autoRotate: true },
  render: ThreeSceneComponent,   // receives props + { editing: boolean }
  client: { dynamic: true, ssr: false }, // wraps in next/dynamic for heavy libs
});
```
Rules:
- Registration happens in `src/builder/custom/index.ts` (imported once by the config builder). No edits to core files needed to add a component.
- Props are validated with the Zod schema; invalid saved props fall back to defaults and warn in the editor.
- Heavy libs (gsap, three) must be dynamically imported, clean up in `useEffect` return, and respect `editing` (pause or simplify animations while editing so drag and drop stays usable).
- Components must be pure functions of props. No fetching inside render; data comes via props or `resolveData`.

### 3.5 Theming
- `theme.json` holds tokens: `colors` (primary, secondary, accent, background, surface, text, muted, border, success, warning, danger, each with light and dark values), `radius` (none to full scale + default), `typography` (font families for heading, body, mono; base size; scale ratio; weights; line heights), `spacing` (density), `shadows`.
- `toCssVars(theme)` outputs CSS variables on `:root` (and `.dark`). Tailwind config maps utilities to variables (e.g. `bg-primary` is `rgb(var(--color-primary) / <alpha-value>)`), so changing a token restyles everything with no rebuild of components.
- Fonts: curated list loaded at build via `next/font` (works in Pages Router) or Fontsource; selected font names are stored in tokens. Custom font upload is a later milestone.
- Components may also expose per component overrides (e.g. a Button `radius` prop) which default to `inherit` from tokens.
- Editor has a Theme panel (custom Puck plugin or separate `/admin/theme` route) with live preview through CSS variables.

### 3.6 Storage and Git flow
`ContentStore` interface:
```ts
interface ContentStore {
  list(dir: string): Promise<string[]>;
  read<T>(path: string): Promise<{ data: T; sha?: string } | null>;
  write(changes: { path: string; content: string | Buffer; sha?: string }[], message: string): Promise<{ commitSha?: string }>;
  delete(path: string, message: string): Promise<void>;
}
```
- `fs-store`: used when `NODE_ENV=development` or `BUILDER_STORAGE=fs`. Writes straight to `src/content`.
- `github-store`: used when `BUILDER_STORAGE=github`. Uses Octokit Git Data API (blobs, tree, commit, update ref) so multi file saves are one atomic commit. Optimistic concurrency via file sha; on conflict return 409 and let the editor reload.
- Publish flow: editor Publish button, then `PUT /api/builder/page`, then Zod validate, then store.write, then commit to `BUILDER_BRANCH` (default `main`), then host redeploys. Optional mode `BUILDER_DRAFT_BRANCH`: commit to a draft branch and open a PR instead.
- Editor in production reads from GitHub (not the built bundle) so it always shows latest content.
- Public site reads from the filesystem at build time (`getStaticProps`). Optional on demand revalidation endpoint after commit.

### 3.7 Auth
- NextAuth with GitHub provider. Allow only users listed in `BUILDER_ALLOWED_USERS` or with push permission on the repo (checked via Octokit).
- All `/api/builder/*` and `/admin/*` require a session in production. In development, auth can be bypassed with `BUILDER_DEV_BYPASS_AUTH=true`.

### 3.8 Environment
```
BUILDER_STORAGE=fs|github
GITHUB_OWNER= GITHUB_REPO= BUILDER_BRANCH=main BUILDER_DRAFT_BRANCH=
GITHUB_TOKEN=            # fine grained PAT or app token, contents:write
NEXTAUTH_URL= NEXTAUTH_SECRET= GITHUB_ID= GITHUB_SECRET=
BUILDER_ALLOWED_USERS=comma,separated
BUILDER_DEV_BYPASS_AUTH=false
```

## 4. Conventions
- TypeScript strict, path alias `@/` to `src/`.
- One component per folder: `index.tsx`, `schema.ts`, `fields.ts` (if custom), `README` comment at top.
- Names: components PascalCase, files kebab-case, content files kebab-case slugs.
- Styling via Tailwind utilities and token classes only. No hardcoded hex colors in components.
- Accessibility: semantic elements, alt text field required for images, keyboard friendly forms.
- Package manager: yarn (`yarn.lock` is the lockfile). Scripts required: `dev`, `build`, `typecheck`, `lint` (`lint` currently broken repo-wide — typecheck is the gate).

## 6. How to add a component

One file in `src/builder/custom/`, one `registerComponent` call at its
bottom — no core edits. Copy `custom/callout.tsx`:

```ts
import { z } from "zod";
import { registerComponent } from "@/builder/registry";

export const BadgeSchema = z.object({
  label: z.string().describe("Label").default("New"),
  tone: z.enum(["info", "success"]).describe("Tone").default("info"),
});

export type BadgeProps = z.infer<typeof BadgeSchema>;

export function Badge({ label, editing }: BadgeProps & { editing?: boolean }) {
  return <span className="bg-bld-surface text-bld-text">{label}</span>;
}

registerComponent({
  name: "Badge",          // unique PascalCase
  label: "Badge",
  category: "Custom",     // palette group
  icon: mdiStar,          // optional MDI path (text-only Puck list ignores it)
  schema: BadgeSchema,    // source of truth: fields derive from it
  render: Badge,          // receives validated props + { editing }
});
```

Rules:

- The schema must be a Zod object. Supported field derivations: string,
  number, boolean, enum, arrays of objects, nested objects, and
  optional/default/nullable wrappers; `.describe()` becomes the field label.
  Anything else throws at registration — pass an explicit `fields` override
  for that key (it merges over derived fields; M1 custom fields live in
  `src/builder/fields/`).
- `defaultProps` is optional: omitted, it derives from `schema.parse({})`,
  which throws unless every key has a default — then pass it explicitly.
  Provided defaults validate at registration (fail fast).
- Saved props validate on every render; invalid props fall back to defaults
  with a dev-only console warning, so schema evolution never blanks the canvas.
- Read `editing` (prop or `useEditing()`) to pause animations, video, and
  submits in the canvas. Heavy libs (gsap, three) must lazy-`import()` inside
  the component; pass `client: true` (or `{ loading }`) to also skip SSR.
- Token classes only (`bld-*` via `src/builder/components/shared.ts` maps —
  never interpolated class names, Tailwind purges those). Arbitrary values go
  in `style` props through CSS variables.
- `src/builder/custom/index.ts` is imported once by `build-config.ts`;
  add `import "./badge";` there. M8 holds the GSAP/three.js examples.

## 7. Key risks and decisions
- Puck API changes between versions: pin the version and note it in TASKS.md Decisions.
- Tailwind class generation: dynamic class names are purged. Use token based classes or safelist and prefer style props for arbitrary values.
- GitHub rate limits and conflicts: batch writes into one commit; surface 409 clearly.
- Heavy client libs inside the editor canvas can hurt performance: use the `editing` flag.
