import { useHttp } from "@/core/hooks/useHttp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResearcherCreateRequest } from "../types";
import { Researcher } from "@/core/types";
import { API_ROUTES } from "@/core/config/api.routes";
import { ValidationApiError } from "@/core/api";

export function useCreateResearcher() {
  const api = useHttp();
  const queryClient = useQueryClient();

  const endpoint = API_ROUTES.RESEARCHERS;
  const queryKey = ["researchers"];

  return useMutation<Researcher, ValidationApiError, ResearcherCreateRequest>({
    mutationFn: async (data: ResearcherCreateRequest) => {
      const response = await api.post<Researcher>(endpoint, { ...data });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
