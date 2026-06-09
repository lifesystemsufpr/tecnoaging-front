import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { EducationUnit } from "../../types";
import { useQuery } from "@tanstack/react-query";

interface FetchEducationalUnitParams {
  id: string;
}

export function useFetchEducationalUnit({ id }: FetchEducationalUnitParams) {
  const api = useHttp();

  return useQuery({
    queryKey: ["educationUnit", id],
    queryFn: () => api.get<EducationUnit>(API_ROUTES.INSTITUTION_BY_ID(id)),
    staleTime: 10 * 60 * 1000,
  });
}
