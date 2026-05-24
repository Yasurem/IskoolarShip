# IskoolarShip Mobile Claude Notes

## Start Here

Claude Code should read this file after:

1. [../../CLAUDE.md](../../CLAUDE.md)
2. [../../AGENTS.md](../../AGENTS.md)
3. [AGENTS.md](AGENTS.md)

## Claude-Specific Mobile Workflow

- Treat `apps/mobile` as the working root for mobile commands after reading root guidance.
- Keep student profile and document state local-first.
- Use shared package types and algorithms instead of creating mobile-only duplicates.
- Keep React Native props, hooks, navigation params, local storage payloads, and API responses strictly typed.
- When adding screens, make the algorithm outputs explainable rather than opaque.
- If a requested mobile feature requires sending student data to the API, stop and ask because that conflicts with the current PRD.

## Mobile Handoff Checklist

- Note whether local storage, catalog fetching, cache fallback, or algorithm output changed.
- Note whether Expo startup/typecheck/lint was run.
- Note any unverified Android-specific behavior.
