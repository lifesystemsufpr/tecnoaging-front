import { Evaluation } from "@/types/domain/Evaluation";
import { Patient } from "@/types/domain/Patient";
import { HealthProfessional } from "@/types/domain/Health-professional";
import { API_ROUTES } from "./Routes";
import {
  EvaluationResponse,
  ListEvaluationsResponse,
} from "@/types/api/Evaluation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.seuservidor.com";

type ListFilters = {
  patientId?: string | null;
  healthProfessionalId?: string | null;
  dateFrom?: string | null; // 'YYYY-MM-DD' (recomendado)
  dateTo?: string | null; // 'YYYY-MM-DD'
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
    patientId: filters?.patientId ?? undefined,
    healthProfessionalId: filters?.healthProfessionalId ?? undefined,
    dateFrom: filters?.dateFrom ?? undefined,
    dateTo: filters?.dateTo ?? undefined,
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
  const res = await fetch(`${API_BASE}/evaluations/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Erro ao excluir avaliação (${res.status})`);
  }
}

// ---- Autocomplete helpers ----
// Ajuste endpoints/params conforme sua API real

export async function fetchPatients(
  token: string,
  search?: string
): Promise<Patient[]> {
  const query = qs({ q: search ?? undefined, limit: 10 });
  const res = await fetch(`${API_BASE}/patients${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Erro ao listar pacientes (${res.status})`);
  }
  return res.json();
}

export async function fetchHealthProfessionals(
  token: string,
  search?: string
): Promise<HealthProfessional[]> {
  const query = qs({ q: search ?? undefined, limit: 10 });
  const res = await fetch(
    `${API_BASE}/health-professionals${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: authHeaders(token),
    }
  );
  if (!res.ok) {
    throw new Error(`Erro ao listar profissionais (${res.status})`);
  }
  return res.json();
}
