import { useQuery } from "@tanstack/react-query";
import { evaluationService } from "../services/evaluation.service";

interface useFetchEvaluationDetailedProps {
  id: string;
}

export function useFetchEvaluationDetailed<T>({
  id,
}: useFetchEvaluationDetailedProps) {
  return useQuery({
    queryKey: ["evaluationDetailed", id],
    queryFn: async () => {
      return evaluationService.getDetailed<T>(id);
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}
