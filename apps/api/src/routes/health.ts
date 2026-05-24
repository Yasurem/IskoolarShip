import { Router, type RequestHandler } from "express";

import { env } from "../config/env.js";
import type { HealthResponse } from "../types/api.js";

export const healthRouter = Router();

type EmptyParams = Record<string, never>;

const getHealth: RequestHandler<EmptyParams, HealthResponse> = (_request, response) => {
  response.json({
    ok: true,
    service: env.serviceName,
    timestamp: new Date().toISOString(),
  });
};

healthRouter.get("/", getHealth);
