# Product Requirements Document: IskoolarShip

## 1. Project Overview

**Product Name:** IskoolarShip

**Project Type:** Course-demo Android application

**Institution:** Polytechnic University of the Philippines, College of Computer and Information Science

**Course:** COSC 203 - Design and Analysis of Algorithms

**Academic Year:** 2025-2026

IskoolarShip is an Android scholarship match finding application for Filipino undergraduate students. The app helps students discover scholarships, check eligibility, understand document readiness, and prioritize applications using algorithmic techniques required by the course.

The project is a course-demo MVP with production-shaped boundaries. It prioritizes algorithm correctness, explainability, local privacy, and a clean monorepo architecture over production-only concerns such as admin dashboards, real application submission, payment processing, or institution integrations.

## 2. Problem Statement

Many Filipino students are unaware of scholarship opportunities or discover them too late. Existing scholarship information is fragmented across government agencies, schools, private organizations, and foundation websites. Students also struggle to determine which scholarships they qualify for, which documents they lack, and which applications are worth prioritizing when their available time is limited.

IskoolarShip addresses this by centralizing scholarship catalog data and applying recommendation, filtering, sorting, document matching, and optimization algorithms to produce explainable scholarship recommendations.

## 3. Goals

1. Help students discover scholarship opportunities relevant to their profile.
2. Filter scholarships using strict eligibility constraints such as GPA, gender, strand, course, year level, and region.
3. Rank scholarships using a Greedy Weighted Compatibility Scoring algorithm.
4. Show document completion using Hash Set Intersection.
5. Suggest an optimized application plan using 0/1 Knapsack.
6. Keep student profile and document availability data local to the device.
7. Use an Express.js backend and Supabase PostgreSQL catalog to align with the project paper.

## 4. Non-Goals

1. The app will not submit real scholarship applications.
2. The app will not upload or store student documents.
3. The app will not store student profiles on the server.
4. The app will not guarantee scholarship acceptance or financial awards.
5. The app will not scrape scholarship websites in the MVP.
6. The app will not include an admin editing dashboard in the MVP.

## 5. Target Users

Primary users are Filipino undergraduate students, including:

1. Incoming college freshmen.
2. Current first-year to fourth-year undergraduate students.
3. Students looking for financial aid, grants, or merit-based scholarships.

The initial scope focuses on domestic undergraduate scholarships and excludes graduate, international, and employment-based grant programs.

## 6. Core User Stories

1. As a student, I want to enter my academic and financial profile locally so I can find scholarships that match me.
2. As a student, I want to see scholarships I qualify for based on strict eligibility rules.
3. As a student, I want each recommendation to show a match percentage and score breakdown.
4. As a student, I want to mark which documents I already have so I can see my completion percentage per scholarship.
5. As a student, I want the app to suggest which scholarship applications to prioritize based on my available time.
6. As a student, I want to browse archived scholarships so I can prepare for future cycles.

## 7. System Architecture

The system uses a monorepo with the following planned structure:

```txt
apps/
  mobile/              Expo React Native Android app
  api/                 Express.js read-only catalog API

packages/
  algorithms/          Pure TypeScript algorithm implementations
  db/                  Supabase schema, migrations, and seed data
  types/               Shared TypeScript types
```

### 7.1 Mobile App

The Expo React Native app is the main user-facing product. It stores student profile and document availability locally, fetches public scholarship catalog data from the Express API, caches the catalog after successful fetches, and runs recommendation algorithms on-device.

### 7.2 Express API

The Express API is read-only and catalog-focused. It connects to Supabase and exposes scholarship catalog data to the mobile app.

Required endpoints:

```txt
GET /health
GET /catalog
GET /scholarships
GET /scholarships/:id
GET /documents
GET /scholarships/:id/documents
```

The API must not expose student profile, recommendation, uploaded document, or application submission endpoints.

### 7.3 Supabase PostgreSQL

Supabase stores only public scholarship catalog data and scholarship requirement labels. It does not store student data.

### 7.4 Algorithm Package

The algorithm package is pure TypeScript. It must not import React Native, Express, Supabase, or database clients. It accepts typed inputs and returns deterministic outputs, making the algorithmic core easy to test and defend.

