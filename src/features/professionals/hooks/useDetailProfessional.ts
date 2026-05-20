import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/services/Routes";
import { HealthProfessional } from "@/core/types";

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
