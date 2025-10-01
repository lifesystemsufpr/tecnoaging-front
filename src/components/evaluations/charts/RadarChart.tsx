"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";

export default function RadarChart({
  indicators,
  labelColor,
}: {
  indicators: any[];
  labelColor: string;
}) {
  const option = React.useMemo(
    () => ({
      title: {
        text: "Indicadores do Paciente",
        left: "left",
        textStyle: { color: labelColor },
      },
      tooltip: {},
      legend: { textStyle: { color: labelColor }, top: 30 },
      radar: {
        indicator: indicators.map((i: any) => ({
          name: i.name,
          max: i.maxValue,
        })),
        axisName: { color: labelColor },
        splitLine: {
          lineStyle: { color: labelColor === "#fff" ? "#555" : "#ccc" },
        },
      },
      series: [
        {
          type: "radar",
          data: [
            {
              name: "Atuação",
              value: indicators.map((i: any) => i.value),
              areaStyle: { opacity: 0.3 },
            },
          ],
          lineStyle: { color: "purple" },
          symbol: "circle",
        },
      ],
      textStyle: { color: labelColor },
    }),
    [indicators, labelColor]
  );

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
