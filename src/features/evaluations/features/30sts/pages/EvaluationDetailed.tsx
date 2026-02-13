"use client";

import { Box, Button, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import EvaluationSkeleton from "@/components/evaluations/EvaluationSkeleton";
import EvaluationDetail from "@/features/evaluations/components/EvaluationDetail";
import Indicators from "../containers/Indicators";
import {
  ThirtySTSProvider,
  useThirtySTSContext,
} from "../context/30STSContext";
import DetailCharts from "../containers/DetailCharts";

interface EvaluationDetailedPageProps {
  id: string;
}

export function EvaluationDetailed() {
  const {
    evaluationData,
    detailedData,
    isEvaluationLoading,
    isDetailedLoading,
  } = useThirtySTSContext();

  if (isEvaluationLoading || isDetailedLoading) return <EvaluationSkeleton />;
  if (!evaluationData || !detailedData)
    return <Container sx={{ py: 2 }}>Avaliação não encontrada.</Container>;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          size="small"
          variant="text"
        >
          Voltar para Avaliações
        </Button>
      </Box>

      {/* Informações da Avaliação */}
      <EvaluationDetail evaluationDetails={evaluationData} />

      {detailedData.derived.indicators.length > 0 && (
        <Indicators indicators={detailedData.derived.indicators} />
      )}

      {/* Gráficos */}
      <DetailCharts />
    </Box>
  );
}

export function EvaluationDetailedPage({ id }: EvaluationDetailedPageProps) {
  return (
    <ThirtySTSProvider id={id}>
      <EvaluationDetailed />
    </ThirtySTSProvider>
  );
}
