export type HealthResponse = {
  readonly ok: true;
  readonly service: string;
  readonly timestamp: string;
};

export type ErrorResponse = {
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
};
