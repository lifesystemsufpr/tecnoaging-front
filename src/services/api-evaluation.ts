import { Evaluation } from "@/types/domain/Evaluation";
import { API_ROUTES } from "./Routes";
import {
  EvaluationResponse,
  ListEvaluationsResponse,
} from "@/types/api/Evaluation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.seuservidor.com";

type ListFilters = {
  patientName?: string | null;
  healthProfessionalName?: string | null;
  startDate?: string | null; // 'YYYY-MM-DD' (recomendado)
  endDate?: string | null; // 'YYYY-MM-DD'
  type?: string | null;
  page?: number;
  pageSize?: number;
};

function authHeaders(token?: string) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Monta querystring apenas com valores definidos
function qs(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  });
  return search.toString();
}

export async function fetchEvaluations(
  token: string,
  filters?: ListFilters
): Promise<ListEvaluationsResponse> {
  const query = qs({
    patientName: filters?.patientName ?? undefined,
    healthProfessionalName: filters?.healthProfessionalName ?? undefined,
    startDate: filters?.startDate ?? undefined,
    endDate: filters?.endDate ?? undefined,
    type: filters?.type ?? undefined,
    page: filters?.page ?? undefined,
    pageSize: filters?.pageSize ?? undefined,
  });

  const url = `${API_ROUTES.EVALUATIONS}${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erro ao listar avaliações (${res.status})`);
  }
  return res.json();
}

export async function fetchEvaluationById(
  id: string,
  token: string
): Promise<EvaluationResponse> {
  const res = await fetch(API_ROUTES.EVALUATION_BY_ID(id), {
    method: "GET",
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar avaliação (${res.status})`);
  }
  console.log(res);
  return res.json();
}

export async function deleteEvaluation(
  id: string,
  token: string
): Promise<void> {
  const res = await fetch(API_ROUTES.EVALUATION_BY_ID(id), {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Erro ao excluir avaliação (${res.status})`);
  }
}
