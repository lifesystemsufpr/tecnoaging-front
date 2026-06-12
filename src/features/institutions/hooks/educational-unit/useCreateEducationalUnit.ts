import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import type { EducationUnit, EducationUnitRequest } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidationApiError } from "@/core/api";

export function useCreateEducationalUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["educationUnits"];

  return useMutation<EducationUnit, ValidationApiError, EducationUnitRequest>({
    mutationFn: async (data: EducationUnitRequest) => {
      const response = await api.post<EducationUnit>(API_ROUTES.INSTITUTIONS, {
        ...data,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
