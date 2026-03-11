"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { GenericTable } from "@/core/components/layout";
import { ParticipantFilters } from "../components/ParticipantFilters";
import { participantColumns } from "../utils/columns";
import { EvaluationRaw } from "../types/Evaluation.types";
import { useParticipantEvaluations } from "../hooks/useParticipantEvaluations";
import ROUTES from "@/core/config/client.routes";
import { useFetchHistoryRepetitions } from "../features/30sts/hooks/useFetchHistoryRepetitions";
import GenericChart from "@/core/components/layout/GenericChart";
import TestTypeCard from "../components/TestTypeCard";
import { useState } from "react";
import { TEST_TYPES } from "../consts/types";

export default function ParticipantEvaluations({
  participantId,
  withHeader = true,
}: {
  participantId: string;
  withHeader?: boolean;
}) {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<string>("TTSTS");

  const {
    patientData,
    evaluations,
    isLoading,
    totalRows,
    pagination,
    setPagination,
    handleSearch,
  } = useParticipantEvaluations(participantId);
  const { data: historyRepetitions } = useFetchHistoryRepetitions({
    patientId: participantId || "",
  });

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

      {/* Cards de tipos de teste */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1.5, fontWeight: 600, opacity: 0.7, letterSpacing: 0.5 }}
        >
          TESTES DISPONÍVEIS
        </Typography>
        <Grid container spacing={2}>
          {TEST_TYPES.map((test) => (
            <Grid size={{ xs: 6, sm: 3 }} key={test.id}>
              <TestTypeCard
                config={test}
                selected={selectedTest === test.id}
                onClick={() => setSelectedTest(test.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {!historyRepetitions && <p>Erro ao carregar histórico de repetições</p>}

      {historyRepetitions && historyRepetitions.length > 0 && (
        <GenericChart
          data={historyRepetitions}
          xKey="day"
          yKey="repetitions"
          title={`Histórico de Repetições do Paciente`}
          valueFormatter={(v) => `${v} reps`}
          seriesType="line"
        />
      )}

      {evaluations.length !== 0 && !isLoading && (
        <Box my={2}>
          <ParticipantFilters
            onSearch={({ dateFrom, dateTo }) => handleSearch(dateFrom, dateTo)}
          />
        </Box>
      )}

      <Box my={1}>
        {evaluations.length === 0 && !isLoading ? (
          <Typography>Nenhuma avaliação encontrada.</Typography>
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
