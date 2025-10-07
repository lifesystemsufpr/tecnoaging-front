import {
  HealthProfessionalPaginatedResponse,
  HealthProfessionalRequest,
} from "@/types/api/Health-professional";
import { API_ROUTES } from "./Routes";

export async function fetchHealthProfessionals({
  accessToken,
  page = 1,
  pageSize,
  query,
}: {
  accessToken: string;
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<HealthProfessionalPaginatedResponse> {
  const searchParams = new URLSearchParams();
  if (pageSize) {
    searchParams.set("page", String(page));
    searchParams.set("pageSize", String(pageSize));
  } else if (page && page !== 1) {
    searchParams.set("page", String(page));
  }
  if (query && query.trim()) {
    searchParams.set("search", query.trim());
  }

  const qs = searchParams.toString();
  const url = qs
    ? `${API_ROUTES.HEALTH_PROFESSIONALS}?${qs}`
    : API_ROUTES.HEALTH_PROFESSIONALS;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function fetchHealthProfessionalById({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) {
  const res = await fetch(API_ROUTES.HEALTH_PROFESSIONAL_BY_ID(id), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function createHealthProfessional({
  data,
  accessToken,
}: {
  data: HealthProfessionalRequest;
  accessToken: string;
}) {
  const res = await fetch(API_ROUTES.HEALTH_PROFESSIONALS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateHealthProfessional({
  id,
  data,
  accessToken,
}: {
  id: string;
  data: Partial<HealthProfessionalRequest>;
  accessToken: string;
}) {
  const res = await fetch(API_ROUTES.HEALTH_PROFESSIONAL_BY_ID(id), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteHealthProfessional({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) {
  const res = await fetch(API_ROUTES.HEALTH_PROFESSIONAL_BY_ID(id), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to delete health professional with id ${id}`);
  }
  return res.ok;
}
