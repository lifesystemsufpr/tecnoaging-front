"use client";

import { useSession } from "next-auth/react";
import { Alert, Box, CircularProgress, Grid, Stack } from "@mui/material";
import { usePatientDashboard } from "../hooks/usePatientDashboard";
import { PatientTopInfoCards } from "../components/PatientTopInfoCards";
import { PatientMonthlyChart } from "../components/PatientMonthlyChart";
import { PatientTestIndicators } from "../components/PatientTestIndicators";
import { PatientRecentEvaluationChart } from "../components/PatientRecentEvaluationChart";

export default function PatientDashboardPage() {
  const { data: session } = useSession();
  const cpf = session?.user?.cpf as string | undefined;
  const { data, isLoading, error } = usePatientDashboard(cpf);

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: 320 }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <PatientTopInfoCards
        total={data.totalEvaluations}
        averageDuration={data.averageDuration}
        evaluationVariation={data.evaluationVariation}
      />

      <Box mt={2}>
        <PatientMonthlyChart data={data.monthlyEvaluations} />
      </Box>

      <Grid container spacing={2} mt={0.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PatientTestIndicators
            countTUG={data.tugCount}
            count5TSTS={data.fiveTstsCount}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <PatientRecentEvaluationChart data={data.recentSeries} />
        </Grid>
      </Grid>
    </Box>
  );
}
