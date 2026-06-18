"use client";

import { Box } from "@/core/components/ui";
import { dasboardEvaluation } from "../mocks/dashboard";
import { EvaluationsByInstitutionTable } from "../components/EvaluationsByInstitutionTable";
import { TemporalEvolutionChart } from "../components/TemporalEvolutionChart";
import { EvaluationsByTestTypeChart } from "../components/EvaluationsByTestTypeChart";
import { EvaluationKPIs } from "../components/EvaluationKPIs";

interface EvaluationsDashboardTabProps {
  startDate?: string;
  endDate?: string;
}

export function EvaluationsDashboardTab({ startDate, endDate }: EvaluationsDashboardTabProps) {
  const { kpis, charts } = dasboardEvaluation.data;

  // Em produção, usaríamos os parâmetros startDate e endDate no hook correspondente:
  // const { data } = useFetchEvaluationDashboard({ startDate, endDate });

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
