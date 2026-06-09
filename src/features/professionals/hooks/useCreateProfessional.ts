import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HealthProfessional } from "@/core/types";
import { HealthProfessionalFormData } from "@/core/libs/validators";

export function useCreateProfessional() {
  const api = useHttp();
  const queryClient = useQueryClient();

  const endpoint = API_ROUTES.HEALTH_PROFESSIONALS;
  const queryKey = ["professionals"];

  return useMutation({
    mutationFn: async (data: HealthProfessionalFormData) => {
      const response = await api.post<HealthProfessional>(endpoint, { ...data });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
