# Builder (visual page builder)

Additive to the existing Keystatic site — do not remove Keystatic.

- Builder content lives in `src/content/pages/*.json`, `src/content/shared/*.json`,
  `src/content/theme.json` (JSON). Keystatic content lives in
  `src/content/<locale>/` (YAML/Markdown). The two trees must not overlap.
- Every builder component is registered through `src/builder/registry/`,
  never hard wired into the config (see `.tasks/visual-page-builder/PROJECT.md`).
- Heavy client libs (gsap, three) load dynamically and respect the `editing` flag.
- Theming (M1): tokens emit as scoped `--bld-*` variables on the
  `ThemeProvider` wrapper — never global `:root` — so the live site's tokens
  are untouched. Builder components use `bld-*` Tailwind utilities
  (`bg-bld-primary`, `font-bldBody`, `rounded-bld`, `shadow-bldMd`).
