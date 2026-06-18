import { useQuery } from "@tanstack/react-query";
import { dasboardEvaluation } from "../mocks/dashboard";
import { EvaluationDashboardResponse } from "../type";

export function useFetchEvaluationDashboard() {
  return useQuery<EvaluationDashboardResponse>({
    queryKey: ["evaluations-dashboard"],
    queryFn: async () => {
      // Simula um delay de rede para exibir o esqueleto carregando
      await new Promise((resolve) => setTimeout(resolve, 800));
      return dasboardEvaluation.data;
    },
    retry: 0,
  });
}