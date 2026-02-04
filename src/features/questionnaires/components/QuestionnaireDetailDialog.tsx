"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { PatientQuestionnaire } from "../types/domain";
import { getBadgeStyles, getSeverityColor } from "../utils/color";
import { useFetchQuestionnaire } from "../hooks/useFetchQuestionnaire";

interface QuestionnaireDetailDialogProps {
  open: boolean;
  questionnaire?: PatientQuestionnaire | null;
  questionnaireId?: string | null;
  onClose: () => void;
}

export default function QuestionnaireDetailDialog({
  open,
  questionnaire,
  questionnaireId,
  onClose,
}: QuestionnaireDetailDialogProps) {
  const shouldFetch = open && !questionnaire && !!questionnaireId;

  const { data: fetchedQuestionnaire, isLoading } = useFetchQuestionnaire({
    questionnaireId,
    enabled: shouldFetch,
  });

  const questionnaireData = questionnaire ?? fetchedQuestionnaire;

  if (!open) {
    return null;
  }

  if (isLoading && !questionnaireData) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", pr: 1 }}
        >
          <Typography variant="h6" fontWeight={700}>
            Carregando...
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" color="text.secondary">
            Por favor, aguarde enquanto carregamos os detalhes do questionário.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!questionnaireData) {
    return null;
  }

  const badgeStyle = getBadgeStyles(questionnaireData.classification);
  const borderColor = getSeverityColor(questionnaireData.classification);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {questionnaire && (
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", pr: 1 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {questionnaireData.questionnaire.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aplicado por {questionnaireData.healthProfessional.user.fullName}{" "}
              em {new Date(questionnaireData.date).toLocaleDateString()}
            </Typography>
          </Box>
          <IconButton aria-label="Fechar" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent dividers>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Chip
            label={questionnaireData.classification}
            sx={{
              ...badgeStyle,
              border: `1px solid ${badgeStyle.borderColor}`,
              fontWeight: 700,
            }}
          />
          <Typography variant="body1" fontWeight={700}>
            Pontuação total: {questionnaireData.totalScore}
          </Typography>
          <Box
            sx={{
              height: 12,
              width: 12,
              borderRadius: "50%",
              backgroundColor: borderColor,
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          />
        </Stack>

        <Box>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Respostas
          </Typography>
          <Divider />

          {questionnaireData.answers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" mt={2}>
              Nenhuma resposta registrada para este questionário.
            </Typography>
          ) : (
            questionnaireData.answers.map((answer) => {
              const answerLabel =
                answer.selectedOption?.label ??
                answer.valueText ??
                "Sem resposta";

              const score = answer.selectedOption?.score;

              return (
                <Box
                  key={answer.id}
                  sx={{ py: 2, borderBottom: "1px solid #eee" }}
                >
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    {answer.question.statement}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">
                      Resposta: {answerLabel}
                    </Typography>
                    {typeof score === "number" && (
                      <Chip
                        size="small"
                        label={`Pontuação ${score}`}
                        sx={{ fontWeight: 600, backgroundColor: "#f5f5f5" }}
                      />
                    )}
                  </Stack>
                </Box>
              );
            })
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
