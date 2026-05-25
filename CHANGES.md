# Iskoolarship Project Changelog

This document strictly records all architectural, backend, frontend, and algorithmic changes made to the Iskoolarship application in chronological order.

## Phase 1: Monorepo Architecture & Shared Types
- **Created Workspace Structure**: Organized the codebase into an enterprise-grade monorepo containing `apps/mobile`, `apps/api`, `packages/algorithms`, `packages/db`, and `packages/types`.
- **Defined Shared Types**: Established `@iskoolarship/types` to ensure strict, single-source-of-truth TypeScript definitions (e.g., `Scholarship`, `StudentProfile`, `CatalogResponse`) are shared seamlessly across the backend API, algorithms, and mobile frontend without circular dependencies.
- **Agent Rules Established**: Wrote `AGENTS.md` to permanently enforce data privacy boundaries (e.g., *Student profiles must never leave the mobile device*).

## Phase 2: Supabase Database Integration & Express API Gateway
- **Configured API Environment**: Set up `apps/api` with strict environment variable parsing (`src/config/env.ts`) to ensure the server crashes safely if Supabase credentials are missing. Exposed a dynamic `CACHE_TTL_MINUTES` variable for the team to adjust database query frequency.
- **Built the Fetch Service**: Developed `apps/api/src/services/supabase.ts` to query the remote PostgreSQL Supabase database. The service concurrently fetches `scholarships`, `document_requirements`, and `scholarship_required_documents` tables.
- **Implemented In-Memory Caching**: To protect the free-tier Supabase database from rate-limits, built an in-memory caching layer that holds the entire catalog for 15 minutes before refreshing.
- **Created the `/catalog` Endpoint**: Exposed a clean, read-only GET endpoint that serves the entire unified scholarship catalog as a structured JSON tree.

## Phase 3: Algorithm Mathematical Implementation
- **Scaffolded Team Templates**: Created `packages/algorithms/src/index.team.ts` containing the empty, perfectly-typed function signatures for `filterScholarships`, `compatibilityScoring`, and `optimizeApplication` so the team can easily experiment with their own math.
- **Implemented Live Demo Algorithms**: Fully built the mathematical logic in `packages/algorithms/src/index.ts`:
  1. **Strict Filtering**: Checks if the student meets the hard GPA cutoffs and Region/Strand constraints.
  2. **0/1 Knapsack Application Optimizer**: Utilizes dynamic programming to select the maximum value combinations of scholarships a student can apply to without exceeding their `availableHours`.
  3. **Document Set Intersections**: Uses `O(1)` Hash Sets to instantly match the user's available offline documents against the scholarship's database required documents, generating a dynamic percentage score.
- **Compiled the Module**: Built the package via TypeScript (`tsc`) so the mobile app could instantly import the executable code.
- **Wrote Documentation**: Created `packages/algorithms/ALGORITHMS.md` to explain the data pipeline specifically for the algorithmic team.

## Phase 4: Mobile Frontend Integration & UI Reactivity
- **Created Local Fetch Client**: Built `apps/mobile/src/api/catalog.ts` configured explicitly to the developer's local IPv4 (`192.168.254.114`) to ensure Expo Go on physical Android devices successfully routes back to the computer's Express server.
- **Dynamic UI Rewiring**: Deleted the hardcoded, static UI cards in `apps/mobile/app/(tabs)/matches.tsx`.
- **Built the Data Mapper**: Wrote translation logic directly in the React `useEffect` to safely convert the user's offline string `ProfileData` (saved via AsyncStorage) into strict numbers and booleans, and mapped simple document keys (e.g., `"psa"`) into the complex database UUIDs.
- **Rendered Live Data**: The Matches screen now successfully fetches the database, executes the math locally, and renders the dynamic result.

*Document maintained by the AntiGravity AI Assistant.*
