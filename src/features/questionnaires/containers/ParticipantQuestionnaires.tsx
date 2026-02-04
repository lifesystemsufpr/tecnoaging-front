"use client";

import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { toast } from "sonner";
import QuestionnaireItem from "@/features/questionnaires/components/QuestionnaireItem";
import QuestionnaireDetailDialog from "@/features/questionnaires/components/QuestionnaireDetailDialog";
import { useQuestionnaires } from "../contexts/QuestionnairesContext";
import QuestionnaireHeader from "../components/QuestionnaireHeader";

export default function ParticipantQuestionnaires({ withHeader = true }) {
  const {
    questionnaires,
    loading,
    isEmpty,
    error,
    selectedQuestionnaire,
    openQuestionnaire,
    closeQuestionnaire,
  } = useQuestionnaires();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Box sx={{ p: 2 }}>
      {withHeader && <QuestionnaireHeader />}
      {loading ? (
        <Typography variant="body1" sx={{ p: 2 }}>
          Carregando questionários...
        </Typography>
      ) : isEmpty ? (
        <Typography variant="body1">
          Nenhum questionário encontrado para este participante.
        </Typography>
      ) : (
        questionnaires.map((q) => (
          <QuestionnaireItem key={q.id} item={q} onClick={openQuestionnaire} />
        ))
      )}

      <QuestionnaireDetailDialog
        open={Boolean(selectedQuestionnaire)}
        questionnaire={selectedQuestionnaire}
        onClose={closeQuestionnaire}
      />
    </Box>
  );
}
