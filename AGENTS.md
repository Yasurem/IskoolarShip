# IskoolarShip Workspace Agent Notes

## Companion Docs

- Claude Code should start with [CLAUDE.md](CLAUDE.md).
- Keep shared workspace guidance in this file so other coding agents have the same baseline.
- Keep Claude-specific workflow notes in `CLAUDE.md`, and link back here for shared rules.
- Product requirements live in [docs/PRD.md](docs/PRD.md). Read it before changing scope, architecture, algorithms, data shape, or user-facing behavior.

## Repo-Level Guidance

Each app can add local instructions that extend this workspace baseline:

- [apps/mobile/AGENTS.md](apps/mobile/AGENTS.md) - Expo React Native Android app.
- [apps/api/AGENTS.md](apps/api/AGENTS.md) - Express read-only catalog API.

When working inside an app, read this root file first, then the app-level `AGENTS.md`. Claude Code should also read the matching `CLAUDE.md` files.

## Workspace Scope

- Work only inside `E:\iskoolarship`.
- Do not make changes outside this workspace unless the user explicitly asks for a specific external path.
- Before making changes, identify the relevant project directory and use that directory as the working root for commands.

## Workspace Layout

Planned monorepo layout:

```txt
apps/
  mobile/              Expo React Native Android app
  api/                 Express read-only catalog API

packages/
  algorithms/          Pure TypeScript recommendation algorithms
  db/                  Supabase schema, migrations, and seed data
  types/               Shared TypeScript types

docs/
  PRD.md               Product requirements document
```

## Product Boundaries

- This is a course-demo MVP with production-shaped boundaries.
- Student profiles, student document availability, and recommendation results must stay local to the mobile app.
- The backend is catalog-only. It must not accept or persist student profile data.
- Scholarship data is manually seeded. Do not add scraping/import automation unless the PRD is revised.
- The app is informational. It must not submit real scholarship applications, disburse money, or contact granting institutions.

## Algorithm Boundaries

- Keep algorithm implementations in `packages/algorithms`.
- Algorithm code must be pure TypeScript with deterministic input/output.
- Do not import React Native, Express, Supabase clients, filesystem APIs, or network clients into algorithm modules.
- Keep the required algorithmic techniques visible and testable:
  - Binary Search and Sequential Search for strict filtering.
  - Greedy Weighted Compatibility Scoring.
  - Merge Sort ranking.
  - Hash Set Intersection for document completion.
  - 0/1 Knapsack for application prioritization.

## TypeScript Standards

- Use TypeScript for all app and package code.
- Keep `strict` mode enabled in every `tsconfig.json`.
- Do not use `any` unless there is no practical alternative. If `any` is unavoidable, add a short comment explaining why.
- Prefer `unknown` over `any` for untrusted input, then narrow it before use.
- Define shared domain types in `packages/types`; do not duplicate scholarship, document, profile, or catalog response types across apps.
- Prefer explicit function parameter and return types on exported functions.
- Avoid unsafe type assertions such as `as SomeType` when validation or narrowing is possible.
- Use discriminated unions for fixed status/error states such as scholarship status, API results, and local loading states.
- Keep runtime validation at system boundaries: API responses, environment variables, local storage hydration, and Supabase rows.
- Do not silence TypeScript with `// @ts-ignore` or `// @ts-expect-error` unless the reason is documented and scoped to one line.
- Avoid enum drift. Prefer shared string-literal unions or `as const` maps for controlled vocabularies.
- Keep nullability intentional. Use `null` for explicitly unknown catalog fields and avoid mixing `undefined` and `null` for the same meaning.

## Git Safety Rules

- Do not push directly to `main`.
- If changes are needed from `main`, create or use a feature branch and push that branch instead.
- If the current branch is `main`, stop and ask before running any `git push` command.
- Do not run destructive git cleanup commands such as `git reset --hard` or `git checkout --` unless the user explicitly requests that exact operation.
- Preserve user changes. If the worktree is dirty, inspect relevant files before editing and do not revert unrelated changes.

## Commit Message Convention

Use conventional commit format:

```txt
type(scope): short summary

What: ...
Why: ...
Impact: ...
```

Examples:

```txt
feat(mobile): add local student profile storage
fix(api): handle empty catalog responses
docs(root): add workspace agent guidance
```

Keep the subject concise and imperative. Include migration, seed, or setup notes in the body when relevant.

## Database Safety Rules

Supabase/PostgreSQL is the catalog database for public scholarship data only. Treat every database command as potentially persistent unless the user confirms an isolated disposable database.

Hard prohibitions:

- Do not store student profiles, student documents, uploaded files, recommendation results, or application records in Supabase.
- Do not run destructive database commands such as `DROP TABLE`, `TRUNCATE`, `db reset`, `migrate:fresh`, or destructive rollback behavior without explicit user approval.
- Do not add migrations that remove data-bearing tables or columns unless the user approves the exact destructive change and recovery plan.
- Do not run seed scripts against a remote Supabase project until the target project URL/environment has been inspected.

Required practices:

- Before any database write, inspect the effective Supabase URL/project reference and environment.
- Prefer additive schema changes.
- Keep read policies public for catalog data only; keep public insert/update/delete disabled.
- Include `source_url` and `last_verified_at` in scholarship seed data.

## Verification Expectations

- For algorithm changes, run the package tests.
- For API changes, run typecheck/tests if available and smoke `GET /health` and `GET /catalog`.
- For mobile changes, run lint/typecheck if available and verify the app starts.
- If verification cannot be run, state exactly what was not verified and why.
