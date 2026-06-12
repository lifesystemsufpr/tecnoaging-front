import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Participant } from "@/core/types";
import { ParticipantNestedUpdateFormData } from "@/core/libs/validators";
import { ValidationApiError } from "@/core/api";

type UpdateParticipantPayload = {
  id: string;
  data: Partial<ParticipantNestedUpdateFormData>;
};

export function useUpdateParticipant() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["participants"];

  return useMutation<Participant, ValidationApiError, UpdateParticipantPayload>(
    {
      mutationFn: ({ id, data }: UpdateParticipantPayload) =>
        api.patch<Participant>(API_ROUTES.PARTICIPANT_BY_ID(id), {
          ...data,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }
  );
}
