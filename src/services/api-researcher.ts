import {
  ResearcherPaginatedResponse,
  ResearcherRequest,
  ResearcherResponse,
} from "@/types/api/Researcher";
import { API_ROUTES } from "./Routes";

interface FetchResearchersParams {
  access_token: string;
  id?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function fetchResearchers({
  access_token,
  page = 1,
  pageSize,
  search,
}: FetchResearchersParams): Promise<ResearcherPaginatedResponse> {
  let url = API_ROUTES.RESEARCHERS;

  if (pageSize) {
    url += `?page=${page}&pageSize=${pageSize}`;
  }
  if (search) {
    url += pageSize ? `&search=${search}` : `?search=${search}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return await res.json();
}

export async function fetchResearcherById({
  id,
  access_token,
}: FetchResearchersParams): Promise<ResearcherResponse> {
  const res = await fetch(API_ROUTES.RESEARCHER_BY_ID(id), {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return await res.json();
}

export async function createResearcher({
  data,
  access_token,
}: {
  data: ResearcherRequest;
  access_token: string;
}): Promise<ResearcherResponse> {
  const res = await fetch(API_ROUTES.RESEARCHERS, {
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
      `Error creating researcher: ${errorData.message || res.statusText}`
    );
  }
  return await res.json();
}

export async function updateResearcher({
  id,
  data,
  access_token,
}: {
  id: string;
  data: Partial<ResearcherRequest>;
  access_token: string;
}): Promise<ResearcherResponse | null> {
  const res = await fetch(API_ROUTES.RESEARCHER_BY_ID(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteResearcher({
  id,
  access_token,
}: {
  id: string;
  access_token: string;
}): Promise<void> {
  await fetch(API_ROUTES.RESEARCHER_BY_ID(id), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}
