import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { ApiResponse } from "@/core/services/api.type";
import { HealthProfessional } from "@/core/types";
import {
  FilterState,
  SortDirection,
} from "@/core/components/ui/table/header/TableColumn";
import { API_ROUTES } from "@/core/config/api.routes";

export interface FetchProfessionalsParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: SortDirection;
  filters?: FilterState;
}

export function useListProfessionals({
  pageSize,
  page,
  filters,
  sortDirection,
  sortField,
}: FetchProfessionalsParams) {
  const api = useHttp();
  const endpoint = API_ROUTES.HEALTH_PROFESSIONALS;

  return useQuery({
    queryKey: [
      "professionals",
      pageSize,
      page,
      filters,
      sortDirection,
      sortField,
    ],
    queryFn: () =>
      api.get<ApiResponse<HealthProfessional[]>>(endpoint, {
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
