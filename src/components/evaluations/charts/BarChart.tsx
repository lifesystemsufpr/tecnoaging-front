"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { Evaluation } from "@/types/domain/Evaluation";

export default function BarChart({
  evaluations,
  currentId,
  labelColor,
}: {
  evaluations: Evaluation[];
  currentId: string;
  labelColor: string;
}) {
  if (!evaluations || evaluations.length === 0) return null;

  const parseTimeInSeconds = (totalTime?: string) => {
    if (!totalTime) return 0;
    const parts = totalTime.split(":").map(Number);
    return parts[2] || 0; // mantido exatamente como no original
  };

  const sorted = evaluations
    .filter((e) => e.totalTime)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const labels = sorted.map((e) =>
    new Date(e.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  );

  const times = sorted.map((e) => parseTimeInSeconds(e.totalTime));

  const option = {
    title: {
      text: "Tempo de Testes do Paciente",
      left: "left",
      textStyle: { color: labelColor },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const { name, value } = params[0];
        return `Data: ${name}<br/>Tempo: <b>${value}s</b>`;
      },
    },
    xAxis: { type: "category", data: labels, axisLabel: { color: labelColor } },
    yAxis: { type: "value", axisLabel: { color: labelColor } },
    series: [
      {
        type: "bar",
        data: times.map((time, index) => ({
          value: time,
          itemStyle: {
            color: sorted[index].id === currentId ? "#f39c12" : "#3498db",
          },
        })),
        label: {
          show: true,
          position: "top",
          formatter: "{c}s",
          color: labelColor,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
