"use client";

import { Box, Typography } from "@/core/components/ui";
import { TabSkeleton } from "../components/TabSkeleton";
import { useFetchEvaluationDashboard } from "../hooks/useFetchEvaluationDashboard";
import { EvaluationsByInstitutionTable } from "../components/EvaluationsByInstitutionTable";
import { TemporalEvolutionChart } from "../components/TemporalEvolutionChart";
import { EvaluationKPIs } from "../components/EvaluationKPIs";
import { EvaluationsByTypeTestChart } from "../components/EvaluationsByTypeTestChart";

interface EvaluationsDashboardTabProps {
  startDate?: string;
  endDate?: string;
}

export function EvaluationsDashboardTab({
  startDate,
  endDate,
}: EvaluationsDashboardTabProps) {
  const { data, isLoading, isError } = useFetchEvaluationDashboard({
    startDate,
    endDate,
  });

  if (isLoading || !data) {
    return <TabSkeleton />;
  }

  if (isError) {
    return (
      <Box>
        <Typography>Erro ao carregar dados do painel.</Typography>
      </Box>
    );
  }

  const { kpis, charts } = data;

  return (
    <Box display="flex" direction="column" gap={24}>
      <EvaluationKPIs data={kpis} />

      <Box className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <EvaluationsByTypeTestChart data={charts.evaluationsByTypeTest} />
        <TemporalEvolutionChart data={charts.temporalEvaluation} />
        <EvaluationsByInstitutionTable data={charts.evaluationsByInstitution} />
      </Box>
    </Box>
  );
}
