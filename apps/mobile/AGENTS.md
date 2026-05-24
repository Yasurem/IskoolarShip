# IskoolarShip Mobile Agent Notes

## Companion Docs

- Start with the root [../../AGENTS.md](../../AGENTS.md).
- Claude Code should also read [CLAUDE.md](CLAUDE.md).
- Product requirements live in [../../docs/PRD.md](../../docs/PRD.md).

## App Scope

This app is the Expo React Native Android client for IskoolarShip.

Responsibilities:

- Collect and store the student profile locally.
- Store student document availability locally.
- Fetch public scholarship catalog data from the Express API.
- Cache catalog data locally after successful fetches.
- Run recommendation algorithms locally through `packages/algorithms`.
- Display ranked recommendations, document completion, optimized application picks, and archived catalog items.

Non-responsibilities:

- Do not upload student profiles or document availability to the API.
- Do not upload files.
- Do not submit real scholarship applications.
- Do not directly mutate Supabase catalog data.

## Data Privacy Rules

- Student data must remain on-device.
- API calls from mobile should be read-only catalog requests.
- Do not add `POST /recommendations`, `POST /students`, `POST /student-documents`, or equivalent calls.
- If analytics are ever introduced, do not include student profile fields or document availability.

## Algorithm Usage

- Import recommendation logic from `packages/algorithms`.
- Do not duplicate algorithm implementations inside screens/components.
- UI code may format algorithm outputs, but should not change scoring or optimization rules.
- Keep score breakdowns visible enough for course defense:
  - match percentage
  - weighted score components
  - document completion
  - optimized-plan inclusion

## TypeScript and React Native Rules

- Follow the root TypeScript standards in [../../AGENTS.md](../../AGENTS.md).
- Type navigation params, component props, local storage payloads, and API client responses explicitly.
- Do not store unvalidated JSON from local storage directly into app state; parse and narrow it first.
- Keep server catalog types imported from `packages/types`.
- Keep local-only student profile types shared where useful, but never turn them into API request types.
- Prefer small typed hooks for catalog fetching, cache hydration, and profile state instead of passing loose objects through screens.

## UX Expectations

- Android is the primary target.
- Keep the first screen useful, not marketing-focused.
- Prefer clear forms, compact result cards, filters, and explainable recommendation details.
- Closed scholarships should remain visible in archive/catalog views but excluded from default recommendations.
- Show offline/cache state when catalog fetch fails.

## Verification Expectations

- Run mobile lint/typecheck/tests when available.
- Verify the Expo app starts after setup-sensitive changes.
- For UI changes, check mobile viewport behavior and ensure text does not overlap or overflow.
