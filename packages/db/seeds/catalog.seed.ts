import type { CatalogResponse } from "@iskoolarship/types";

export const seedCatalog: CatalogResponse = {
  scholarships: [],
  documents: [],
  scholarshipRequiredDocuments: [],
  syncedAt: new Date(0).toISOString()
};
