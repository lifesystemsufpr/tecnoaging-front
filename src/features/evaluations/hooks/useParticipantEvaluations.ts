import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchPatientById } from "@/services/api-patient";
import { evaluationService } from "../services/evaluation.service";
import { EvaluationRaw } from "../types/Evaluation.types";
import { Patient } from "@/types/domain/Patient";

export function useParticipantEvaluations(participantId: string) {
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluationRaw[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [pagination, setPagination] = useState({
    pageSize: 20,
    page: 0,
  });

  const loadData = useCallback(async () => {
    if (!participantId) return;

    try {
      setIsLoading(true);

      const patient = await fetchPatientById({ id: participantId });
      setPatientData(patient);

      const response = await evaluationService.list({
        patientCpf: patient.cpf,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
      });

      setEvaluations(response.data);
      setTotalRows(response.meta.total || 0);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar informações do paciente e avaliações.");
    } finally {
      setIsLoading(false);
    }
  }, [participantId, filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (dateFrom: string | null, dateTo: string | null) => {
    setFilters({ startDate: dateFrom || "", endDate: dateTo || "" });
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  return {
    patientData,
    evaluations,
    isLoading,
    totalRows,
    pagination,
    setPagination,
    handleSearch,
    refresh: loadData,
  };
}
