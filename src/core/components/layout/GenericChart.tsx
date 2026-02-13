"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";

type GenericChartProps<T> = {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  title?: string;
  labelColor?: string;
  seriesType?: "bar" | "line";
  highlightKey?: keyof T;
  highlightValue?: any;
  valueFormatter?: (value: any) => string;
};

export default function GenericChart<T>({
  data,
  xKey,
  yKey,
  title,
  labelColor = "#000",
  seriesType = "bar",
  highlightKey,
  highlightValue,
  valueFormatter,
}: GenericChartProps<T>) {
  if (!data || data.length === 0) return null;

  const labels = data.map((item) => String(item[xKey]));
  const values = data.map((item) => Number(item[yKey]));

  const option = {
    title: {
      text: title,
      left: "left",
      textStyle: { color: labelColor },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const { name, value } = params[0];
        return `${name}<br/>Valor: <b>${
          valueFormatter ? valueFormatter(value) : value
        }</b>`;
      },
    },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: labelColor },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: labelColor },
    },
    series: [
      {
        type: seriesType,
        data: data.map((item) => ({
          value: Number(item[yKey]),
          itemStyle: highlightKey
            ? {
                color:
                  item[highlightKey] === highlightValue ? "#f39c12" : "#3498db",
              }
            : undefined,
        })),
        label: {
          show: true,
          position: "top",
          formatter: (params: any) =>
            valueFormatter ? valueFormatter(params.value) : params.value,
          color: labelColor,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
