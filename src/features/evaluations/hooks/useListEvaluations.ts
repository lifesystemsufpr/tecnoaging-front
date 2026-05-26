import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { evaluationService } from "../services/evaluation.service";
import { useListEvaluationsContext } from "../contexts/ListEvaluationsContext";

const EVALUATIONS_QUERY_KEY = "evaluations-list";

/**
 * Query hook: fetches the evaluations list based on context filters + pagination.
 */
export function useListEvaluationsQuery() {
  const { buildRequestFilters } = useListEvaluationsContext();
  const requestFilters = buildRequestFilters();

  return useQuery({
    queryKey: [EVALUATIONS_QUERY_KEY, requestFilters],
    queryFn: () => evaluationService.list(requestFilters),
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation hook: deletes an evaluation and invalidates the list cache.
 */
export function useDeleteEvaluationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => evaluationService.delete(id),
    onSuccess: () => {
      toast.success("Avaliação excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: [EVALUATIONS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Erro ao excluir avaliação.");
    },
  });
}
