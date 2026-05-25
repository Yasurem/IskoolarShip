export type RuntimeEnvironment = "development" | "test" | "production";

export type ApiEnv = {
  readonly nodeEnv: RuntimeEnvironment;
  readonly port: number;
  readonly serviceName: string;
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly cacheTtlMinutes: number;
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

function parseSupabaseUrl(value: string | undefined): string {
  if (!value || value === "YOUR_SUPABASE_PROJECT_URL") {
    throw new Error("SUPABASE_URL is missing or invalid. Please check your .env file.");
  }
  return value;
}

function parseSupabaseAnonKey(value: string | undefined): string {
  if (!value || value === "YOUR_SUPABASE_ANON_KEY") {
    throw new Error("SUPABASE_ANON_KEY is missing or invalid. Please check your .env file.");
  }
  return value;
}

function parseCacheTtlMinutes(value: string | undefined): number {
  if (value === undefined || value.trim() === "") {
    return 15; // default 15 minutes
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 1440) {
    throw new Error("CACHE_TTL_MINUTES must be an integer between 1 and 1440 (24 hours).");
  }
  return parsed;
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): ApiEnv {
  return {
    nodeEnv: parseRuntimeEnvironment(source.NODE_ENV),
    port: parsePort(source.PORT),
    serviceName: parseServiceName(source.SERVICE_NAME),
    supabaseUrl: parseSupabaseUrl(source.SUPABASE_URL),
    supabaseAnonKey: parseSupabaseAnonKey(source.SUPABASE_ANON_KEY),
    cacheTtlMinutes: parseCacheTtlMinutes(source.CACHE_TTL_MINUTES),
  };
}

export const env = loadEnv();
