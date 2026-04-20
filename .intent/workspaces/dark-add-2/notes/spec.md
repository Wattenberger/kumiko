---
id: spec
title: Spec
tags: [spec]
pinned: true
created: "2026-04-16T03:35:40.259Z"
task:
  status: not_started
---

# Add dark mode support

## Goal
Users can switch the Kumiko app between light and dark themes via a toggle in the header. The choice follows the OS by default and is persisted across reloads.

## Tasks

- [ ] [Add theme tokens and store](intent://local/task/6773f1d7-ab6c-4f70-ab03-628e80c06194)

- [ ] [Add theme toggle UI and wire it up](intent://local/task/022f61a9-7230-4888-bb72-40b76601cdcc)

## Acceptance Criteria
- [ ] A visible theme toggle appears in the site header.
- [ ] Light and dark themes are both fully styled (no unstyled white/black regions in either mode).
- [ ] Theme preference persists across page reloads.
- [ ] Default is "follow system" on first visit.
- [ ] No visual regressions in light mode vs. current main.
- [ ] `npm run build` succeeds.

## Non-goals
- Redesigning the overall color palette.
- Adding more than two themes (only light + dark, with "system" as the follow option).
- Theming the generated SVG export output (exported SVGs stay black-on-transparent as today).
- Unit tests (this is a UI change verified manually).

## Assumptions
- Two tasks will be delegated sequentially (tokens/store first, then UI + wiring). (confirm?)
- OK to add a new file `src/stores/theme.js`. (confirm?)
- Toggle lives in the header next to the wordmark. (confirm?)
- Implementer may pick between a 2-state (light/dark) or 3-state (light/dark/system) UI toggle. (confirm?)

## Verification Plan
- Build: `npm run build`
- Dev run: `npm run dev` and manually exercise the toggle, reload, and OS dark-mode change.

## Rollback Plan
- Revert the two commits added by the implementor tasks. No data migrations or external services involved.