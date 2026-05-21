import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { EducationUnitRequest } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateEducationalUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["educationUnits"];

  return useMutation({
    mutationFn: async (data: EducationUnitRequest) => {
      await api.post(API_ROUTES.INSTITUTIONS, { ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
