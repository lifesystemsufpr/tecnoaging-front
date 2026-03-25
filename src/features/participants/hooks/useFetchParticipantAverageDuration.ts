import { useQuery } from "@tanstack/react-query";
import { participantService } from "../services/participant.service";

interface UseFetchParticipantAverageDurationProps {
  participantCpf?: string;
  enabled?: boolean;
}

export function useFetchParticipantAverageDuration({
  participantCpf,
  enabled = true,
}: UseFetchParticipantAverageDurationProps = {}) {
  return useQuery({
    queryKey: ["participant-dashboard", "average-duration", participantCpf],
    queryFn: () => participantService.fetchParticipantAverageDuration(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
