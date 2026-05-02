"use client";
import ReactECharts from "echarts-for-react";
import { useBarScatterPlotOptions } from "../../hooks/useBarScatterPlotOptions";
import { BarScatterPlotProps } from "./barScatterPlot.types";

export default function BarScatterPlot({
  participantGender,
  labelColor,
}: BarScatterPlotProps) {
  const option = useBarScatterPlotOptions({ participantGender, labelColor });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <ReactECharts option={option} style={{ height: 450 }} />
    </div>
  );
}
