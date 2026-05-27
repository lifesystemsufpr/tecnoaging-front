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
        let genderNormalized = gender;

        if (gender === "all") {
          genderNormalized = ""
        }

        if (gender === "male") {
          genderNormalized = "MALE";
        }

        if (gender === "female") {
          genderNormalized = "FEMALE";
        }

      const [summary, monthlyHistory, averageByAgeGroup] = await Promise.all([
        api.get<Summary>(endpointSummary, {
          query: { gender: genderNormalized },
        }),

        api.get<MonthlyHistoryItem[]>(endpointMonthly, {
          query: { gender: genderNormalized },
        }),

        api.get<PercentileEntry[]>(endpointAge, {
          query: { gender: genderNormalized },
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
