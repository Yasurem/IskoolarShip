# How Data Flows to the Matches Screen

We have successfully bridged the gap between your remote Supabase database and the local mobile app, while preserving the strict privacy rules: **the student's personal profile data never leaves their phone.**

## The Pipeline

Here is exactly how the data flows when a user opens the "Matches" tab on their phone:

### 1. Fetching the Catalog (The Backend Gateway)
When `matches.tsx` mounts, it calls `fetchCatalog()` which connects to the Express API (`http://192.168.254.114:3000/catalog`). 

> [!NOTE]
> The backend abstracts away the complex Supabase SQL joins, mapping the raw `snake_case` rows into clean `camelCase` TypeScript objects, and caches it in-memory for 15 minutes. The mobile app just receives a highly optimized, fully populated JSON tree of **all** active scholarships.

### 2. Loading the Local Profile (The Privacy Boundary)
Simultaneously, the mobile app pulls the user's saved Onboarding details from local `AsyncStorage` (using the `ProfileContext`). This data includes their GPA, Income, Region, Strand, and Document availability.

Because the algorithm package requires strict typings, the Matches screen translates the raw string inputs from the UI (e.g., converting `"2.5"` to the number `2.5`) into the strict `StudentProfile` interface.

### 3. The Algorithm Execution Pipeline
The magic happens inside the React `useEffect` inside `matches.tsx`. It runs the three algorithm functions sequentially:

1. **Strict Filtering**:
   It maps through the entire fetched catalog and runs `filterScholarships(studentProfile, scholarship)` for each one.
   *Currently*: This function is a stub that returns `true` for everything. Your team will implement the binary/sequential search logic here to immediately drop scholarships where the student misses hard GPA or Region cutoffs.

2. **Optimization**:
   The remaining eligible scholarships are passed into `optimizeApplication(studentProfile, eligibleScholarships)`.
   *Currently*: It returns the array exactly as-is. Your team will implement the 0/1 Knapsack algorithm here to drop/deprioritize scholarships if applying to all of them exceeds the user's available time constraint.

3. **Scoring**:
   The optimized list is mapped one final time. For each scholarship, we look up its specific `ScholarshipRequiredDocument` list and pass it into `compatibilityScoring(studentProfile, scholarship, requiredDocs)`.
   *Currently*: This function returns a hardcoded `85%`. Your team will implement the Greedy Weighted Scoring here, using Hash Set Intersections to give bonus points if the student already possesses the required documents!

### 4. UI Rendering
Finally, the mobile app sorts the scored list from highest score to lowest score and dynamically renders a `<ScholarshipCard>` for each result.

## Next Steps for Your Team
Your team simply needs to open `packages/algorithms/src/index.ts` and fill in the logic inside the three functions. 
The TypeScript types are already perfectly enforced, so they will get full autocomplete for every field on `studentProfile` and `scholarship`!
