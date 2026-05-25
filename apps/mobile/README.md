# IskoolarShip Mobile App Documentation

## Overview
IskoolarShip is a React Native mobile application built with Expo. Its primary purpose is to act as an offline-first, privacy-focused scholarship recommendation catalog. The app guides students through an onboarding wizard to capture their academic profile, then utilizes algorithmic matching to suggest relevant scholarships.

## 🏗 Architecture & Tech Stack

### Frameworks & Libraries
- **Framework**: React Native with Expo (SDK 56.0+)
- **Routing**: Expo Router (File-based routing)
- **State Persistence**: `@react-native-async-storage/async-storage` & React Context
- **Icons**: `@expo/vector-icons` (MaterialIcons)
- **Language**: TypeScript (Strict Mode)

### Monorepo Structure
The project follows a monorepo structure designed to cleanly separate the frontend interface from the backend algorithms:
```text
IskoolarShip/
├── apps/
│   └── mobile/                # The Expo React Native App (Where we are working)
│       ├── app/               # Expo Router directory (Layouts & Tabs)
│       └── src/               # Application source code (Screens, Components, Contexts)
├── packages/
│   ├── algorithms/            # Pure TS recommendation algorithms
│   ├── db/                    # Supabase schema & seed data
│   └── types/                 # Shared TypeScript types
└── docs/                      # Product requirements
```

---

## 🚀 Core Features & Recent Implementations

### 1. File-Based Routing (Expo Router)
We migrated the application from a legacy monolithic `App.tsx` structure to Expo Router to natively support deep-linking and complex navigation stacks.

- **`app/_layout.tsx`**: The global root layout. It injects the `SafeAreaProvider` and our custom `ProfileProvider` to ensure global state is accessible instantly.
- **`app/index.tsx`**: The entry point route (`/`), which immediately renders the Onboarding Wizard.
- **`app/(tabs)/_layout.tsx`**: The Main Application shell. It renders a persistent bottom tab bar for `Home`, `Tracker`, `Matches`, and `Profile`.

### 2. The Onboarding Wizard
The onboarding flow (`src/screens/Template.tsx`) acts as a stateful controller for three modular sub-screens:
1. **Academic Information**: Captures GPA and Strand via custom Dropdowns.
2. **Personal Context**: Captures Region and Income via custom Dropdowns.
3. **Document Readiness**: Captures available documents via custom Checkboxes.

#### Validation & Guardrails
- **Anti-Bypass Validation**: The "Next" button uses strict conditional logic to disable itself if the current screen's required fields are empty.
- **Progress UI**: A custom 3-segment progress bar visually tracks completion (turning `#800000` red as each step clears).

### 3. Global State & Route Guarding
To prevent users from manually bypassing the setup wizard and to persist their data across app restarts, we implemented the `ProfileContext`.

- **Persistence**: Upon hitting "Find Scholarships", the wizard saves the `gpa`, `strand`, `region`, `income`, and `documents` locally using `AsyncStorage`.
- **Route Guarding**: The `app/(tabs)/_layout.tsx` relies on a `useProfile()` hook. If the layout mounts and detects that the user `hasOnboarded === false`, it forces a `router.replace('/')` redirect to kick them back to the setup wizard.

### 4. The Matches Interface
The first main tab implemented is the **Matches Screen** (`app/(tabs)/matches.tsx`), converted faithfully from the original HTML mockups.
- Features a custom mobile-first sticky header.
- Displays algorithmically matched scholarships using a highly reusable `<ScholarshipCard />` component that accepts standard props (`title`, `type`, `match`, `amount`, `icon`).
- Utilizes `@expo/vector-icons/MaterialIcons` to map the web's Google Material Symbols directly into native Android/iOS vector graphics.

---

## 📝 Design System & Shared Components

To ensure visual consistency without relying on massive styling files, the app heavily relies on modular components:
- **`src/components/CustomDropdown.tsx`**: A native-feeling dropdown built from scratch to replace default HTML `<select>` elements, featuring toggleable expanded states and scrollable option lists.
- **`src/components/Checkbox.tsx`**: A custom touchable square that renders a white Material Icon checkmark when `checked={true}` and shifts its background to the primary brand color.

> [!NOTE]
> The app relies strictly on `StyleSheet.create()` to achieve high-performance native rendering instead of TailwindCSS, specifically translating the exact HEX codes (e.g. Primary: `#800000`) and border radiuses from the HTML mockups.
