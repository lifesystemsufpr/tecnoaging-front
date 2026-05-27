import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import {
  MonthlyHistoryItem,
  PercentileEntry,
  Summary,
  DashboardResponse,
  GenderMode,
} from "../types";

function normalizeGender(gender: GenderMode | string) {
  if (gender === "male") return "MALE";
  if (gender === "female") return "FEMALE";

  return "";
}

export function useResearcherDashboard(gender: GenderMode | string) {
  const api = useHttp();
  const normalizedGender = normalizeGender(gender);

  return useQuery({
    queryKey: ["researcherDashboard", normalizedGender],

    queryFn: async (): Promise<DashboardResponse> => {
      const endpointSummary = API_ROUTES.RESEARCHER_DASHBOARDS.SUMMARY;

      const endpointMonthly = API_ROUTES.RESEARCHER_DASHBOARDS.MONTHLY_HISTORY;

      const endpointAge =
        API_ROUTES.RESEARCHER_DASHBOARDS.AVARAGE_TEST_BY_AGE_GROUP;

      const [summary, monthlyHistory, averageByAgeGroup] = await Promise.all([
        api.get<Summary>(endpointSummary, {
          query: { gender: normalizedGender },
        }),

        api.get<MonthlyHistoryItem[]>(endpointMonthly, {
          query: { gender: normalizedGender },
        }),

        api.get<PercentileEntry[]>(endpointAge, {
          query: { gender: normalizedGender },
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
