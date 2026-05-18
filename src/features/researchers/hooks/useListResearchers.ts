import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type FetchResearchersParams } from "../services/researcher.service";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/services/Routes";
import { Researcher } from "@/core/types";
import { ApiResponse } from "@/core/services/api.type";

export function useListResearchers({
  pageSize,
  page,
  filters,
  sortDirection,
  sortField,
}: FetchResearchersParams) {
  const api = useHttp();
  const endpoint = API_ROUTES.RESEARCHERS;

  return useQuery({
    queryKey: [
      "researchers",
      pageSize,
      page,
      filters,
      sortDirection,
      sortField,
    ],
    queryFn: () =>
      api.get<ApiResponse<Researcher[]>>(endpoint, {
        query: {
          page,
          pageSize,
          sortField,
          sortDirection,
          ...filters,
        },
      }),

    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });
}
