import { HealthUnitRequest } from "@/types/api/Health-unit";
import { API_ROUTES } from "./Routes";

export const fetchHealthUnits = async (access_token: string) => {
  const res = await fetch(API_ROUTES.HEALTH_UNITS, {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      "Falha ao buscar unidades de saúde: " +
        (errorData.message || res.statusText)
    );
  }
  return await res.json();
};

export const fetchHealthUnitById = async (id: string, access_token: string) => {
  const res = await fetch(API_ROUTES.HEALTH_UNIT_BY_ID(id), {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      "Falha ao buscar unidade de saúde: " +
        (errorData.message || res.statusText)
    );
  }
  return await res.json();
};

export const createHealthUnit = async (
  data: HealthUnitRequest,
  access_token: string
) => {
  const res = await fetch(API_ROUTES.HEALTH_UNITS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error creating health unit: ${errorData.message || res.statusText}`
    );
  }
  return await res.json();
};

export const updateHealthUnit = async (
  id: string,
  data: Partial<HealthUnitRequest>,
  access_token: string
) => {
  const res = await fetch(API_ROUTES.HEALTH_UNIT_BY_ID(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error updating health unit: ${errorData.message || res.statusText}`
    );
  }
  return await res.json();
};

export const deleteHealthUnit = async (id: string, access_token: string) => {
  const res = await fetch(API_ROUTES.HEALTH_UNIT_BY_ID(id), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Error deleting health unit: ${errorData.message || res.statusText}`
    );
  }
  return await res.json();
};
