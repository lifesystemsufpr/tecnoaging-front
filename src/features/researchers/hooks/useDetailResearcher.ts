import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { Researcher } from "@/core/types";
import { API_ROUTES } from "@/core/config/api.routes";

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
