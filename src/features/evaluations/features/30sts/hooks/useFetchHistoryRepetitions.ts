import { evaluationService } from "@/features/evaluations/services/evaluation.service";
import { useQuery } from "@tanstack/react-query";

export function useFetchHistoryRepetitions({
  evaluationId,
}: {
  evaluationId: string;
}) {
  return useQuery({
    queryKey: ["30sts", "historyRepetitions", evaluationId],
    queryFn: async () => {
      const resp = await evaluationService.getRepetitionsHistory(evaluationId);
      return resp;
    },
    enabled: !!evaluationId,
    staleTime: 1000 * 60 * 10,
  });
}
