"use client";

import { dashboard } from "../mocks/dashboard";
import ResearcherKPIs from "../components/ResearcherKPIs";
import ResearcherCharts from "../components/ResearcherCharts";
import { Box } from "@/core/components/ui";

interface ParticipantsDashboardTabProps {
  startDate?: string;
  endDate?: string;
}

export function ParticipantsDashboardTab({ startDate, endDate }: ParticipantsDashboardTabProps) {
  const { kpis, charts } = dashboard.data;

  // Em produção, usaríamos os parâmetros startDate e endDate no hook correspondente:
  // const { data } = useFetchParticipantsDashboard({ startDate, endDate });

  return (
    <Box display="flex" direction="column" gap={24}>
      <ResearcherKPIs data={kpis} />
      <ResearcherCharts data={charts} />
    </Box>
  );
}
