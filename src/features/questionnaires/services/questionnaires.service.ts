import { API_ROUTES } from "@/services/Routes";
import { clientService } from "@/core/services/client.service";
import { ApiResponse } from "@/core/services/api.type";
import { PatientQuestionnaire, QuestionnaireList } from "../types/domain";

interface FetchQuestionnairesParams {
  pageSize?: number;
  participantCpf?: string;
  healthProfessionalCpf?: string;
  page?: number;
}

export const questionnairesService = {
  fetchQuestionnaires: async ({
    pageSize,
    page,
    participantCpf,
    healthProfessionalCpf,
  }: FetchQuestionnairesParams): Promise<ApiResponse<QuestionnaireList>> => {
    try {
      const endpoint = API_ROUTES.QUESTIONNAIRES;
      const url = new URL(endpoint);
      if (pageSize) {
        url.searchParams.append("pageSize", pageSize.toString());
      }
      if (page) {
        url.searchParams.append("page", page.toString());
      }
      if (participantCpf) {
        url.searchParams.append("participantCpf", participantCpf);
      }
      if (healthProfessionalCpf) {
        url.searchParams.append("healthProfessionalCpf", healthProfessionalCpf);
      }
      const resp: ApiResponse<QuestionnaireList> = await clientService({
        method: "GET",
        endpoint: url.toString(),
      });
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  questionnaireById: async (questionnaireId: string) => {
    try {
      const endpoint = API_ROUTES.QUESTIONNAIRE_BY_ID(questionnaireId);
      const resp: PatientQuestionnaire = await clientService({
        method: "GET",
        endpoint,
      });
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
