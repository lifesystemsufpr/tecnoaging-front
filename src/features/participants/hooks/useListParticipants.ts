import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { ApiResponse } from "@/core/services/api.type";
import { Participant } from "@/core/types";
import {
  FilterState,
  SortDirection,
} from "@/core/components/ui/table/header/TableColumn";
import { API_ROUTES } from "@/core/config/api.routes";

export interface FetchParticipantsParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: SortDirection;
  filters?: FilterState;
}

export function useListParticipants({
  pageSize,
  page,
  filters,
  sortDirection,
  sortField,
}: FetchParticipantsParams) {
  const api = useHttp();
  const endpoint = API_ROUTES.PARTICIPANTS;

  return useQuery({
    queryKey: [
      "participants",
      pageSize,
      page,
      filters,
      sortDirection,
      sortField,
    ],
    queryFn: () =>
      api.get<ApiResponse<Participant[]>>(endpoint, {
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
