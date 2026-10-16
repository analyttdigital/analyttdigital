# Builder (visual page builder)

Additive to the existing Keystatic site — do not remove Keystatic.

- Builder content lives in `src/content/pages/*.json`, `src/content/shared/*.json`,
  `src/content/theme.json` (JSON). Keystatic content lives in
  `src/content/<locale>/` (YAML/Markdown). The two trees must not overlap.
- Every builder component is registered through `src/builder/registry/`,
  never hard wired into the config (see `.tasks/visual-page-builder/PROJECT.md`).
- Heavy client libs (gsap, three) load dynamically and respect the `editing` flag.
