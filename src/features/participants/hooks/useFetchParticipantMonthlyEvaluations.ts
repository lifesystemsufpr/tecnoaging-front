import { useQuery } from "@tanstack/react-query";
import { participantService } from "../services/participant.service";

interface UseFetchParticipantMonthlyEvaluationsProps {
  participantCpf?: string;
  enabled?: boolean;
}

export function useFetchParticipantMonthlyEvaluations({
  participantCpf,
  enabled = true,
}: UseFetchParticipantMonthlyEvaluationsProps = {}) {
  return useQuery({
    queryKey: ["participant-dashboard", "monthly-evaluations", participantCpf],
    queryFn: () => participantService.fetchParticipantMonthlyEvaluations(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
