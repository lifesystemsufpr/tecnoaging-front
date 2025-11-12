"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { Cicle } from "@/types/domain/Evaluation";

export function CicleBarChart({ data }: { data: Cicle }) {
  const cycleKeys = Object.keys(data).filter(
    (key) => key !== "Min" && key !== "Max"
  );

  const totals = cycleKeys.map((key) => data[key].total);
  const subidas = cycleKeys.map((key) => data[key].stand);
  const descidas = cycleKeys.map((key) => data[key].sit);

  const option = {
    title: {
      text: "Tempo por Ciclo (em segundos)",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Total", "Subir", "Descer"],
      bottom: 0,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: cycleKeys,
      name: "Ciclos",
    },
    yAxis: {
      type: "value",
      name: "Tempo (s)",
    },
    series: [
      {
        name: "Total",
        type: "bar",
        data: totals,
      },
      {
        name: "Subir",
        type: "bar",
        data: subidas,
      },
      {
        name: "Descer",
        type: "bar",
        data: descidas,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
