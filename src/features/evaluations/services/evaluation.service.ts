import { clientService } from "@/core/services/client.service";
import { API_ROUTES } from "@/core/config/api.routes";
import { ApiResponse } from "@/core/services/api.type";
import {
  Evaluation,
  EvaluationFilters,
  MotionAnalysisResponse as EvaluationDetailedResponse,
  RepetitionHistory,
} from "../types/Evaluation.types";
import { buildQueryString } from "@/core/utils/api";

export const evaluationService = {
  async list(filters?: EvaluationFilters): Promise<ApiResponse<Evaluation[]>> {
    const query = buildQueryString({
      participantCpf: filters?.patientCpf,
      participantName: filters?.patientName,
      healthProfessionalName: filters?.healthProfessionalName,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      type: filters?.type,
      page: filters?.page,
      pageSize: filters?.pageSize,
    });

    return clientService<ApiResponse<Evaluation[]>>({
      endpoint: `${API_ROUTES.EVALUATIONS}${query}`,
      method: "GET",
    });
  },

  async getById(id: string): Promise<Evaluation> {
    return clientService<Evaluation>({
      endpoint: API_ROUTES.EVALUATION_BY_ID(id),
      method: "GET",
    });
  },

  async getDetailed(id: string): Promise<EvaluationDetailedResponse> {
    return clientService<EvaluationDetailedResponse>({
      endpoint: API_ROUTES.EVALUATION_DETAILED_BY_ID(id),
      method: "GET",
    });
  },

  async delete(id: string): Promise<void> {
    return clientService<void>({
      endpoint: API_ROUTES.EVALUATION_BY_ID(id),
      method: "DELETE",
    });
  },

  async getRepetitionsHistory(id: string): Promise<RepetitionHistory[]> {
    return clientService<RepetitionHistory[]>({
      endpoint: API_ROUTES.EVALUATION_REPETITIONS_HISTORY(id),
      method: "GET",
    });
  },
};
