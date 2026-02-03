import { Participant } from "@/core/types";
import { useCallback, useEffect, useState } from "react";
import { participantService } from "../services/participant.service";

export function useFetchParticipant({
  participantId,
}: {
  participantId: string;
}) {
  const [participantData, setParticipantData] = useState<Participant | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    participantService
      .fetchParticipantById(participantId)
      .then((data) => {
        setParticipantData(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar participante:", error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [participantId]);

  useEffect(() => {
    if (participantId) {
      fetch();
    }
  }, [participantId, fetch]);

  return { participantData, fetch, reload: fetch, isLoading, error };
}
