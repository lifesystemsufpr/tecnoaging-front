import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import {
  MonthlyHistoryItem,
  PercentileEntry,
  Summary,
  DashboardResponse,
} from "../types";

export function useResearcherDashboard(gender: string) {
  const api = useHttp();

  return useQuery({
    queryKey: ["researcherDashboard", gender],

    queryFn: async (): Promise<DashboardResponse> => {
      const endpointSummary = API_ROUTES.RESEARCHER_DASHBOARDS.SUMMARY;

      const endpointMonthly = API_ROUTES.RESEARCHER_DASHBOARDS.MONTHLY_HISTORY;

      const endpointAge =
        API_ROUTES.RESEARCHER_DASHBOARDS.AVARAGE_TEST_BY_AGE_GROUP;

      const [summary, monthlyHistory, averageByAgeGroup] = await Promise.all([
        api.get<Summary>(endpointSummary, {
          query: { gender },
        }),

        api.get<MonthlyHistoryItem[]>(endpointMonthly, {
          query: { gender },
        }),

        api.get<PercentileEntry[]>(endpointAge, {
          query: { gender },
        }),
      ]);

      return {
        summary,
        monthlyHistory,
        averageByAgeGroup,
      };
    },

    staleTime: 5 * 60 * 1000,
  });
}
