import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import type { CatalogResponse } from "@iskoolarship/types";

// Initialize Supabase Client
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Define Cache Structure
type CachedCatalog = {
  data: CatalogResponse;
  timestamp: number;
};

// Calculate TTL in milliseconds from env config
const CACHE_TTL_MS = env.cacheTtlMinutes * 60 * 1000;
let catalogCache: CachedCatalog | null = null;

export async function fetchFullCatalog(): Promise<CatalogResponse> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (catalogCache && (now - catalogCache.timestamp) < CACHE_TTL_MS) {
    console.log("Serving catalog from cache...");
    return catalogCache.data;
  }

  console.log("Fetching fresh catalog from Supabase...");

  // Otherwise, fetch fresh data from Supabase concurrently
  const [scholarshipsRes, docsRes, reqDocsRes] = await Promise.all([
    supabase.from("scholarships").select("*").eq("status", "active"),
    supabase.from("document_requirements").select("*"),
    supabase.from("scholarship_required_documents").select("*")
  ]);

  if (scholarshipsRes.error) throw new Error(`Failed to fetch scholarships: ${scholarshipsRes.error.message}`);
  if (docsRes.error) throw new Error(`Failed to fetch documents: ${docsRes.error.message}`);
  if (reqDocsRes.error) throw new Error(`Failed to fetch requirements: ${reqDocsRes.error.message}`);

  const rawScholarships = scholarshipsRes.data;
  const rawDocs = docsRes.data;
  const rawReqDocs = reqDocsRes.data;

  // Map database snake_case to camelCase types required by the frontend
  const mappedScholarships = rawScholarships.map(s => ({
    id: s.id,
    name: s.name,
    provider: s.provider,
    providerType: s.provider_type,
    description: s.description,
    sourceUrl: s.source_url,
    applicationUrl: s.application_url,
    status: s.status,
    lastVerifiedAt: s.last_verified_at,
    academicYear: s.academic_year,
    benefitSummary: s.benefit_summary,
    estimatedTotalValuePhp: s.estimated_total_value_php,
    applicationOpenDate: s.application_open_date,
    deadline: s.deadline,
    minGpa: s.min_gpa,
    allowedGenders: s.allowed_genders,
    allowedStrands: s.allowed_strands,
    allowedCourses: s.allowed_courses,
    allowedYearLevels: s.allowed_year_levels,
    allowedRegions: s.allowed_regions,
    preferredRegions: s.preferred_regions,
    preferredIncomeBracket: s.preferred_income_bracket,
    preferredCourses: s.preferred_courses,
    estimatedEffortHours: s.estimated_effort_hours,
    isActive: s.is_active,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));

  const mappedDocs = rawDocs.map(d => ({
    id: d.id,
    key: d.key,
    name: d.name,
    description: d.description,
    createdAt: d.created_at,
  }));

  const mappedReqDocs = rawReqDocs.map(r => ({
    scholarshipId: r.scholarship_id,
    documentId: r.document_id,
    isRequired: r.is_required,
    notes: r.notes,
  }));

  const newCatalog: CatalogResponse = {
    scholarships: mappedScholarships,
    documents: mappedDocs,
    scholarshipRequiredDocuments: mappedReqDocs,
    syncedAt: new Date(now).toISOString(),
  };

  // Update Cache
  catalogCache = {
    data: newCatalog,
    timestamp: now,
  };

  return newCatalog;
}
