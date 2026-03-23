import { useQuery } from "@tanstack/react-query";
import { researcherService } from "../services/researcher.service";

interface UseDetailResearcherProps {
  researcherId: string;
}

export function useDetailResearcher({
  researcherId,
}: UseDetailResearcherProps) {
  return useQuery({
    queryKey: ["researcher", researcherId],
    queryFn: () => researcherService.fetchResearcherById(researcherId),
  });
}
