import { useCallback } from "react";
import { ApiError } from "@/core/services/client.service";
import {
  DashboardSeries,
  EvaluationTypeAverage,
  PatientDashboardData,
} from "../types/patient-dashboard.types";
import { useFetchParticipantAverageDuration } from "./useFetchParticipantAverageDuration";
import { useFetchParticipantEvaluationCount } from "./useFetchParticipantEvaluationCount";
import { useFetchParticipantMonthlyAverage } from "./useFetchParticipantMonthlyAverage";
import { useFetchParticipantMonthlyEvaluations } from "./useFetchParticipantMonthlyEvaluations";
import { useFetchParticipantMostPerformedTests } from "./useFetchParticipantMostPerformedTests";

const INITIAL_DATA: PatientDashboardData = {
  totalEvaluations: 0,
  monthlyEvaluations: Array(12).fill(0),
  averageDuration: "0.0s",
  evaluationVariation: 0,
  mostPerformedTests: [],
  recentSeries: { subtitle: "", series: [] },
};

const toNumber = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function buildMonthlySeries(
  valuesByType: EvaluationTypeAverage[],
  month: number,
  subtitle?: string
): DashboardSeries {
  const monthIndex = Math.min(11, Math.max(0, month - 1));

  return {
    subtitle: subtitle ?? "",
    series: valuesByType.map(({ fullName, type, averageDuration }) => {
      const monthlyData = Array(12).fill(0);
      monthlyData[monthIndex] = toNumber(averageDuration);

      return {
        name: fullName || type,
        data: monthlyData,
      };
    }),
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro ao buscar dados do dashboard do participante";
}

export function usePatientDashboard(participantCpf?: string) {
  const enabled = Boolean(participantCpf);

  const evaluationCountQuery = useFetchParticipantEvaluationCount({
    participantCpf,
    enabled,
  });

  const averageDurationQuery = useFetchParticipantAverageDuration({
    participantCpf,
    enabled,
  });

  const monthlyEvaluationsQuery = useFetchParticipantMonthlyEvaluations({
    participantCpf,
    enabled,
  });

  const mostPerformedTestsQuery = useFetchParticipantMostPerformedTests({
    participantCpf,
    enabled,
  });

  const monthlyAverageQuery = useFetchParticipantMonthlyAverage({
    participantCpf,
    enabled,
  });

  const monthlyEvaluations = Array(12).fill(0);
  monthlyEvaluationsQuery.data?.monthlyData?.forEach(
    ({ monthNumber, count }) => {
      const monthIndex = Math.min(11, Math.max(0, monthNumber - 1));
      monthlyEvaluations[monthIndex] = count;
    }
  );

  const mostPerformedTests = mostPerformedTestsQuery.data?.tests ?? [];

  const currentMonth =
    monthlyAverageQuery.data?.month ?? new Date().getMonth() + 1;

  const recentSeries = buildMonthlySeries(
    monthlyAverageQuery.data?.evaluationTypes ?? [],
    currentMonth,
    monthlyAverageQuery.data?.subtitle
  );

  const data: PatientDashboardData = enabled
    ? {
        totalEvaluations: evaluationCountQuery.data?.totalEvaluations ?? 0,
        monthlyEvaluations,
        averageDuration:
          averageDurationQuery.data?.averageDuration?.display ??
          INITIAL_DATA.averageDuration,
        evaluationVariation:
          evaluationCountQuery.data?.monthlyChange?.percentage ?? 0,
        mostPerformedTests,
        recentSeries,
      }
    : INITIAL_DATA;

  const isLoading =
    evaluationCountQuery.isLoading ||
    averageDurationQuery.isLoading ||
    monthlyEvaluationsQuery.isLoading ||
    mostPerformedTestsQuery.isLoading ||
    monthlyAverageQuery.isLoading;

  const firstError =
    evaluationCountQuery.error ??
    averageDurationQuery.error ??
    monthlyEvaluationsQuery.error ??
    mostPerformedTestsQuery.error ??
    monthlyAverageQuery.error;

  const error = firstError ? getErrorMessage(firstError) : null;

  const reload = useCallback(async () => {
    await Promise.all([
      evaluationCountQuery.refetch(),
      averageDurationQuery.refetch(),
      monthlyEvaluationsQuery.refetch(),
      mostPerformedTestsQuery.refetch(),
      monthlyAverageQuery.refetch(),
    ]);
  }, [
    evaluationCountQuery,
    averageDurationQuery,
    monthlyEvaluationsQuery,
    mostPerformedTestsQuery,
    monthlyAverageQuery,
  ]);

  return { data, isLoading, error, reload };
}
