# IskoolarShip API Agent Notes

## Companion Docs

- Start with the root [../../AGENTS.md](../../AGENTS.md).
- Claude Code should also read [CLAUDE.md](CLAUDE.md).
- Product requirements live in [../../docs/PRD.md](../../docs/PRD.md).

## App Scope

This app is the Express.js read-only catalog API for IskoolarShip.

Responsibilities:

- Connect to Supabase/PostgreSQL.
- Read public scholarship catalog data.
- Return catalog responses to the mobile app.
- Provide health and debugging-friendly read endpoints.

Required endpoints:

```txt
GET /health
GET /catalog
GET /scholarships
GET /scholarships/:id
GET /documents
GET /scholarships/:id/documents
```

Non-responsibilities:

- Do not store student profiles.
- Do not store student document availability.
- Do not calculate recommendations on the server.
- Do not accept uploaded files.
- Do not process real scholarship applications.
- Do not provide public insert/update/delete catalog endpoints in the MVP.

## API Contract Rules

- Prefer `GET /catalog` as the mobile app's main sync endpoint.
- Keep response types aligned with `packages/types`.
- Include scholarship records, documents, required-document links, and a server `syncedAt` timestamp in catalog responses.
- Return stable error shapes for API failures.
- Do not leak Supabase service role keys or internal database errors to clients.

## TypeScript and Express Rules

- Follow the root TypeScript standards in [../../AGENTS.md](../../AGENTS.md).
- Type route handlers, response bodies, query params, route params, and environment config.
- Validate and normalize Supabase rows before returning API responses.
- Use `unknown` for caught errors and untrusted data, then narrow before reading properties.
- Keep API response contracts imported from `packages/types`.
- Do not pass raw Supabase errors directly to clients.
- Avoid untyped middleware state. If request context is needed, extend Express request types deliberately.

## Supabase Safety Rules

- Use read-only access patterns from the API where possible.
- Public catalog tables may be readable, but public insert/update/delete should remain disabled.
- Inspect environment variables before running scripts that write to Supabase.
- Never seed or migrate against an unknown Supabase project.
- Keep scholarship seed data source-backed with `source_url` and `last_verified_at`.

## Verification Expectations

- Run API tests/typecheck/lint when available.
- Smoke test `GET /health`.
- Smoke test `GET /catalog` after catalog query changes.
- If Supabase is unavailable, verify failure responses and document what was not tested.
