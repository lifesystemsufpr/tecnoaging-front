"use client";

import DashboardMode from "../components/dashboard/DashboardMode";
import DashboardMonthly from "../components/dashboard/DashboardMonthly";
import { useResearcherDashboard } from "../hooks/useResearcherDashboard";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import BarScatterPlot from "../components/dashboard/BarScatterPlot";
import { Box, Typography } from "@/core/components/ui";
import { useResearcherDashboardContext } from "../contexts/ResearcherDashboardContext";

export function ResearcherDashboard() {
  const { genderMode } = useResearcherDashboardContext();
  const { data, isLoading: loading } = useResearcherDashboard(genderMode);

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Typography variant="h4" color="secondary">
          Painel do Pesquisador
        </Typography>
      </Box>
      <DashboardMode />
      {loading ? (
        <Typography variant="body">Loading dashboard data...</Typography>
      ) : (
        <Box display="flex" direction="column" gap={12}>
          <DashboardSummary data={data?.summary} />
          <DashboardMonthly data={data?.monthlyHistory} />
          <BarScatterPlot labelColor="black" />
        </Box>
      )}
    </Box>
  );
}
