import { useInfiniteQuery } from "@tanstack/react-query";
import { professionalService } from "@/features/professionals/services/professional.service";

interface UseFetchQuestionnairesListProps {
  pageSize?: number;
  patientCpf?: string;
  healthProfessionalCpf?: string;
}

export default function useFetchQuestionnairesList({
  pageSize = 20,
  patientCpf,
  healthProfessionalCpf,
}: UseFetchQuestionnairesListProps) {
  return useInfiniteQuery({
    queryKey: ["questionnaires", pageSize, patientCpf, healthProfessionalCpf],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return professionalService.fetchProfessionals({
        pageSize,
        page: pageParam,
        search: patientCpf,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.lastPage) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
