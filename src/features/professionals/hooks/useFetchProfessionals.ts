import { useInfiniteQuery } from "@tanstack/react-query";
import { professionalService } from "../services/professional.service";

interface UseFetchProfessionalsProps {
  pageSize?: number;
  search?: string;
}

export default function useFetchProfessionals({
  pageSize,
  search,
}: UseFetchProfessionalsProps) {
  return useInfiniteQuery({
    queryKey: ["professionals", pageSize, search],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return professionalService.fetchProfessionals({
        pageSize,
        page: pageParam,
        search,
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
