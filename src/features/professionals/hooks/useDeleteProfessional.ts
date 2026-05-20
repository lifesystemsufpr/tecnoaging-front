import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/services/Routes";

export function useDeleteProfessional() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["professionals"];

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_ROUTES.HEALTH_PROFESSIONAL_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
