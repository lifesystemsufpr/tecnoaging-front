"use client";

import { useSession } from "next-auth/react";
import { http } from "../services/http.service";

export function useHttp() {
  const { data: session } = useSession();

  const accessToken = session?.accessToken;

  return {
    get: <T>(path: string, options?: Parameters<typeof http.get<T>>[1]) =>
      http.get<T>(path, {
        ...options,
        accessToken,
      }),

    post: <T>(
      path: string,
      body?: unknown,
      options?: Parameters<typeof http.post<T>>[2]
    ) =>
      http.post<T>(path, body, {
        ...options,
        accessToken,
      }),

    put: <T>(
      path: string,
      body?: unknown,
      options?: Parameters<typeof http.put<T>>[2]
    ) =>
      http.put<T>(path, body, {
        ...options,
        accessToken,
      }),

    patch: <T>(
      path: string,
      body?: unknown,
      options?: Parameters<typeof http.patch<T>>[2]
    ) =>
      http.patch<T>(path, body, {
        ...options,
        accessToken,
      }),

    delete: <T>(path: string, options?: Parameters<typeof http.delete<T>>[1]) =>
      http.delete<T>(path, {
        ...options,
        accessToken,
      }),
  };
}
