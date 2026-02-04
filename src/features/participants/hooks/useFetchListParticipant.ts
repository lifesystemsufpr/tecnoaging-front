import { participantService } from "../services/participant.service";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseFetchListParticipantsProps {
  pageSize?: number;
  search?: string;
  enabled?: boolean;
}

export function useFetchListParticipant({
  pageSize,
  search,
  enabled = true,
}: UseFetchListParticipantsProps) {
  return useInfiniteQuery({
    queryKey: ["participants", pageSize, search],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const { data, meta } = await participantService.fetchParticipants({
        pageSize,
        page: pageParam,
        search,
      });
      return {
        data,
        meta,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.lastPage) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    enabled: enabled,
  });
}
