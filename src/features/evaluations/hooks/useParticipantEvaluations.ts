import { useCallback, useState } from "react";
import { toast } from "sonner";
import { EvaluationRaw } from "../types/Evaluation.types";
import { Participant } from "@/core/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useHttp } from "@/core/hooks/useHttp";
import { API_ROUTES } from "@/core/config/api.routes";
import { ApiResponse } from "@/core/services/api.type";

export function useParticipantEvaluations(participantId: string) {
  const api = useHttp();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "TTSTS",
  });

  const [pagination, setPagination] = useState({
    pageSize: 5,
    page: 0,
  });

  const patientQuery = useQuery({
    queryKey: ["participant", participantId],
    queryFn: () =>
      api.get<Participant>(API_ROUTES.PARTICIPANT_BY_ID(participantId)),
    enabled: !!participantId,
    staleTime: 10 * 60 * 1000,
  });

  const evaluationsQuery = useQuery({
    queryKey: [
      "participant-evaluations",
      participantId,
      patientQuery.data?.cpf,
      filters,
      pagination.page,
      pagination.pageSize,
    ],
    queryFn: () =>
      api.get<ApiResponse<EvaluationRaw[]>>(API_ROUTES.EVALUATIONS, {
        query: {
          patientCpf: patientQuery.data?.cpf,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          type: filters.type || undefined,
          page: pagination.page + 1,
          pageSize: pagination.pageSize,
        },
      }),
    enabled: !!participantId && !!patientQuery.data?.cpf,
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const handleSearch = (dateFrom: string | null, dateTo: string | null) => {
    setFilters((prev) => ({
      ...prev,
      startDate: dateFrom || "",
      endDate: dateTo || "",
    }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleTypeChange = (type: string) => {
    setFilters((prev) => ({ ...prev, type }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const refresh = useCallback(() => {
    patientQuery.refetch();
    evaluationsQuery.refetch();
  }, [patientQuery, evaluationsQuery]);

  const evaluations = evaluationsQuery.data?.data ?? [];
  const totalRows = evaluationsQuery.data?.meta?.total ?? 0;
  const isLoading = patientQuery.isLoading || evaluationsQuery.isLoading;
  const patientData = (patientQuery.data ?? null) as Participant | null;

  return {
    patientData,
    evaluations,
    isLoading,
    totalRows,
    pagination,
    setPagination,
    handleSearch,
    handleTypeChange,
    refresh,
  };
}
