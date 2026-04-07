"use client";
import ReactECharts from "echarts-for-react";
import { useBarScatterPlotOptions } from "../hooks/useBarScatterPlotOptions";
import { BarScatterPlotProps } from "./barScatterPlot.types";

export default function BarScatterPlot({
  participantAge,
  participantSteps,
  participantGender,
  labelColor,
}: BarScatterPlotProps) {
  const option = useBarScatterPlotOptions({
    participantAge,
    participantSteps,
    participantGender,
    labelColor,
  });

  return <ReactECharts option={option} style={{ height: 450 }} />;
}
