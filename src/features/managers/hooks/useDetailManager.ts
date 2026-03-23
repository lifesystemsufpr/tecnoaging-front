import { useQuery } from "@tanstack/react-query";
import { managerService } from "../services/manager.service";

interface UseDetailManagerParams {
  managerId: string;
}

export function useDetailManager({ managerId }: UseDetailManagerParams) {
  return useQuery({
    queryKey: ["manager", managerId],
    queryFn: () => managerService.fetchManagerById(managerId),
  });
}
