"use client";

import { Box } from "@mui/material";
import DashboardMode from "../components/dashboard/DashboardMode";
import DashboardMonthly from "../components/dashboard/DashboardMonthly";
import { useResearcherDashboard } from "../hooks/useResearcherDashboard";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import BarScatterPlot from "../components/dashboard/BarScatterPlot";
import { ResearcherDashboardProvider } from "../contexts/ResearcherDashboardContext";

export default function ResearcherDashboard() {
  const { data, isLoading: loading } = useResearcherDashboard();

  return (
    <ResearcherDashboardProvider>
      <Box>
        <h1>Painel do Pesquisador</h1>
        <DashboardMode />
        {loading ? (
          <p>Loading dashboard data...</p>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <DashboardSummary data={data?.summary} />
            <DashboardMonthly data={data?.monthlyHistory} />
            <BarScatterPlot labelColor="black" />
          </Box>
        )}
      </Box>
    </ResearcherDashboardProvider>
  );
}
