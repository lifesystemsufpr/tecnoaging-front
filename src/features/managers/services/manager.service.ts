import { API_ROUTES } from "@/core/config/api.routes";
import { clientService } from "@/core/services/client.service";
import { ManagerProfile } from "../types";

export const managerService = {
  fetchManagerById: async (id: string) => {
    try {
      const endpoint = API_ROUTES.MANAGER_BY_ID(id);
      const resp: ManagerProfile = await clientService({
        method: "GET",
        endpoint,
      });
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
