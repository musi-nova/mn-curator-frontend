export interface ApiRequestOptions {
  method?: string;
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

async function timeoutPromise<T>(ms: number, promise: Promise<T>) {
  let id: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    id = setTimeout(() => reject(new Error("Request timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(id));
}

export const API_BASE = (import.meta.env.VITE_API_URL as string) || "";

export async function apiRequest<T = any>(path: string, opts: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, token = null, headers = {}, timeoutMs = 15000 } = opts;

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const init: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  };

  const res = await timeoutPromise(timeoutMs, fetch(url, init));

  if (!res.ok) {
    const text = await res.text();
    let parsed: any = text;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // keep raw text
    }
    const error: any = new Error(`API request failed: ${res.status} ${res.statusText}`);
    error.status = res.status;
    error.body = parsed;
    throw error;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  // fallback to text
  return (await res.text()) as unknown as T;
}

export default apiRequest;
