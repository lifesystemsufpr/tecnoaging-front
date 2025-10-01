import {
  InstitutionRequest,
  InstitutionResponse,
} from "@/types/api/Institution";
import { API_ROUTES } from "./Routes";

export async function fetchInstitutions({
  access_token,
}: InstitutionRequest): Promise<InstitutionResponse[]> {
  const res = await fetch(API_ROUTES.INSTITUTIONS, {
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
