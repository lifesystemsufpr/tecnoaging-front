import {
  InstitutionRequest,
  InstitutionResponse,
} from "@/types/api/Institution";
import { API_ROUTES } from "./Routes";
import { fetchClient } from "./api-client";
import { ApiResponse } from "@/core/services/api.type";

export async function fetchInstitutions({
  access_token,
  title,
}: InstitutionRequest): Promise<ApiResponse<InstitutionResponse[]>> {
  const url = new URL(API_ROUTES.INSTITUTIONS);
  if (title) url.searchParams.append("search", title);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return await res.json();
}

export async function fetchInstitutionById({
  access_token,
  id,
}: InstitutionRequest): Promise<InstitutionResponse> {
  const res = await fetch(API_ROUTES.INSTITUTION_BY_ID(id!), {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return await res.json();
}

export async function deleteInstitution({ id }: { id: string }): Promise<void> {
  try {
    await fetchClient(API_ROUTES.INSTITUTION_BY_ID(id), {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(`Erro ao excluir instituição (${error})`);
  }
}

export async function createInstitution({
  title,
}: {
  title: string;
}): Promise<void> {
  try {
    await fetchClient(API_ROUTES.INSTITUTIONS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  } catch (error) {
    throw new Error(`Erro ao criar instituição (${error})`);
  }
}

export async function updateInstitution({
  id,
  title,
}: {
  id: string;
  title: string;
}): Promise<void> {
  try {
    await fetchClient(API_ROUTES.INSTITUTION_BY_ID(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  } catch (error) {
    throw new Error(`Erro ao atualizar instituição (${error})`);
  }
}
