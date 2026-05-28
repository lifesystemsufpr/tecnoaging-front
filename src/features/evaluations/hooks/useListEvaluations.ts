import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { API_ROUTES } from "@/core/config/api.routes";
import { useHttp } from "@/core/hooks/useHttp";
import { ApiResponse } from "@/core/services/api.type";
import { Evaluation, EvaluationFilters } from "../types/Evaluation.types";

export interface FetchEvaluationsParams {
  page?: number;
  pageSize?: number;
  filters?: EvaluationFilters;
}

export function useListEvaluations({
  pageSize,
  page,
  filters,
}: FetchEvaluationsParams) {
  const api = useHttp();
  const endpoint = API_ROUTES.EVALUATIONS;

  return useQuery({
    queryKey: ["evaluations", pageSize, page, filters],
    queryFn: () =>
      api.get<ApiResponse<Evaluation[]>>(endpoint, {
        query: {
          page,
          pageSize,
          ...filters,
        },
      }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDeleteEvaluationMutation() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["evaluations"];

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_ROUTES.EVALUATION_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
