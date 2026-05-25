# IskoolarShip Monorepo Structure

This document provides a detailed breakdown of the `IskoolarShip` monorepo structure. The codebase is organized as a multi-package repository (monorepo) using npm workspaces to share types and matching logic between the mobile application and the backend database catalog.

---

## 🏗️ Monorepo Root Layout

```text
IskoolarShip/
├── apps/                    # Executable applications
│   ├── api/                 # Backend: Express read-only catalog API
│   └── mobile/              # Frontend: Expo React Native Mobile application
├── packages/                # Shared internal packages
│   ├── algorithms/          # Pure TypeScript recommendation algorithms
│   ├── db/                  # Supabase PostgreSQL schema, migrations, and seed scripts
│   └── types/               # Shared TypeScript domain types
├── docs/                    # Product requirements and specifications
├── package.json             # Root monorepo workspace configuration
├── tsconfig.json            # Root TypeScript compiler settings
└── STRUCTURE.md             # This file (Structure reference guide)
```

---

## 📁 Detailed Package Breakdown

### 1. Applications (`apps/`)

#### 📱 `apps/mobile/` (Expo Mobile App)
The core user-facing Android application built with React Native and Expo.
*   **`app/`**: File-based router using **Expo Router**.
    *   `_layout.tsx`: Global root layout injecting global contexts (`ProfileProvider` and `SafeAreaProvider`).
    *   `index.tsx`: Main entry screen that serves the Onboarding flow.
    *   `(tabs)/`: The main application shell displayed after onboarding:
        *   `_layout.tsx`: Tab-bar shell configuration and route guarding.
        *   `home.tsx`: Landing interface for onboarded users.
        *   `matches.tsx`: Displays algorithmically matched scholarships.
        *   `tracker.tsx`: Progress tracking for current applications.
        *   `profile.tsx`: Displays the user's stored academic credentials.
*   **`src/`**: Source folder for modular UI components and global state.
    *   `components/`: Custom, highly reusable UI components (e.g., `Checkbox.tsx`, `CustomDropdown.tsx`).
    *   `context/`: Global React context providers.
        *   `ProfileContext.tsx`: Manages onboarding status, profile hydration, and persists data via `AsyncStorage`.
    *   `screens/`: Modular screens.
        *   `LandingScreen.tsx`: Orchestrates the 3-step setup wizard (Academic Info, Personal Context, Document Checklist).

#### 🔌 `apps/api/` (Express Backend Server)
A read-only Express API server serving as a secure gateway to our database.
*   **`src/config/`**: Handles environment variables validation (port, environment).
*   **`src/routes/`**: Route handlers.
    *   `catalog.ts`: Exposes `GET /catalog` returning the full catalog payload.
    *   `health.ts`: Exposes `GET /health` for diagnostics.
*   **`src/app.ts`**: Express application setup, global error handling, and route bindings.
*   **`src/index.ts`**: Launches the Express server listening on the configured port.

---

### 2. Internal Packages (`packages/`)

#### 🧮 `packages/algorithms/` (Recommendation Logic)
*   Contains pure, zero-dependency TypeScript modules responsible for computing match scores and ranking scholarships.
*   Keeps algorithms testable and deterministic (binary search filters, greedy weighted scoring, merge sort ranking).

#### 🗄️ `packages/db/` (Database Migrations & Seed Data)
*   **`supabase/migrations/`**: Directory containing PostgreSQL SQL migrations.
    *   `20240101000000_create_scholarships.sql`: Schema definitions for `scholarships`, `document_requirements`, and many-to-many relationship mapping tables.
*   **`supabase/seed.sql`**: Seed data file populated with realistic mock scholarships (e.g., DOST-SEI Merit, Ayala Foundation Grant, Alumni Fund) and document requirements.

#### 🏷️ `packages/types/` (TypeScript Domain Schema)
*   Defines unified, single-source-of-truth TypeScript definitions.
*   Ensures consistent runtime contracts (`Scholarship`, `DocumentRequirement`, `StudentProfile`, `CatalogResponse`) between the mobile frontend and backend API.

---

## 🔗 How the Pieces Connect

1.  **Shared Types**: Both `apps/mobile/` and `apps/api/` import from `@iskoolarship/types` to ensure perfect API response alignment.
2.  **Shared Algorithms**: `apps/mobile/` imports matching logic from `@iskoolarship/algorithms` to calculate compatibility scores locally.
3.  **Data Flow**: 
    `Supabase PostgreSQL Database` ➡️ `Express API (apps/api)` ➡️ `Mobile Frontend (apps/mobile) [Local Storage + Matching]`
