import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { ManagerProfile } from "../types";

interface UseDetailManagerParams {
  managerId: string;
}

export function useDetailManager({ managerId }: UseDetailManagerParams) {
  const api = useHttp();

  return useQuery({
    queryKey: ["manager", managerId],
    queryFn: () => api.get<ManagerProfile>(API_ROUTES.MANAGER_BY_ID(managerId)),
  });
}
