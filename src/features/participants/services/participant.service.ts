import { API_ROUTES } from "@/core/config/api.routes";
import { clientService } from "@/core/services/client.service";
import { Participant } from "@/core/types";

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
};
