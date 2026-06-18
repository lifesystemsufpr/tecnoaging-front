"use client";

import { Box, Typography } from "@/core/components/ui";
import { TabSkeleton } from "../components/TabSkeleton";
import { useFetchEvaluationDashboard } from "../hooks/useFetchEvaluationDashboard";
import { EvaluationsByInstitutionTable } from "../components/EvaluationsByInstitutionTable";
import { TemporalEvolutionChart } from "../components/TemporalEvolutionChart";
import { EvaluationsByTestTypeChart } from "../components/EvaluationsByTestTypeChart";
import { EvaluationKPIs } from "../components/EvaluationKPIs";

interface EvaluationsDashboardTabProps {
  startDate?: string;
  endDate?: string;
}

export function EvaluationsDashboardTab({ startDate, endDate }: EvaluationsDashboardTabProps) {
  const { data, isLoading, isError } = useFetchEvaluationDashboard();

  if (isLoading || !data) {
    return <TabSkeleton />;
  }

  if (isError) {
    return <Box>
      <Typography>
        Erro ao carregar dados do painel.</Typography></Box>;
  }

  const { kpis, charts } = data;

  return (
    <Box display="flex" direction="column" gap={24}>
      <EvaluationKPIs data={kpis} />

      <Box className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <EvaluationsByTestTypeChart data={charts.evaluationsByTestType} />
        <TemporalEvolutionChart data={charts.temporalEvolution} />
        <EvaluationsByInstitutionTable
          data={charts.evaluationsByInstitution}
        />
      </Box>
    </Box>
  );
}