## 8. Data Privacy Requirements

Student data must remain local to the mobile device.

The server must not store:

```txt
students
student_profiles
student_documents
recommendation_results
uploaded_files
applications
```

The mobile app may locally store:

```ts
type StudentProfile = {
  gpa: number;
  gender: string;
  strand: string;
  targetCourse: string;
  yearLevel: string;
  region: string;
  incomeBracket: 1 | 2 | 3 | 4 | 5;
  availableHours: number;
  availableDocumentKeys: string[];
};
```

## 9. Database Requirements

### 9.1 Scholarships

```sql
scholarships
- id uuid primary key
- name text not null
- provider text not null
- provider_type text
- description text
- source_url text not null
- application_url text
- status text
- last_verified_at date
- academic_year text
- benefit_summary text
- estimated_total_value_php integer
- application_open_date date
- deadline date
- min_gpa numeric(4,2)
- allowed_genders text[]
- allowed_strands text[]
- allowed_courses text[]
- allowed_year_levels text[]
- allowed_regions text[]
- preferred_regions text[]
- preferred_income_bracket integer
- preferred_courses text[]
- estimated_effort_hours integer
- is_active boolean default true
- created_at timestamptz default now()
- updated_at timestamptz default now()
```

### 9.2 Documents

```sql
documents
- id uuid primary key
- key text unique not null
- name text unique not null
- description text
- created_at timestamptz default now()
```

### 9.3 Scholarship Required Documents

```sql
scholarship_required_documents
- scholarship_id uuid references scholarships(id) on delete cascade
- document_id uuid references documents(id) on delete restrict
- is_required boolean default true
- notes text
- primary key (scholarship_id, document_id)
```

## 10. Controlled Vocabularies

The system should use stable codes internally and display-friendly labels in the app.

### 10.1 Gender

```txt
Any
Male
Female
```

### 10.2 Strand

```txt
All
STEM
ABM
HUMSS
GAS
TVL
ArtsDesign
Sports
NotApplicable
```

### 10.3 Region

```txt
All
NCR
CAR
RegionI
RegionII
RegionIII
RegionIVA
MIMAROPA
RegionV
RegionVI
RegionVII
RegionVIII
RegionIX
RegionX
RegionXI
RegionXII
RegionXIII
BARMM
```

### 10.4 Course

```txt
All
BSCS
BSIT
BSIS
Engineering
Education
Business
Medicine
Agriculture
Science
AnySTEM
Computing
Other
```

The app should support exact course matching and broader course group matching. For example, `BSCS` may match `BSCS`, `Computing`, `Science`, or `AnySTEM`.

### 10.5 Income Bracket

```txt
1 = Very low income
2 = Low income
3 = Lower middle income
4 = Middle income
5 = Any income / no restriction
```

## 11. Algorithm Requirements

### 11.1 Strict Filtering

The filtering step removes scholarships where the student fails explicit hard eligibility rules.

Required constraints:

1. GPA threshold.
2. Gender.
3. Academic strand.
4. Target course or course group.
5. Year level.
6. Region.

Unknown eligibility values should be treated as permissive but marked as incomplete data. Explicit unrestricted values must use sentinel values such as `All` or `Any`.

### 11.2 Greedy Weighted Compatibility Scoring

The scoring engine evaluates soft preferences after strict filtering.

Default weights:

```txt
location = 40
income = 40
course = 20
```

The result is a match percentage. The app must show a compact breakdown, such as:

```txt
Location: 40/40
Income: 40/40
Course: 10/20
```

### 11.3 Merge Sort Ranking

The app must rank scored scholarships using Merge Sort, ordered by match score descending. Ties may be broken by estimated total value, deadline urgency, or scholarship name.

### 11.4 Document Completion

Document completion uses Hash Set Intersection between local student document keys and server-provided scholarship requirement keys.

The app must show:

1. Number of completed documents.
2. Total required documents.
3. Completion percentage.
4. Missing document labels.

### 11.5 0/1 Knapsack Optimization

The optimizer suggests a subset of applications that maximizes adjusted funding value without exceeding the student's available hours.

