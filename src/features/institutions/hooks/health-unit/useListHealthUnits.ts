import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/core/config/api.routes";
import { useHttp } from "@/core/hooks/useHttp";
import { ApiResponse } from "@/core/services/api.type";
import { HealthUnit } from "../../types";
import {
  FilterState,
  SortDirection,
} from "@/core/components/ui/table/header/TableColumn";

export interface FetchHealthUnitsParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: SortDirection;
  filters?: FilterState;
}

export function useListHealthUnits({
  pageSize,
  page,
  filters,
  sortDirection,
  sortField,
}: FetchHealthUnitsParams) {
  const api = useHttp();
  const endpoint = API_ROUTES.HEALTH_UNITS;

  return useQuery({
    queryKey: [
      "healthUnits",
      pageSize,
      page,
      filters,
      sortDirection,
      sortField,
    ],
    queryFn: () =>
      api.get<ApiResponse<HealthUnit[]>>(endpoint, {
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
