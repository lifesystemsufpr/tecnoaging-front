"use client";

import { useSession } from "next-auth/react";
import { Box, Grid } from "@/core/components/ui";
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
      <Box
        className="flex items-center justify-center"
        style={{ minHeight: 320 }}
      >
        <svg
          className="animate-spin h-6 w-6 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </Box>
    );
  }

  if (error) {
    return (
      <div role="alert" className="bg-red-50 text-red-700 p-3 rounded">
        {String(error)}
      </div>
    );
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

      <Grid container spacing={8} className="mt-2">
        <Grid item xs={12} lg={6}>
          <PatientTestIndicators tests={data.mostPerformedTests} />
        </Grid>

        <Grid item xs={12} lg={6}>
          <PatientRecentEvaluationChart data={data.recentSeries} />
        </Grid>
      </Grid>
    </Box>
  );
}
