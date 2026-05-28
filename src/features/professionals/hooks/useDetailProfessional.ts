import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { HealthProfessional } from "@/core/types";
import { API_ROUTES } from "@/core/config/api.routes";

export function useDetailProfessional({
  professionalId,
}: {
  professionalId: string;
}) {
  const api = useHttp();

  return useQuery({
    queryKey: ["professional", professionalId],
    queryFn: () =>
      api.get<HealthProfessional>(
        API_ROUTES.HEALTH_PROFESSIONAL_BY_ID(professionalId)
      ),
  });
}
