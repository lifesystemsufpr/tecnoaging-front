import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";

export function useDeleteHealthUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["healthUnits"];

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_ROUTES.HEALTH_UNIT_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
