import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { HealthUnitRequest } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateHealthUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();

  const queryKey = ["healthUnits"];
  return useMutation({
    mutationFn: async (data: HealthUnitRequest) => {
      await api.post(API_ROUTES.HEALTH_UNITS, { ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
