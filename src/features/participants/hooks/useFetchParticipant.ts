import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/services/Routes";
import { useHttp } from "@/core/hooks/useHttp";
import { Participant } from "@/core/types";

export function useFetchParticipant({
  participantId,
}: {
  participantId: string;
}) {
  const api = useHttp();

  return useQuery({
    queryKey: ["participant", participantId],
    queryFn: () =>
      api.get<Participant>(API_ROUTES.PATIENT_BY_ID(participantId)),
  });
}
