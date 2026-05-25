import { Router, type RequestHandler } from "express";
import { fetchFullCatalog } from "../services/supabase.js";
import type { CatalogResponse } from "@iskoolarship/types";
import type { ErrorResponse } from "../types/api.js";

export const catalogRouter = Router();

type EmptyParams = Record<string, never>;

const getCatalog: RequestHandler<EmptyParams, CatalogResponse | ErrorResponse> = async (_request, response) => {
  try {
    const catalog = await fetchFullCatalog();
    response.json(catalog);
  } catch (error) {
    console.error("Failed to fetch catalog:", error);
    response.status(500).json({
      error: {
        code: "internal_server_error",
        message: "Failed to fetch scholarship catalog from database.",
      },
    });
  }
};

catalogRouter.get("/", getCatalog);
