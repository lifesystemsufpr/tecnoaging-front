import { API_ROUTES } from "@/core/config/api.routes";
import { useHttp } from "@/core/hooks/useHttp";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteResearcher() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["researchers"];

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_ROUTES.RESEARCHER_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
