import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { ApiResponse } from "@/core/services/api.type";
import { EducationUnit } from "../types";
import { API_ROUTES } from "@/core/config/api.routes";

export interface UseListInstitutionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
  orderBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
  enabled?: boolean;
}

export function useListInstitutions({
  page = 1,
  pageSize = 50,
  search,
  active,
  orderBy,
  sortOrder,
  enabled = true,
}: UseListInstitutionsParams = {}) {
  const api = useHttp();
  const endpoint = API_ROUTES.INSTITUTIONS;

  return useQuery({
    queryKey: [
      "institutions",
      page,
      pageSize,
      search,
      active,
      orderBy,
      sortOrder,
    ],
    queryFn: () =>
      api.get<ApiResponse<EducationUnit[]>>(endpoint, {
        query: {
          page,
          pageSize,
          search,
          active,
          orderBy,
          sortOrder,
        },
      }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}
