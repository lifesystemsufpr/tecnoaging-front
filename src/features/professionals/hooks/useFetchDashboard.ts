import { useQuery } from "@tanstack/react-query";
import { professionalService } from "../services/professional.service";

export function useFetchDashboard() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: professionalService.fetchDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
}
