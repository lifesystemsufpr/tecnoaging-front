"use client";

import { fetchPatientQuestionnaires } from "@/services/api-questionnaires";
import { PatientQuestionnaireList } from "@/types/domain/Questionnaire";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuestionnaireItem from "@/features/questionnaires/components/QuestionnaireItem";

export default function PatientQuestionnaires() {
  const params = useParams();
  const patientId = params.id as string;
  const router = useRouter();

  const [questionnaires, setQuestionnaires] =
    useState<PatientQuestionnaireList>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadQuestionnaires = async () => {
      setLoading(true);
      try {
        const resp = await fetchPatientQuestionnaires(patientId);
        setQuestionnaires(resp);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load patient questionnaires");
      } finally {
        setLoading(false);
      }
    };

    loadQuestionnaires();
  }, [patientId]);

  if (loading) {
    return <Box sx={{ p: 4 }}>Carregando questionários...</Box>;
  }

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
            onClick={() => router.push("/users/patients")}
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
      {questionnaires.length === 0 ? (
        <Typography variant="body1">
          Nenhum questionário encontrado para este paciente.
        </Typography>
      ) : (
        questionnaires.map((q) => <QuestionnaireItem key={q.id} item={q} />)
      )}
    </Box>
  );
}
