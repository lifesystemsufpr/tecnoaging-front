import { API_ROUTES } from "@/core/config/api.routes";
import { ApiResponse } from "@/core/services/api.type";
import { clientService } from "@/core/services/client.service";
import { HealthProfessional, HealthProfessionalList } from "@/core/types";
import { DashboardStats } from "../types";

interface FetchProfessionalsParams {
  pageSize?: number;
  page?: number;
  search?: string;
}

export const professionalService = {
  fetchProfessionals: async ({
    pageSize,
    page,
    search,
  }: FetchProfessionalsParams): Promise<
    ApiResponse<HealthProfessionalList>
  > => {
    try {
      const endpoint = API_ROUTES.HEALTH_PROFESSIONALS;
      const url = new URL(endpoint);
      if (pageSize) {
        url.searchParams.append("pageSize", pageSize.toString());
      }
      if (page) {
        url.searchParams.append("page", page.toString());
      }
      if (search) {
        url.searchParams.append("fullName", search);
      }
      const resp: ApiResponse<HealthProfessionalList> = await clientService({
        method: "GET",
        endpoint: url.toString(),
      });
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchProfessionalById: async (id: string) => {
    try {
      const endpoint = `${API_ROUTES.HEALTH_PROFESSIONALS}/${id}`;
      const resp: HealthProfessional = await clientService({
        method: "GET",
        endpoint,
      });
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchDashboardStats: async () => {
    try {
      const endpoint = API_ROUTES.HEALTH_PROFESSIONAL_DASHBOARD_STATS();
      const resp: DashboardStats = await clientService({
        method: "GET",
        endpoint,
      });
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
