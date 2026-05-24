import { Router, type RequestHandler } from "express";

import type { CatalogResponse } from "@iskoolarship/types";

export const catalogRouter = Router();

type EmptyParams = Record<string, never>;

const getCatalog: RequestHandler<EmptyParams, CatalogResponse> = (_request, response) => {
  response.json({
    scholarships: [],
    documents: [],
    scholarshipRequiredDocuments: [],
    syncedAt: new Date().toISOString(),
  });
};

catalogRouter.get("/", getCatalog);
