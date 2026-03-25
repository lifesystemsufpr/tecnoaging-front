import { useQuery } from "@tanstack/react-query";
import { participantService } from "../services/participant.service";

interface UseFetchParticipantMonthlyAverageProps {
  participantCpf?: string;
  enabled?: boolean;
}

export function useFetchParticipantMonthlyAverage({
  participantCpf,
  enabled = true,
}: UseFetchParticipantMonthlyAverageProps = {}) {
  return useQuery({
    queryKey: ["participant-dashboard", "monthly-average", participantCpf],
    queryFn: () => participantService.fetchParticipantMonthlyAverage(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
