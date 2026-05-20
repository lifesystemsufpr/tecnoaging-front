import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/services/Routes";
import { Researcher } from "@/core/types";

interface UseDetailResearcherProps {
  researcherId: string;
}

export function useDetailResearcher({
  researcherId,
}: UseDetailResearcherProps) {
  const api = useHttp();

  return useQuery({
    queryKey: ["researcher", researcherId],
    queryFn: () =>
      api.get<Researcher>(API_ROUTES.RESEARCHER_BY_ID(researcherId)),
  });
}
