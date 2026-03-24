import { useQuery } from "@tanstack/react-query";
import { professionalService } from "../services/professional.service";

export function useDetailProfessional({ professionalId }) {
  return useQuery({
    queryKey: ["professional", professionalId],
    queryFn: () => professionalService.fetchProfessionalById(professionalId),
  });
}
