import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/services/Routes";
import { HealthUnit } from "../../types";
import { useQuery } from "@tanstack/react-query";

interface FetchHealthUnitParams {
  id: string;
}

export function useFetchHealthUnit({ id }: FetchHealthUnitParams) {
  const api = useHttp();

  return useQuery({
    queryKey: ["healthUnit", id],
    queryFn: () => {
      return api.get<HealthUnit>(API_ROUTES.HEALTH_UNIT_BY_ID(id));
    },
    staleTime: 10 * 60 * 1000,
  });
}
