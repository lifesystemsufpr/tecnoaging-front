import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { HealthUnitRequest } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidationApiError } from "@/core/api";

interface UpdateHealthUnitParams {
  id: string;
  data: HealthUnitRequest;
}

export function useUpdateHealthUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();

  const queryKey = ["healthUnits"];
  return useMutation<void, ValidationApiError, UpdateHealthUnitParams>({
    mutationFn: async ({ id, data }: UpdateHealthUnitParams) => {
      await api.patch(API_ROUTES.HEALTH_UNIT_BY_ID(id), { ...data });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
