import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { useQuery } from "@tanstack/react-query";
import { PopulationDashboardResponse } from "../type";

interface UseFetchParticipantsDashboard {
  startDate?: string;
  endDate?: string;
}

export function useFetchParticipantsDashboard({
  startDate,
  endDate,
}: UseFetchParticipantsDashboard) {
  const api = useHttp();

  return useQuery({
    queryKey: ["participants-dashboard", startDate, endDate],
    queryFn: () =>
      api.get<PopulationDashboardResponse>(
        API_ROUTES.RESEARCHER_DASHBOARDS.POPULATION,
        {
          query: {
            startDate,
            endDate,
          },
        }
      ),
    retry: 0,
    staleTime: 15 * 60 * 1000,
  });
}
