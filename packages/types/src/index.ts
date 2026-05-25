export const SCHOLARSHIP_STATUSES = [
  "active",
  "recurring",
  "closed",
  "unknown"
] as const;

export type ScholarshipStatus = (typeof SCHOLARSHIP_STATUSES)[number];

export const PROVIDER_TYPES = [
  "government",
  "private",
  "school",
  "ngo",
  "other"
] as const;

export type ProviderType = (typeof PROVIDER_TYPES)[number];

export const GENDERS = ["Any", "Male", "Female"] as const;

export type Gender = (typeof GENDERS)[number];

export const STRANDS = [
  "All",
  "STEM",
  "ABM",
  "HUMSS",
  "GAS",
  "TVL",
  "ArtsDesign",
  "Sports",
  "NotApplicable"
] as const;

export type Strand = (typeof STRANDS)[number];

export const REGIONS = [
  "All",
  "NCR",
  "CAR",
  "RegionI",
  "RegionII",
  "RegionIII",
  "RegionIVA",
  "MIMAROPA",
  "RegionV",
  "RegionVI",
  "RegionVII",
  "RegionVIII",
  "RegionIX",
  "RegionX",
  "RegionXI",
  "RegionXII",
  "RegionXIII",
  "BARMM"
] as const;

export type Region = (typeof REGIONS)[number];

export const COURSES = [
  "All",
  "BSCS",
  "BSIT",
  "BSIS",
  "Engineering",
  "Education",
  "Business",
  "Medicine",
  "Agriculture",
  "Science",
  "AnySTEM",
  "Computing",
  "Other"
] as const;

export type Course = (typeof COURSES)[number];

export const YEAR_LEVELS = [
  "All",
  "IncomingFreshman",
  "FirstYear",
  "SecondYear",
  "ThirdYear",
  "FourthYear"
] as const;

export type YearLevel = (typeof YEAR_LEVELS)[number];

export type IncomeBracket = 1 | 2 | 3 | 4 | 5;

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  description: string | null;
  sourceUrl: string;
  applicationUrl: string | null;
  status: ScholarshipStatus;
  lastVerifiedAt: string | null;
  academicYear: string | null;
  benefitSummary: string | null;
  estimatedTotalValuePhp: number;
  applicationOpenDate: string | null;
  deadline: string | null;
  minGpa: number | null;
  allowedGenders: readonly Gender[] | null;
  allowedStrands: readonly Strand[] | null;
  allowedCourses: readonly Course[] | null;
  allowedYearLevels: readonly YearLevel[] | null;
  allowedRegions: readonly Region[] | null;
  preferredRegions: readonly Region[] | null;
  preferredIncomeBracket: IncomeBracket | null;
  preferredCourses: readonly Course[] | null;
  estimatedEffortHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DocumentRequirement = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export type ScholarshipRequiredDocument = {
  scholarshipId: string;
  documentId: string;
  isRequired: boolean;
  notes: string | null;
};

export type CatalogResponse = {
  scholarships: readonly Scholarship[];
  documents: readonly DocumentRequirement[];
  scholarshipRequiredDocuments: readonly ScholarshipRequiredDocument[];
  syncedAt: string;
};

export type StudentProfile = {
  gpa: number;
  gender: Gender;
  strand: Strand;
  targetCourse: Course;
  yearLevel: YearLevel;
  region: Region;
  incomeBracket: IncomeBracket;
  availableHours: number;
  availableDocumentKeys: readonly string[];
};

// DISPLAY MAPS
export const REGION_DISPLAY_MAP: Record<Region, string> = {
  All: "All Regions",
  NCR: "NCR",
  CAR: "CAR",
  RegionI: "Region I",
  RegionII: "Region II",
  RegionIII: "Region III",
  RegionIVA: "Region IV-A",
  MIMAROPA: "MIMAROPA",
  RegionV: "Region V",
  RegionVI: "Region VI",
  RegionVII: "Region VII",
  RegionVIII: "Region VIII",
  RegionIX: "Region IX",
  RegionX: "Region X",
  RegionXI: "Region XI",
  RegionXII: "Region XII",
  RegionXIII: "Region XIII",
  BARMM: "BARMM"
};

export const INCOME_DISPLAY_MAP: Record<IncomeBracket, string> = {
  1: 'Below ₱130k',
  2: '₱130k - ₱250k',
  3: '₱250k - ₱500k',
  4: '₱500k - ₱1M',
  5: 'Above ₱1M',
};

export const STRAND_DISPLAY_MAP: Record<Strand, string> = {
  All: 'All Strands',
  STEM: 'STEM',
  ABM: 'ABM',
  HUMSS: 'HUMSS',
  GAS: 'GAS',
  TVL: 'TVL',
  ArtsDesign: 'Arts & Design',
  Sports: 'Sports',
  NotApplicable: 'Not Applicable',
};
