import { API_BASE_URL } from "./Routes";

export type TitleEntity = { id: string; title: string };
export type TitleRequest = { title: string };

export const makeTitleService = (resourcePath: string) => {
  const base = `${API_BASE_URL}/${resourcePath}`;

  const hdrs = (token?: string) =>
    token ? { Authorization: `Bearer ${token}` } : {};

  return {
    async list(token?: string): Promise<TitleEntity[]> {
      const res = await fetch(base, { headers: hdrs(token) });
      const json = await res.json();
      return Array.isArray(json) ? json : (json?.data ?? []);
    },
    async create(payload: TitleRequest, token?: string): Promise<void> {
      await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...hdrs(token) },
        body: JSON.stringify(payload),
      });
    },
    async update(
      id: string,
      payload: TitleRequest,
      token?: string
    ): Promise<void> {
      await fetch(`${base}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...hdrs(token) },
        body: JSON.stringify(payload),
      });
    },
    async remove(id: string, token?: string): Promise<void> {
      await fetch(`${base}/${id}`, {
        method: "DELETE",
        headers: { ...hdrs(token) },
      });
    },
  };
};
