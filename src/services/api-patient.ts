import {
  PatientPaginatedResponse,
  PatientRequest,
  PatientResponse,
} from "@/types/api/Patient";
import { API_ROUTES } from "./Routes";

export async function fetchPatients(
  access_token: string,
  page = 1,
  pageSize?: number,
  query?: string
): Promise<PatientPaginatedResponse> {
  let url = API_ROUTES.PATIENTS;

  if (pageSize) {
    url += `?page=${page}&pageSize=${pageSize}`;
  }
  if (query) {
    url += pageSize ? `&search=${query}` : `?search=${query}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      "Falha ao buscar pacientes: " + (errorData.message || res.statusText)
    );
  }
  return await res.json();
}

export async function fetchPatientById({
  access_token,
  id,
}: {
  access_token: string;
  id: string;
}): Promise<PatientResponse> {
  const res = await fetch(API_ROUTES.PATIENT_BY_ID(id), {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      "Falha ao buscar paciente: " + (errorData.message || res.statusText)
    );
  }
  return await res.json();
}

export async function createPatient({
  access_token,
  patientData,
}: {
  access_token: string;
  patientData: PatientRequest;
}): Promise<PatientResponse> {
  const res = await fetch(API_ROUTES.PATIENTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(patientData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      "Falha ao criar paciente: " + (errorData.message || res.statusText)
    );
  }
  return await res.json();
}

export async function updatePatient(
  access_token: string,
  id: string,
  patientData: Partial<PatientRequest>
): Promise<PatientResponse> {
  const res = await fetch(API_ROUTES.PATIENT_BY_ID(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(patientData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      "Falha ao atualizar paciente: " + (errorData.message || res.statusText)
    );
  }
  return await res.json();
}

export async function deletePatient(
  access_token: string,
  id: string
): Promise<void> {
  const resp = await fetch(API_ROUTES.PATIENT_BY_ID(id), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!resp.ok) {
    const errorData = await resp.json();
    throw new Error(
      "Falha ao deletar paciente: " + (errorData.message || resp.statusText)
    );
  }
}
