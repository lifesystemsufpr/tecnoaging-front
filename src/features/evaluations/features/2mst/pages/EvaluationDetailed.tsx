"use client";

import { Box, Button, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import EvaluationDetail from "@/features/evaluations/components/EvaluationDetail";
import Indicators from "../containers/Indicators";
import { TwoMSTProvider, useTwoMSTContext } from "../context/2MSTContext";
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
  } = useTwoMSTContext();

  if (isEvaluationLoading || isDetailedLoading)
    return <Container sx={{ py: 2 }}>Carregando avaliação...</Container>;
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
    <TwoMSTProvider id={id}>
      <EvaluationDetailed />
    </TwoMSTProvider>
  );
}
