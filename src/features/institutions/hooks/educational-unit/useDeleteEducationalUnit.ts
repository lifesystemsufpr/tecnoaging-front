import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";

export function useDeleteEducationalUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["educationUnits"];

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_ROUTES.INSTITUTION_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
