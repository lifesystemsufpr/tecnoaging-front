import { useQuery } from "@tanstack/react-query";
import { questionnairesService } from "../services/questionnaires.service";

interface UseFetchQuestionnaireProps {
  questionnaireId: string;
  enabled?: boolean;
}

export function useFetchQuestionnaire({
  questionnaireId,
  enabled = true,
}: UseFetchQuestionnaireProps) {
  return useQuery({
    queryKey: ["questionnaire", questionnaireId],
    queryFn: async () => {
      const resp =
        await questionnairesService.questionnaireById(questionnaireId);
      return resp;
    },
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!questionnaireId,
  });
}
