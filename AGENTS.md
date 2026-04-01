<!-- CODEX-MEMORY:START -->
## Project Context Management

- This project uses `.codex-memory/` as its structured memory directory.
- Do not keep appending to `codex-handoff.md` as the main handoff file.
- On a new session, read in this order:
  1. `.codex-memory/current.md`
  2. `.codex-memory/spec/index.md`
  3. if there is an active task, `.codex-memory/tasks/index.md` and the task `brief.md`
- Do not load `.codex-memory/archive/` by default.
- If there is a frozen legacy handoff, treat it as migration history only, not as the main startup file.

## `current.md` Rules

- `current.md` keeps only current effective information.
- It should be overwritten, not continuously appended.
- Recommended sections:
  - current goal
  - scope / not doing
  - current status
  - stable constraints
  - key references
  - risks / next step

## `spec/` Rules

- Put stable long-lived rules in `.codex-memory/spec/`.
- If the same rule stays useful across multiple sessions or topics, promote it from current/task notes into `spec/`.

## `tasks/` Rules

- Large ongoing tasks should use `.codex-memory/tasks/active/<task>/`.
- Each active task should have:
  - `brief.md`
  - `decisions.md`
  - `refs.md`
- Move completed tasks into `.codex-memory/tasks/archive/`.

## `archive/` Rules

- Use `archive/` for old rounds, replaced goals, one-off adjustments, and obsolete decisions.
- Archive is for tracing history only, not for current startup.

## Update Timing

- Update `.codex-memory/current.md` when conversations get long, the work becomes complex, the phase changes, or before ending the current thread.
- If the work belongs to an active task, update that task's files as well.
<!-- CODEX-MEMORY:END -->

## Project Rules

- Treat this project as a long-running, multi-session collaboration. At the start of each new session, read `AGENTS.md` first, then follow the `.codex-memory/` startup order defined above.
- Use relevant skills when the task reaches the matching phase, especially structured planning/context persistence skills such as `planning-with-files` and the codex memory skills. Use Figma-related capabilities when visual architecture, flows, or UI structure need to be clarified.

## Database Conventions

- Core business tables should include explicit status fields where the business flow requires enable/disable or approval state management.
- Use these audit fields by default in MySQL tables unless a specific table clearly does not need them:
  - `creator` `varchar`
  - `create_time` `datetime`
  - `updater` `varchar`
  - `update_time` `datetime`
- Do not assume a global logical-delete field by default.
- For deletion strategy, decide case by case with the user whether a table should use physical delete or a logical-delete field such as `is_del`.
