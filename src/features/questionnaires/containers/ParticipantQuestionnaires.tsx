"use client";

import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuestionnaireItem from "@/features/questionnaires/components/QuestionnaireItem";
import QuestionnaireDetailDialog from "@/features/questionnaires/components/QuestionnaireDetailDialog";
import { useQuestionnaires } from "../contexts/QuestionnairesContext";
import ROUTES from "@/core/config/routes";

export default function ParticipantQuestionnairesContent() {
  const router = useRouter();
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component="button"
            onClick={() => router.push(ROUTES.USERS.PARTICIPANTS.MAIN)}
            underline="hover"
            color="inherit"
          >
            Pacientes
          </Link>
          <Typography color="text.primary">
            Questionários do Paciente
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
            Voltar
          </Button>
        </Stack>
      </Stack>
      {loading ? (
        <Typography variant="body1" sx={{ p: 2 }}>
          Carregando questionários...
        </Typography>
      ) : isEmpty ? (
        <Typography variant="body1">
          Nenhum questionário encontrado para este paciente.
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
