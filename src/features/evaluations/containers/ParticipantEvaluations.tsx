"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { GenericTable } from "@/core/components/layout";
import { ParticipantFilters } from "../components/ParticipantFilters";
import { participantColumns } from "../utils/columns";
import { EvaluationRaw } from "../types/Evaluation.types";
import { useParticipantEvaluations } from "../hooks/useParticipantEvaluations";
import ROUTES from "@/core/config/client.routes";

export default function ParticipantEvaluations({
  participantId,
  withHeader = true,
}: {
  participantId: string;
  withHeader?: boolean;
}) {
  const router = useRouter();

  const {
    patientData,
    evaluations,
    isLoading,
    totalRows,
    pagination,
    setPagination,
    handleSearch,
  } = useParticipantEvaluations(participantId);

  const handleOnViewEvaluation = (evaluation: EvaluationRaw) => {
    const routes: Record<string, string> = {
      FTSTS: ROUTES.EVALUATIONS.FTSTS_BY_ID(evaluation.id),
      TTSTS: ROUTES.EVALUATIONS.TTSTS_BY_ID(evaluation.id),
    };

    const path = routes[evaluation.type];
    if (path) router.push(path);
  };

  return (
    <Box padding={2}>
      {withHeader && (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              onClick={() => router.back()}
              startIcon={<ArrowBackIcon />}
              size="small"
              variant="text"
            >
              Voltar
            </Button>
          </Box>

          <Typography variant="body1" component="h1" gutterBottom>
            Avaliações do Paciente: {patientData?.fullName || "Carregando..."}
          </Typography>
        </>
      )}

      <Box my={2}>
        <ParticipantFilters
          onSearch={({ dateFrom, dateTo }) => handleSearch(dateFrom, dateTo)}
        />
      </Box>

      <Box my={1}>
        {evaluations.length === 0 && !isLoading ? (
          <Typography color="textSecondary">
            Nenhuma avaliação encontrada.
          </Typography>
        ) : (
          <GenericTable<EvaluationRaw>
            columns={participantColumns}
            rows={evaluations}
            loading={isLoading}
            showActions
            onView={handleOnViewEvaluation}
            pageSize={pagination.pageSize}
            setPaginationModel={setPagination}
            totalRows={totalRows}
            autoHeight
          />
        )}
      </Box>
    </Box>
  );
}
