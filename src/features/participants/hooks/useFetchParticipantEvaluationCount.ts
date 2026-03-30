import { useQuery } from "@tanstack/react-query";
import { participantService } from "../services/participant.service";

interface UseFetchParticipantEvaluationCountProps {
  participantCpf?: string;
  enabled?: boolean;
}

export function useFetchParticipantEvaluationCount({
  participantCpf,
  enabled = true,
}: UseFetchParticipantEvaluationCountProps = {}) {
  return useQuery({
    queryKey: ["participant-dashboard", "evaluation-count", participantCpf],
    queryFn: () => participantService.fetchParticipantEvaluationCount(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
