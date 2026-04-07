"use client";

import TotalEvaluations from "../components/TotalEvaluations";
import MonthlyEvaluationsChart from "../components/MonthlyEvaluationsChart";
import PerformanceEvaluations from "../components/PerfomanceEvaluations";
import { useFetchDashboard } from "../hooks/useFetchDashboard";

export default function ProfessionalDashboardPage() {
  const { data, isLoading: loading } = useFetchDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6 p-6 animate-pulse">
        <div className="col-span-12 xl:col-span-7 space-y-6">
          <div className="h-24 rounded-xl bg-gray-200 w-full" />
          <div className="h-70 rounded-xl bg-gray-200 w-full" />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <div className="h-92.5 rounded-xl bg-gray-200 w-full" />
        </div>
        <div className="col-span-12">
          <div className="h-80 rounded-xl bg-gray-200 w-full" />
        </div>
        <div className="col-span-12">
          <div className="h-80 rounded-xl bg-gray-200 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard de Performance
        </h1>
        <p className="text-gray-500 text-sm">
          Acompanhe seus indicadores em tempo real
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TotalEvaluations data={data.currentMonthByGender} />
            <PerformanceEvaluations data={data.teamPerformance} />
          </div>
        </div>

        <div className="col-span-12">
          <MonthlyEvaluationsChart data={data.monthlyHistory} />
        </div>
      </div>
    </div>
  );
}
