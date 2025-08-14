export type EnvRecord = Record<string, string | undefined>;

export const getViteEnv = (): EnvRecord => {
  try {
    const meta = import.meta as { env?: EnvRecord };
    return meta.env ?? {};
  } catch {
    return {};
  }
};

const env = getViteEnv();

export const ENV_USE_SERVER_TRUTH = String(env.VITE_USE_SERVER_TRUTH || "false") === "true";

const isAbsoluteHttp = (value?: string): boolean => !!value && /^https?:\/\//.test(value);
const mode = (import.meta as unknown as { env?: EnvRecord }).env?.MODE;

export const BASE_URL = isAbsoluteHttp(env.VITE_API_BASE_URL)
  ? (env.VITE_API_BASE_URL as string)
  : mode === "development"
    ? env.VITE_API_BASE_URL || "/api"
    : "https://dummyjson.com";
