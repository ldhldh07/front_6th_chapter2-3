const BASE_URL = window.location.origin + "/api";

type Query = Record<string, string | number | boolean | string[] | undefined>;

function buildUrl(base: string, path: string, params?: Query) {
  const url = new URL(path.replace(/^\//, ""), base.endsWith("/") ? base : base + "/");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;
      const serialized = Array.isArray(value)
        ? value.map(String).join(",")
        : typeof value === "string"
          ? value.replace(/\s*,\s*/g, ",").trim()
          : String(value);
      url.searchParams.set(key, serialized);
    });
  }
  return url.toString();
}

export interface HttpClient {
  get<T>(path: string, options?: { params?: Query; headers?: HeadersInit }): Promise<T>;
  post<T>(path: string, body?: unknown, options?: { headers?: HeadersInit }): Promise<T>;
  put<T>(path: string, body?: unknown, options?: { headers?: HeadersInit }): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: { headers?: HeadersInit }): Promise<T>;
  delete<T>(path: string, options?: { headers?: HeadersInit }): Promise<T>;
}

export function createHttpClient(baseUrl: string): HttpClient {
  async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${text ? `- ${text}` : ""}`);
    }
    return (await res.json()) as T;
  }

  return {
    get: (path, options) =>
      request(buildUrl(baseUrl, path, options?.params), { method: "GET", headers: options?.headers }),
    post: (path, body, options) =>
      request(buildUrl(baseUrl, path), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...options?.headers },
        body: body == null ? undefined : JSON.stringify(body),
      }),
    put: (path, body, options) =>
      request(buildUrl(baseUrl, path), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...options?.headers },
        body: body == null ? undefined : JSON.stringify(body),
      }),
    patch: (path, body, options) =>
      request(buildUrl(baseUrl, path), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...options?.headers },
        body: body == null ? undefined : JSON.stringify(body),
      }),
    delete: (path, options) => request(buildUrl(baseUrl, path), { method: "DELETE", headers: options?.headers }),
  };
}

export const http = createHttpClient(BASE_URL);
