import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";

import { catalogRouter } from "./routes/catalog.js";
import { healthRouter } from "./routes/health.js";
import type { ErrorResponse } from "./types/api.js";

export const app = express();

type EmptyParams = Record<string, never>;

app.disable("x-powered-by");

app.use("/health", healthRouter);
app.use("/catalog", catalogRouter);

const notFoundHandler: RequestHandler<EmptyParams, ErrorResponse> = (_request, response) => {
  response.status(404).json({
    error: {
      code: "not_found",
      message: "The requested resource was not found.",
    },
  });
};

const errorHandler: ErrorRequestHandler<EmptyParams, ErrorResponse> = (
  _error,
  _request,
  response,
  _next,
) => {
  response.status(500).json({
    error: {
      code: "internal_server_error",
      message: "An unexpected error occurred.",
    },
  });
};

app.use(notFoundHandler);
app.use(errorHandler);
