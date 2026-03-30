import { useQuery } from "@tanstack/react-query";
import { participantService } from "../services/participant.service";

interface UseFetchParticipantMostPerformedTestsProps {
  participantCpf?: string;
  enabled?: boolean;
}

export function useFetchParticipantMostPerformedTests({
  participantCpf,
  enabled = true,
}: UseFetchParticipantMostPerformedTestsProps = {}) {
  return useQuery({
    queryKey: ["participant-dashboard", "most-performed-tests", participantCpf],
    queryFn: () => participantService.fetchParticipantMostPerformedTests(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
