import type { 
  CatalogResponse, 
  Scholarship, 
  StudentProfile,
  ScholarshipRequiredDocument
} from "@iskoolarship/types";

export type { CatalogResponse, Scholarship, StudentProfile } from "@iskoolarship/types";

export type RecommendationPlaceholder = {
  readonly ready: true;
  readonly message: string;
};

export const getAlgorithmPackageStatus = (): RecommendationPlaceholder => ({
  ready: true,
  message: "Algorithm package fully implemented (Demo Mode)."
});

/**
 * 1. FilterScholarships Algorithm (Strict Filtering)
 * Time Complexity: O(1) per scholarship (Sequential Check)
 */
export function filterScholarships(profile: StudentProfile, scholarship: Scholarship): boolean {
  // Check GPA Cutoff
  if (scholarship.minGpa !== null) {
    // Assuming standard Philippine 1.0 - 5.0 grading scale where lower is better
    // If the GPA is > 5.0, assume it's a 100-point scale where higher is better
    const is100Scale = profile.gpa > 5.0 || scholarship.minGpa > 5.0;
    if (is100Scale) {
      if (profile.gpa < scholarship.minGpa) return false;
    } else {
      if (profile.gpa > scholarship.minGpa) return false;
    }
  }

  // Check Strand constraints
  if (scholarship.allowedStrands && scholarship.allowedStrands.length > 0) {
    if (!scholarship.allowedStrands.includes("All") && !scholarship.allowedStrands.includes(profile.strand)) {
      return false;
    }
  }

  // Check Region constraints
  if (scholarship.allowedRegions && scholarship.allowedRegions.length > 0) {
    if (!scholarship.allowedRegions.includes("All") && !scholarship.allowedRegions.includes(profile.region)) {
      return false;
    }
  }
  
  return true; 
}

/**
 * 2. CompatibilityScoring Algorithm (Greedy Weighted Scoring)
 * Time Complexity: O(D) where D is number of required documents
 */
export function compatibilityScoring(
  profile: StudentProfile, 
  scholarship: Scholarship,
  requiredDocs: readonly ScholarshipRequiredDocument[]
): number {
  let score = 50; // Base score for just passing the strict filters

  // 1. Hash Set Intersection for Documents
  // Convert user's available docs into a Set for O(1) lookups
  const userDocsSet = new Set(profile.availableDocumentKeys);
  
  if (requiredDocs.length > 0) {
    let matchedDocs = 0;
    for (const doc of requiredDocs) {
      if (userDocsSet.has(doc.documentId)) {
        matchedDocs++;
      }
    }
    // Up to 30 bonus points based on the percentage of required documents they already have
    score += Math.round((matchedDocs / requiredDocs.length) * 30);
  } else {
    // Free 30 points if the scholarship requires zero documents!
    score += 30;
  }

  // 2. Preferred Region Bonus
  if (scholarship.preferredRegions && scholarship.preferredRegions.includes(profile.region)) {
    score += 10;
  }

  // 3. Preferred Income Bracket Bonus
  if (scholarship.preferredIncomeBracket !== null) {
    // Exact match = 10 pts, Close match = 5 pts
    const incomeDiff = Math.abs(scholarship.preferredIncomeBracket - profile.incomeBracket);
    if (incomeDiff === 0) score += 10;
    else if (incomeDiff === 1) score += 5;
  }

  // Cap at 100%
  return Math.min(score, 100);
}

/**
 * 3. OptimizeApplication Algorithm (0/1 Knapsack)
 * Time Complexity: O(N * W) where N is scholarships, W is available hours
 */
export function optimizeApplication(
  profile: StudentProfile,
  eligibleScholarships: readonly Scholarship[]
): Scholarship[] {
  if (eligibleScholarships.length === 0 || profile.availableHours <= 0) {
    return [];
  }

  const capacity = Math.floor(profile.availableHours);
  const n = eligibleScholarships.length;
  
  // Create DP table: dp[i][w]
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  // Build the DP table
  for (let i = 1; i <= n; i++) {
    const scholarship = eligibleScholarships[i - 1];
    if (!scholarship) continue;
    const weight = Math.ceil(scholarship.estimatedEffortHours);
    const value = scholarship.estimatedTotalValuePhp;

    for (let w = 1; w <= capacity; w++) {
      const prevDpRow = dp[i - 1] as number[];
      const currDpRow = dp[i] as number[];
      if (weight <= w) {
        // Can include this scholarship
        currDpRow[w] = Math.max(
          prevDpRow[w] as number, // Don't include
          (prevDpRow[w - weight] as number) + value // Include
        );
      } else {
        // Cannot include
        currDpRow[w] = prevDpRow[w] as number;
      }
    }
  }

  // Backtrack to find which scholarships were selected
  const selectedScholarships: Scholarship[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i] && dp[i - 1] && dp[i]![w] !== dp[i - 1]![w]) {
      // Item i was included
      const scholarship = eligibleScholarships[i - 1];
      if (scholarship) {
        selectedScholarships.push(scholarship);
        w -= Math.ceil(scholarship.estimatedEffortHours);
      }
    }
  }

  // Return the optimal subset
  return selectedScholarships;
}
