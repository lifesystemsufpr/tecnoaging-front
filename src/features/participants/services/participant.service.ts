import { API_ROUTES } from "@/core/config/api.routes";
import { ApiResponse } from "@/core/services/api.type";
import { clientService } from "@/core/services/client.service";
import { Participant, ParticipantList } from "@/core/types";

export const participantService = {
  fetchParticipantById: async (participantId: string): Promise<Participant> => {
    try {
      const endpoint = API_ROUTES.PARTICIPANT_BY_ID(participantId);
      const resp: Participant = await clientService({
        method: "GET",
        endpoint,
      });

      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  fetchParticipants: async ({
    pageSize,
    page,
    search,
  }: {
    pageSize?: number;
    page?: number;
    search?: string;
  }): Promise<ApiResponse<ParticipantList>> => {
    try {
      const endpoint = API_ROUTES.PARTICIPANTS;
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

      const resp: ApiResponse<ParticipantList> = await clientService({
        method: "GET",
        endpoint: url.toString(),
      });
      return resp;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
