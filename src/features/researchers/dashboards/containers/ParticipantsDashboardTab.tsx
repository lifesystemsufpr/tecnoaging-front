"use client";

import ResearcherKPIs from "../components/ResearcherKPIs";
import ResearcherCharts from "../components/ResearcherCharts";
import { TabSkeleton } from "../components/TabSkeleton";
import { Box } from "@/core/components/ui";
import { useFetchParticipantsDashboard } from "../hooks/useFetchParticipantsDashboard";

interface ParticipantsDashboardTabProps {
  startDate?: string;
  endDate?: string;
}

export function ParticipantsDashboardTab({
  startDate,
  endDate,
}: ParticipantsDashboardTabProps) {
  const { data, isLoading, isError } = useFetchParticipantsDashboard({
    endDate,
    startDate,
  });

  if (isLoading || !data) {
    return <TabSkeleton />;
  }

  if (isError) {
    return <Box>Error</Box>;
  }

  return (
    <Box display="flex" direction="column" gap={24}>
      <ResearcherKPIs data={data.kpis} />
      <ResearcherCharts data={data.charts} />
    </Box>
  );
}
