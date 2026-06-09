import { API_BASE_URL } from "../config/api.routes";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: HeadersInit;
  auth?: boolean;
  signal?: AbortSignal;
  accessToken?: string;
};

export type ApiError = {
  status: number;
  message: string;
  data?: unknown;
};

const isAbsoluteUrl = (path: string) => path.startsWith("http");

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const base = isAbsoluteUrl(path) ? path : `${API_BASE_URL}${path}`;

  const url = new URL(base);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

export async function client<T>(
  path: string,
  {
    method = "GET",
    body,
    query,
    headers,
    auth = true,
    signal,
    accessToken,
  }: RequestOptions = {}
): Promise<T> {
  const url = buildUrl(path, query);

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
  };

  if (auth && accessToken) {
    defaultHeaders.Authorization = `Bearer ${accessToken}`;
  }

  let resolvedBody: BodyInit | undefined;

  if (body instanceof FormData) {
    resolvedBody = body;
  } else if (body !== undefined) {
    defaultHeaders["Content-Type"] = "application/json";

    resolvedBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: resolvedBody,
    signal,
    credentials: "include",
  });

  const rawText = await response.text();

  const parsed = rawText ? safeJson(rawText) : null;

  if (!response.ok) {
    throw {
      status: response.status,
      message: parsed?.message || response.statusText || "Erro inesperado",
      data: parsed ?? rawText,
    } satisfies ApiError;
  }

  if (!rawText) {
    return undefined as T;
  }

  return parsed as T;
}

const safeJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    client<T>(path, {
      ...options,
      method: "GET",
    }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) =>
    client<T>(path, {
      ...options,
      method: "POST",
      body,
    }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) =>
    client<T>(path, {
      ...options,
      method: "PUT",
      body,
    }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) =>
    client<T>(path, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: <T>(path: string, options?: Omit<RequestOptions, "method">) =>
    client<T>(path, {
      ...options,
      method: "DELETE",
    }),
};
