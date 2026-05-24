# IskoolarShip API Claude Notes

## Start Here

Claude Code should read this file after:

1. [../../CLAUDE.md](../../CLAUDE.md)
2. [../../AGENTS.md](../../AGENTS.md)
3. [AGENTS.md](AGENTS.md)

## Claude-Specific API Workflow

- Treat `apps/api` as the working root for API commands after reading root guidance.
- Keep the API catalog-only unless the PRD is revised.
- Do not add recommendation POST endpoints, student profile tables, or student document persistence.
- Keep Express routes, Supabase row mapping, environment config, and API responses strictly typed.
- Use shared types from `packages/types` once available.
- Keep Supabase credentials in environment variables and never commit secrets.

## API Handoff Checklist

- Note endpoint changes and response-shape changes.
- Note whether Supabase env values were inspected before any database write.
- Note whether `GET /health` and `GET /catalog` were smoke tested.
- Call out any unavailable Supabase or environment setup.
