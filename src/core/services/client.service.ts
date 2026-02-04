/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from "next-auth/react";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ClientServiceOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface ClientServiceProps {
  endpoint: string;
  method?: HttpMethod;
  options?: ClientServiceOptions;
}

export async function clientService<T = unknown>({
  endpoint,
  method = "GET",
  options = {},
}: ClientServiceProps): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);

  if (!headers.has("Content-Type") && !(rest.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let accessToken = token;

  if (!accessToken) {
    const session = await getSession();
    if (session?.accessToken) {
      accessToken = session.accessToken as string;
    }
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    ...rest,
  });

  if (!response.ok) {
    let errorData: unknown = undefined;

    try {
      errorData = await response.json();
    } catch {}

    throw new ApiError(
      (errorData as any)?.message ?? `Erro na requisição (${response.status})`,
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}
