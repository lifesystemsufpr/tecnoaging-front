import { API_ROUTES } from "@/core/config/api.routes";
import { ApiResponse } from "@/core/services/api.type";
import { clientService } from "@/core/services/client.service";
import { Researcher, ResearcherList } from "@/core/types";
import { AgeGroupAverage, DashboardResponse, MonthlyHistoryItem, Summary } from "../types";

interface FetchResearchersParams {
  pageSize?: number;
  page?: number;
  search?: string;
}

export const researcherService = {
  fetchResearchers: async ({
    pageSize,
    page,
    search,
  }: FetchResearchersParams): Promise<ApiResponse<ResearcherList>> => {
    try {
      const endpoint = API_ROUTES.RESEARCHERS;
      const url = new URL(endpoint);

      if (pageSize) {
        url.searchParams.append("pageSize", pageSize.toString());
      }

      if (page) {
        url.searchParams.append("page", page.toString());
      }

      if (search) {
        url.searchParams.append("search", search);
      }

      const resp: ApiResponse<ResearcherList> = await clientService({
        method: "GET",
        endpoint: url.toString(),
      });

      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchResearcherById: async (id: string): Promise<Researcher> => {
    try {
      const endpoint = API_ROUTES.RESEARCHER_BY_ID(id);
      const resp: Researcher = await clientService({
        method: "GET",
        endpoint,
      });

      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchDasbhoardData: async (): Promise<DashboardResponse> => {
    try {
      const endpointSummary = API_ROUTES.RESEARCHER_DASHBOARDS.SUMMARY;
      const endpointMonthly = API_ROUTES.RESEARCHER_DASHBOARDS.MONTHLY_HISTORY;
      const endpointAge = API_ROUTES.RESEARCHER_DASHBOARDS.AVARAGE_TEST_BY_AGE_GROUP;

      const [summary, monthlyHistory, averageByAgeGroup] = await Promise.all([
        clientService<Summary>({
          method: "GET",
          endpoint: endpointSummary,
        }),
        clientService<MonthlyHistoryItem[]>({
          method: "GET",
          endpoint: endpointMonthly,
        }),
        clientService<AgeGroupAverage[]>({
          method: "GET",
          endpoint: endpointAge,
        }),
      ]);

      return {
        summary,
        monthlyHistory,
        averageByAgeGroup,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
