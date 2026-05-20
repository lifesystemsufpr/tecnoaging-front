import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";

export function useDeleteParticipant() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(API_ROUTES.PARTICIPANT_BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
