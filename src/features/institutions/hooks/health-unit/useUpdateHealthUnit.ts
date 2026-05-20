import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { HealthUnitRequest } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateHealthUnitParams {
  id: string;
  data: HealthUnitRequest;
}

export function useUpdateHealthUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();

  const queryKey = ["healthUnits"];
  return useMutation({
    mutationFn: async ({ id, data }: UpdateHealthUnitParams) => {
      await api.put(API_ROUTES.HEALTH_UNIT_BY_ID(id), { ...data });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
