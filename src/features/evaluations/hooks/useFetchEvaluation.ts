import { useQuery } from "@tanstack/react-query";
import { evaluationService } from "../services/evaluation.service";

interface useFetchEvaluationProps {
  id: string;
}

export function useFetchEvaluation({ id }: useFetchEvaluationProps) {
  return useQuery({
    queryKey: ["evaluation", id],
    queryFn: async () => {
      return evaluationService.getById(id);
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}
