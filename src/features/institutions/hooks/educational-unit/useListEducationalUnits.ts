import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/core/config/api.routes";
import { useHttp } from "@/core/hooks/useHttp";
import { ApiResponse } from "@/core/services/api.type";
import { EducationUnit } from "../../types";
import {
  FilterState,
  SortDirection,
} from "@/core/components/ui/table/header/TableColumn";

export interface FetchEducationalUnitsParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: SortDirection;
  filters?: FilterState;
}

export function useListEducationalUnits({
  pageSize,
  page,
  filters,
  sortDirection,
  sortField,
}: FetchEducationalUnitsParams) {
  const api = useHttp();
  const endpoint = API_ROUTES.INSTITUTIONS;

  return useQuery({
    queryKey: [
      "educationUnits",
      pageSize,
      page,
      filters,
      sortDirection,
      sortField,
    ],
    queryFn: () =>
      api.get<ApiResponse<EducationUnit[]>>(endpoint, {
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
