import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HealthProfessional } from "@/core/types";
import { HealthProfessionalUpdateFormData } from "@/core/libs/validators";
import { ValidationApiError } from "@/core/api";

type UpdateProfessionalPayload = {
  id: string;
  data: Partial<HealthProfessionalUpdateFormData>;
};

export function useUpdateProfessional() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["professionals"];

  return useMutation<
    HealthProfessional,
    ValidationApiError,
    UpdateProfessionalPayload
  >({
    mutationFn: ({ id, data }: UpdateProfessionalPayload) =>
      api.patch<HealthProfessional>(API_ROUTES.HEALTH_PROFESSIONAL_BY_ID(id), {
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
