import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { EvaluationDashboardResponse } from "../type";

interface UseFetchEvaluationDashboard {
  startDate?: string;
  endDate?: string;
}

export function useFetchEvaluationDashboard({
  startDate,
  endDate,
}: UseFetchEvaluationDashboard) {
  const api = useHttp();

  return useQuery<EvaluationDashboardResponse>({
    queryKey: ["evaluations-dashboard", startDate, endDate],
    queryFn: () =>
      api.get<EvaluationDashboardResponse>(
        API_ROUTES.RESEARCHER_DASHBOARDS.EVALUATION,
        {
          query: {
            startDate,
            endDate,
          },
        }
      ),
    retry: 1,
    staleTime: 15 * 60 * 1000,
  });
}
