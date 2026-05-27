import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { EducationUnitRequest } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateEducationalUnitParams {
  id: string;
  data: EducationUnitRequest;
}

export function useUpdateEducationalUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["educationUnits"];

  return useMutation({
    mutationFn: async ({ id, data }: UpdateEducationalUnitParams) => {
      await api.patch(API_ROUTES.INSTITUTION_BY_ID(id), { ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
