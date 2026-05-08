import { useQuery } from "@tanstack/react-query";
import { researcherService } from "../services/researcher.service";

export function useResearcherDashboard() {
    return useQuery({
        queryKey: ["researcherDashboard"],
        queryFn: researcherService.fetchDasbhoardData,
        staleTime: 5 * 60 * 1000,
        
    })
}