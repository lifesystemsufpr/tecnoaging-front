import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { useQuery } from "@tanstack/react-query";
import { PopulationDashboardResponse } from "../type";


export function useFetchParticipantsDashboard() {
    const api = useHttp()

    return useQuery({
        queryKey: ["participants-dashboard"],
        queryFn: () => api.get<PopulationDashboardResponse>(API_ROUTES.RESEARCHER_DASHBOARDS.POPULATION),
        retry: 0,
    })
}