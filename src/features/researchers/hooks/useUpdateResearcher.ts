import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResearcherCreateRequest } from "../types";
import { Researcher } from "@/core/types";
import { ValidationApiError } from "@/core/api";

type UpdateResearcherPayload = {
  id: string;
  data: Partial<ResearcherCreateRequest>;
};

export function useUpdateResearcher() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["researchers"];

  return useMutation<Researcher, ValidationApiError, UpdateResearcherPayload>({
    mutationFn: ({ id, data }: UpdateResearcherPayload) =>
      api.patch<Researcher>(API_ROUTES.RESEARCHER_BY_ID(id), {
        ...data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
