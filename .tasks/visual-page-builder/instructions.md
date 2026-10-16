# Agent Instructions

Read this file first on every session. It tells you how to work on this project and how to hand off.

## Required reading order
1. `instructions.md` (this file)
2. `PROJECT.md` (goal, architecture, conventions)
3. `TASKS.md` (milestones, status, notes, progress log)

## Session start protocol
1. Read the three files above fully.
2. In `TASKS.md`, find the first milestone with status `IN_PROGRESS`; if none, the first `TODO` milestone whose dependencies are `DONE`.
3. Read the **Notes** of that milestone and the last 5 entries of the **Progress Log**.
4. Run `git status` and `git log -5 --oneline` to confirm the repo matches the log.
5. Set the task you are starting to `IN_PROGRESS` in `TASKS.md` before writing code.

## While working
- Work on one task at a time. Keep changes small and committed per task.
- Follow the conventions in `PROJECT.md` (stack, folder layout, naming, typing). Do not introduce libraries outside the approved list without adding a note in `TASKS.md` under "Decisions" and asking the user.
- Strict TypeScript. No `any` unless commented with a reason.
- Pages Router only. Source lives in `src/`. Do not create an `app/` directory.
- Every builder component must be registered through the registry API, never hard wired into the config.
- Content is data (JSON in `src/content/`). Never hardcode page content in components.
- If requirements are ambiguous, record the question in `TASKS.md` under "Open Questions" and continue with the safest assumption, stating it.

## Updating TASKS.md (mandatory)
After each task, and at least every 30 minutes of work:
- Tick checklist items `[x]` and update task `Status`.
- Add a dated line to the **Progress Log** (what changed, files touched, anything surprising).
- Put discoveries, gotchas, and decisions in the milestone's **Notes**.
- Never delete history. Strike through (`~~text~~`) obsolete items and explain why.

## Adding tasks or milestones ad hoc
- Append to the relevant milestone, or add a new milestone at the end using the template in `TASKS.md`.
- Give it the next ID (`M#` / `M#.#`), status `TODO`, dependencies, and a checklist.
- Log the addition in the Progress Log with the reason.

## Status values
`TODO` | `IN_PROGRESS` | `BLOCKED` | `DONE` | `DROPPED`
A task is `DONE` only when its acceptance checklist is fully ticked, `pnpm typecheck` and `pnpm lint` pass, and the app builds.

## Handoff protocol (end of every session)
1. Leave the repo in a building state, or mark the task `BLOCKED` with the exact error and the file/line.
2. Update `TASKS.md`: statuses, notes, and a final Progress Log entry titled `HANDOFF` containing:
   - What is done
   - What is in flight (files half edited)
   - The exact next step
   - Commands to verify the current state
3. Commit work. Do not leave uncommitted changes.

## Definition of done (all tasks)
- Types pass, lint passes, no console errors in editor or rendered page.
- Works in both modes: **dev (local filesystem)** and **production (GitHub commit)** where the task touches storage.
- Editor view and published view both render correctly.
- Docs (`PROJECT.md`) updated if architecture or conventions changed.

## Safety rules
- Never commit secrets. Tokens come from env vars (see `PROJECT.md` Environment).
- Never force push. Never rewrite history on the content branch.
- Validate all content with Zod before writing it to disk or GitHub.
