export type { CatalogResponse, Scholarship, StudentProfile } from "@iskoolarship/types";

export type RecommendationPlaceholder = {
  readonly ready: true;
  readonly message: string;
};

export const getAlgorithmPackageStatus = (): RecommendationPlaceholder => ({
  ready: true,
  message: "Algorithm package scaffold initialized."
});
