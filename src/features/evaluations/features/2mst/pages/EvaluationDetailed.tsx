"use client";

import { ArrowLeft } from "lucide-react";
import { Box, Button, Typography } from "@/core/components/ui";

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
    return <Box py={8}>Carregando avaliação...</Box>;
  if (!evaluationData || !detailedData)
    return <Box py={8}>Avaliação não encontrada.</Box>;

  return (
    <Box>
      <Box mb={8}>
        <Button
          onClick={() => window.history.back()}
          leftIcon={<ArrowLeft size={16} />}
          size="sm"
          variant="link"
        >
          Voltar para Avaliações
        </Button>
      </Box>

      {/* Informações da Avaliação */}
      <EvaluationDetail evaluationDetails={evaluationData} />

      {detailedData?.derived.indicators &&
        detailedData.derived.indicators.length > 0 && (
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
