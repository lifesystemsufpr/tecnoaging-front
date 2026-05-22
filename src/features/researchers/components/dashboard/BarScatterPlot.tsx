"use client";
import ReactECharts from "echarts-for-react";
import { useBarScatterPlotOptions } from "../../hooks/useBarScatterPlotOptions";
import { BarScatterPlotProps } from "./barScatterPlot.types";
import { useResearcherDashboardContext } from "../../contexts/ResearcherDashboardContext";
import { useResearcherDashboard } from "../../hooks/useResearcherDashboard";

export default function BarScatterPlot({ labelColor }: BarScatterPlotProps) {
  const { genderMode } = useResearcherDashboardContext();
  const genderMapper =
    genderMode === "all" ? "" : genderMode === "male" ? "MALE" : "FEMALE";
  const { data } = useResearcherDashboard(genderMapper);

  const option = useBarScatterPlotOptions({
    participantGender: genderMode,
    labelColor,
    averageByAgeGroup: data?.averageByAgeGroup ?? [],
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <ReactECharts option={option} style={{ height: 450 }} />
    </div>
  );
}
