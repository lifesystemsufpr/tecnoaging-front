import { API_BASE_URL } from "./Routes";

export type TitleEntity = { id: string; title: string };
export type TitleRequest = { title: string };

export const makeTitleService = (resourcePath: string) => {
  const base = `${API_BASE_URL}/${resourcePath}`;

  const hdrs = (token?: string) =>
    token ? { Authorization: `Bearer ${token}` } : {};

  return {
    async list(token?: string): Promise<TitleEntity[]> {
      try {
        const res = await fetch(base, { headers: hdrs(token) });
        if (!res.ok) {
          throw new Error(`Erro ao listar títulos: ${res.statusText}`);
        }
        const json = await res.json();
        return Array.isArray(json) ? json : (json?.data ?? []);
      } catch (error) {
        // Você pode logar o erro ou realizar outra ação aqui.
        throw error;
      }
    },
    async create(payload: TitleRequest, token?: string): Promise<void> {
      try {
        const res = await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...hdrs(token) },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`Erro ao criar título: ${res.statusText}`);
        }
      } catch (error) {
        throw error;
      }
    },
    async update(
      id: string,
      payload: TitleRequest,
      token?: string
    ): Promise<void> {
      try {
        const res = await fetch(`${base}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...hdrs(token) },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`Erro ao atualizar título: ${res.statusText}`);
        }
      } catch (error) {
        throw error;
      }
    },
    async remove(id: string, token?: string): Promise<void> {
      try {
        const res = await fetch(`${base}/${id}`, {
          method: "DELETE",
          headers: { ...hdrs(token) },
        });
        if (!res.ok) {
          throw new Error(`Erro ao remover título: ${res.statusText}`);
        }
      } catch (error) {
        throw error;
      }
    },
  };
};
