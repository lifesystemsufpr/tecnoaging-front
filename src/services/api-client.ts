import { getSession } from "next-auth/react";

type FetchOptions = RequestInit & {
  token?: string;
};

export async function fetchClient(
  endpoint: string,
  options: FetchOptions = {}
) {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers || {});

  if (
    !headers.has("Content-Type") &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  let accessToken = token;

  if (!accessToken) {
    const session = await getSession();
    if (session?.accessToken) {
      accessToken = session.accessToken;
    }
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Erro na requisição: ${response.statusText}`
    );
  }

  if (response.status === 204) return null;
  return await response.json();
}
