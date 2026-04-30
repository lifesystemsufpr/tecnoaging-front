"use client";

import { Box } from "@mui/material";
import DashboardMode from "../components/dashboard/DashboardMode";
import DashboardMonthly from "../components/dashboard/DashboardMonthly";
import { useResearcherDashboard } from "../hooks/useResearcherDashboard";
import DashboardSummary from "../components/dashboard/DashboardSummary";

export default function ResearcherDashboard() {
  const { data, isLoading: loading } = useResearcherDashboard();

  return (
    <Box>
      <h1>Painel do Pesquisador</h1>
      <DashboardMode />
      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <DashboardSummary data={data?.summary} />
          <DashboardMonthly data={data?.monthlyHistory} />
        </>
      )}
    </Box>
  );
}
