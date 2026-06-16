import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Participant } from "@/core/types";
import { ParticipantNestedFormData } from "@/core/libs/validators";
import { ValidationApiError } from "@/core/api";

export function useCreateParticipant() {
  const api = useHttp();
  const queryClient = useQueryClient();

  const endpoint = API_ROUTES.PARTICIPANTS;
  const queryKey = ["participants"];

  return useMutation<
    Participant,
    ValidationApiError,
    ParticipantNestedFormData
  >({
    mutationFn: async (data: ParticipantNestedFormData) => {
      const response = await api.post<Participant>(endpoint, { ...data });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
