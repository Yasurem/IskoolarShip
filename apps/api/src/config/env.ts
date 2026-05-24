export type RuntimeEnvironment = "development" | "test" | "production";

export type ApiEnv = {
  readonly nodeEnv: RuntimeEnvironment;
  readonly port: number;
  readonly serviceName: string;
};

function isRuntimeEnvironment(value: string): value is RuntimeEnvironment {
  return value === "development" || value === "test" || value === "production";
}

function parseRuntimeEnvironment(value: string | undefined): RuntimeEnvironment {
  if (value !== undefined && isRuntimeEnvironment(value)) {
    return value;
  }

  return "development";
}

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim() === "") {
    return 3000;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return parsed;
}

function parseServiceName(value: string | undefined): string {
  const serviceName = value?.trim();

  if (serviceName === undefined || serviceName === "") {
    return "iskoolarship-api";
  }

  return serviceName;
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): ApiEnv {
  return {
    nodeEnv: parseRuntimeEnvironment(source.NODE_ENV),
    port: parsePort(source.PORT),
    serviceName: parseServiceName(source.SERVICE_NAME),
  };
}

export const env = loadEnv();
