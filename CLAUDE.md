# IskoolarShip Claude Notes

## Start Here

Claude Code should read this file first, then read [AGENTS.md](AGENTS.md) for shared workspace rules.

For app-specific work, also read:

- [apps/mobile/CLAUDE.md](apps/mobile/CLAUDE.md) and [apps/mobile/AGENTS.md](apps/mobile/AGENTS.md) for Expo mobile work.
- [apps/api/CLAUDE.md](apps/api/CLAUDE.md) and [apps/api/AGENTS.md](apps/api/AGENTS.md) for Express API work.

The product requirements are in [docs/PRD.md](docs/PRD.md).

## Claude-Specific Workflow

- Use [AGENTS.md](AGENTS.md) as the source of truth for shared rules.
- Before editing, identify whether the change belongs to the root workspace, `apps/mobile`, `apps/api`, or a shared package.
- Prefer small, scoped changes that preserve the PRD boundaries.
- Enforce the root TypeScript standards during code edits, especially strict typing, no casual `any`, shared domain types, and runtime validation at boundaries.
- Do not introduce backend student-data endpoints or server-side recommendation processing unless the PRD is explicitly revised.
- When changing app behavior, keep the local privacy guarantee visible in code and documentation.

## Handoff Notes

- Mention which instruction files were followed when handing off complex work.
- If app-level instructions conflict with root guidance, follow the stricter privacy/database safety rule and flag the conflict.
- Keep Claude-only notes in this file or the matching app-level `CLAUDE.md`; keep agent-neutral rules in `AGENTS.md`.
