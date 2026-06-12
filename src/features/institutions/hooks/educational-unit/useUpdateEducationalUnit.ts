import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { EducationUnit, EducationUnitRequest } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidationApiError } from "@/core/api";

interface UpdateEducationalUnitParams {
  id: string;
  data: EducationUnitRequest;
}

export function useUpdateEducationalUnit() {
  const api = useHttp();
  const queryClient = useQueryClient();
  const queryKey = ["educationUnits"];

  return useMutation<
    EducationUnit,
    ValidationApiError,
    UpdateEducationalUnitParams
  >({
    mutationFn: async ({ id, data }: UpdateEducationalUnitParams) => {
      const response = await api.patch<EducationUnit>(
        API_ROUTES.INSTITUTION_BY_ID(id),
        {
          ...data,
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
