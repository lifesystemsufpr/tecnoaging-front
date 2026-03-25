import { useCallback } from "react";
import { ApiError } from "@/core/services/client.service";
import {
  DashboardSeries,
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
  tugCount: 0,
  fiveTstsCount: 0,
  recentSeries: { tug: Array(12).fill(0), fiveTsts: Array(12).fill(0) },
};

const normalizeTestType = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

function isTugTest(value: string): boolean {
  const normalized = normalizeTestType(value);
  return normalized.includes("TUG") || normalized.includes("TIMEDUPANDGO");
}

function isSitToStandTest(value: string): boolean {
  const normalized = normalizeTestType(value);

  return (
    normalized.includes("5TSTS") ||
    normalized.includes("FIVETIMESSITTOSTAND") ||
    normalized.includes("TTSTS") ||
    normalized.includes("THIRTYTIMESSITTOSTAND") ||
    normalized.includes("30STS")
  );
}

const toNumber = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function buildMonthlySeries(
  valuesByType: { type: string; value: string }[],
  month: number
): DashboardSeries {
  const monthIndex = Math.min(11, Math.max(0, month - 1));

  const tugAverage = valuesByType.find(
    ({ type }) => isTugTest(type)
  );

  const fiveTstsAverage = valuesByType.find(({ type }) => {
    return isSitToStandTest(type);
  });

  const tugSeries = Array(12).fill(0);
  tugSeries[monthIndex] = tugAverage ? toNumber(tugAverage.value) : 0;

  const fiveTstsSeries = Array(12).fill(0);
  fiveTstsSeries[monthIndex] = fiveTstsAverage
    ? toNumber(fiveTstsAverage.value)
    : 0;

  return {
    tug: tugSeries,
    fiveTsts: fiveTstsSeries,
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

  const tugCount =
    mostPerformedTestsQuery.data?.tests
      ?.filter(({ name, fullName }) => {
        return isTugTest(`${name} ${fullName}`);
      })
      .reduce((total, test) => total + test.count, 0) ?? 0;

  const fiveTstsCount =
    mostPerformedTestsQuery.data?.tests
      ?.filter(({ name, fullName }) => {
        return isSitToStandTest(`${name} ${fullName}`);
      })
      .reduce((total, test) => total + test.count, 0) ?? 0;

  const currentMonth =
    monthlyAverageQuery.data?.month ?? new Date().getMonth() + 1;

  const recentSeries = buildMonthlySeries(
    monthlyAverageQuery.data?.evaluationTypes?.map(
      ({ type, averageDuration }) => ({
        type,
        value: averageDuration,
      })
    ) ?? [],
    currentMonth
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
        tugCount,
        fiveTstsCount,
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
