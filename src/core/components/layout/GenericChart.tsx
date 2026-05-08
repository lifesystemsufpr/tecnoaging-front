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
  highlightValue?: unknown;
  valueFormatter?: (value: unknown) => string;

  showLabels?: boolean;

  dense?: boolean;
  timeSeries?: boolean;
  enableZoom?: boolean;
};

export default function GenericChart<T>({
  data,
  xKey,
  yKey,
  title,
  labelColor = "#000",
  seriesType = "line",

  highlightKey,
  highlightValue,
  valueFormatter,

  showLabels = false,

  dense = false,
  timeSeries = false,
  enableZoom = false,
}: GenericChartProps<T>) {
  if (!data || data.length === 0) return null;

  const formattedData = timeSeries
    ? data.map((item) => [item[xKey] as unknown, Number(item[yKey])])
    : data.map((item) => ({
        value: Number(item[yKey]),
        itemStyle: highlightKey
          ? {
              color:
                item[highlightKey] === highlightValue ? "#f39c12" : "#3498db",
            }
          : undefined,
      }));

  // Calcular o máximo valor de X para limitar o zoom
  const maxXValue = timeSeries
    ? Math.max(...data.map((item) => Number(item[xKey])))
    : undefined;

  const option = {
    title: {
      text: title,
      left: "left",
      textStyle: { color: labelColor },
    },

    tooltip: {
      trigger: "axis",
      formatter: (params: unknown) => {
        const point = params[0];
        const value = timeSeries ? point.value[1] : point.value;

        return `
          ${point.axisValueLabel || point.name}<br/>
          Valor: <b>${valueFormatter ? valueFormatter(value) : value}</b>
        `;
      },
    },

    xAxis: {
      data: timeSeries ? undefined : data.map((item) => String(item[xKey])),
      type: timeSeries ? "value" : "category",
      min: timeSeries ? 0 : undefined,
      max: maxXValue,
      axisLabel: {
        color: labelColor,
        // Opcional: Adicionar o sufixo "s" para indicar segundos
        formatter: (value: unknown) => (timeSeries ? `${value}s` : value),
      },
    },

    yAxis: {
      type: "value",
      axisLabel: { color: labelColor },
    },

    dataZoom: enableZoom ? [{ type: "inside" }, { type: "slider" }] : undefined,

    series: [
      {
        type: seriesType,
        data: formattedData,

        smooth: dense,
        showSymbol: !dense,
        sampling: dense ? "lttb" : undefined,
        progressive: dense ? 5000 : undefined,
        progressiveThreshold: dense ? 10000 : undefined,

        label: {
          show: showLabels,
          position: "top",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            const value = timeSeries ? params.value[1] : params.value;
            return valueFormatter ? valueFormatter(value) : value;
          },
          color: labelColor,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
