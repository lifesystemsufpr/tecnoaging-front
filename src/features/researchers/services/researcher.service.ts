import { API_ROUTES } from "@/core/config/api.routes";
import { ApiResponse } from "@/core/services/api.type";
import { clientService } from "@/core/services/client.service";
import { Researcher, ResearcherList } from "@/core/types";
import {
  AgeGroupAverage,
  DashboardResponse,
  MonthlyHistoryItem,
  Summary,
  ResearcherCreateRequest,
} from "../types";
import {
  FilterState,
  SortDirection,
} from "@/core/components/ui/table/header/TableColumn";
import { http } from "@/core/services/http.service";
import { useSession } from "next-auth/react";

export interface FetchResearchersParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: SortDirection;
  filters?: FilterState;
}

export const researcherService = {
  fetchResearchers: async ({
    pageSize,
    page,
    sortField,
    sortDirection,
    filters,
  }: FetchResearchersParams): Promise<ApiResponse<ResearcherList>> => {
    try {
      const endpoint = API_ROUTES.RESEARCHERS;
      const resp = await http.get<ApiResponse<ResearcherList>>(endpoint, {
        query: {
          page,
          pageSize,
          sortField,
          sortDirection,
          ...filters,
        },
      });

      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchResearcherById: async (id: string): Promise<Researcher> => {
    try {
      const endpoint = API_ROUTES.RESEARCHER_BY_ID(id);
      const resp: Researcher = await http.get<Researcher>(endpoint);

      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchDasbhoardData: async (): Promise<DashboardResponse> => {
    try {
      const endpointSummary = API_ROUTES.RESEARCHER_DASHBOARDS.SUMMARY;
      const endpointMonthly = API_ROUTES.RESEARCHER_DASHBOARDS.MONTHLY_HISTORY;
      const endpointAge =
        API_ROUTES.RESEARCHER_DASHBOARDS.AVARAGE_TEST_BY_AGE_GROUP;

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
  },

  createResearcher: async (data: ResearcherCreateRequest): Promise<void> => {
    try {
      const endpoint = API_ROUTES.RESEARCHERS;
      await clientService({
        method: "POST",
        endpoint,
        options: {
          body: JSON.stringify(data),
        },
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },

  updateResearcher: async (
    id: string,
    data: Partial<ResearcherCreateRequest>
  ): Promise<void> => {
    try {
      const endpoint = API_ROUTES.RESEARCHER_BY_ID(id);
      await clientService({
        method: "PATCH",
        endpoint,
        options: {
          body: JSON.stringify(data),
        },
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
