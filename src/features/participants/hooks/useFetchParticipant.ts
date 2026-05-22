import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { Participant } from "@/core/types";
import { API_ROUTES } from "@/core/config/api.routes";

export function useFetchParticipant({
  participantId,
}: {
  participantId: string;
}) {
  const api = useHttp();

  return useQuery({
    queryKey: ["participant", participantId],
    queryFn: () =>
      api.get<Participant>(API_ROUTES.PARTICIPANT_BY_ID(participantId)),
  });
}
