import { evaluationService } from "@/features/evaluations/services/evaluation.service";
import { useQuery } from "@tanstack/react-query";

export function useFetchHistoryRepetitions({
  patientId,
}: {
  patientId: string;
}) {
  return useQuery({
    queryKey: ["30sts", "historyRepetitions", patientId],
    queryFn: async () => {
      const resp = await evaluationService.getRepetitionsHistory(patientId);
      console.log("API Response for history repetitions:", resp);
      return resp.data;
    },
    enabled: !!patientId,
    staleTime: 1000 * 60 * 10,
  });
}