Inputs:

```txt
capacity = student available hours
weight = scholarship estimated effort hours
base value = estimated total value in PHP
adjusted value = estimated_total_value_php * (match_score / 100)
```

Only scholarships with a minimum compatibility score of 60% should be considered by the optimizer.

## 12. Recommendation Pipeline

```txt
1. Mobile app fetches catalog data from Express.
2. Mobile app caches catalog locally.
3. Student enters or updates local profile.
4. App applies strict filtering.
5. App applies Greedy Weighted Compatibility Scoring.
6. App removes scholarships below the optimizer threshold for the optimized plan.
7. App ranks recommendations using Merge Sort.
8. App computes document completion using Hash Set Intersection.
9. App runs 0/1 Knapsack for the optimized application plan.
10. App displays ranked recommendations and optimized picks.
```

## 13. Catalog and Archive Behavior

Scholarship status values:

```txt
active
recurring
closed
unknown
```

Recommendation behavior:

1. `active` scholarships are eligible for recommendations and optimization.
2. `recurring` scholarships are eligible for recommendations and labeled as preparation opportunities.
3. `closed` scholarships remain visible in the archive/catalog but are excluded from recommendations by default.
4. `unknown` scholarships remain visible but should be labeled as incomplete or uncertain.

Deadline urgency should be computed separately from compatibility score.

Urgency labels:

```txt
Closed
Closing soon: 0-7 days left
Upcoming: 8-30 days left
Open: more than 30 days left
No deadline listed
```

## 14. Offline and Caching Requirements

The mobile app should cache catalog data after the first successful API fetch.

Launch behavior:

```txt
1. Try fetching the latest catalog from Express.
2. If successful, save catalog locally.
3. If fetch fails, load cached catalog.
4. If no cache exists, show an offline or empty catalog state.
```

Cached catalog data:

```txt
scholarships
documents
scholarship_required_documents
last_synced_at
```

## 15. Data Gathering Requirements

Manual seed data is the source for the course-demo MVP. Each scholarship record must include source tracking.

Spreadsheet columns:

```txt
name
provider
provider_type
description
source_url
application_url
status
last_verified_at
benefit_summary
estimated_total_value_php
application_open_date
deadline
academic_year
min_gpa
allowed_genders
allowed_strands
allowed_courses
allowed_year_levels
allowed_regions
preferred_regions
preferred_income_bracket
preferred_courses
estimated_effort_hours
required_documents
notes
```

## 16. Acceptance Criteria

1. The Expo app can display scholarship catalog data fetched from Express.
2. The Express API can return a combined catalog response from Supabase.
3. The app does not send student profile or document availability data to the API.
4. The app can compute and display filtered recommendations locally.
5. Each recommendation shows match percentage and score breakdown.
6. Each recommendation shows document completion and missing documents.
7. The app can produce an optimized application plan using 0/1 Knapsack.
8. Closed scholarships remain visible in archive/catalog views.
9. Algorithm functions are unit tested in `packages/algorithms`.
10. Seed data includes source URLs and verification dates.

## 17. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Manual data becomes outdated | Recommendations may become inaccurate | Store `source_url` and `last_verified_at`; use status and archive labels |
| Unknown eligibility fields cause false positives | Student may see scholarships they may not qualify for | Mark incomplete data visibly |
| Knapsack over-prioritizes money | Optimized plan may feel irrelevant | Use adjusted value based on match score |
| Free-form data causes bad matching | Algorithm comparisons may fail | Use controlled vocabulary codes |
| Network failure during demo | Catalog may not load | Cache catalog locally after first fetch |
| Express API conflicts with privacy goal | Student data may accidentally leave device | Keep API catalog-only and avoid recommendation POST endpoints |

## 18. Initial Implementation Order

1. Initialize monorepo workspace.
2. Create shared types.
3. Create algorithm package and tests.
4. Create Supabase schema and seed data structure.
5. Create Express read-only catalog API.
6. Create Expo app shell.
7. Implement local profile storage.
8. Integrate catalog fetching and caching.
9. Implement recommendation dashboard.
10. Implement archive/catalog view.

