"use client";
import ReactECharts from "echarts-for-react";
import { useBarScatterPlotOptions } from "../hooks/useBarScatterPlotOptions";
import { BarScatterPlotProps } from "./barScatterPlot.types";

export default function BarScatterPlot({
  participantAge,
  participantRepetitions,
  participantGender,
  labelColor,
}: BarScatterPlotProps) {
  const option = useBarScatterPlotOptions({
    participantAge,
    participantRepetitions,
    participantGender,
    labelColor,
  });

  return <ReactECharts option={option} style={{ height: 450 }} />;
}
