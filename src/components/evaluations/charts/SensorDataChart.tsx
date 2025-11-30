"use client";

import * as React from "react";
import ReactECharts from "echarts-for-react";
import { SensorData } from "@/types/domain/Evaluation";
import { Box, Typography } from "@mui/material";

interface SensorDataChartProps {
  sensorData: SensorData | null;
  labelColor: string;
}

export default function SensorDataChart({
  sensorData,
  labelColor,
}: SensorDataChartProps) {
  const chartOptions = React.useMemo(() => {
    if (!sensorData || !sensorData.data || sensorData.data.length === 0) {
      return { accel: null, gyro: null };
    }

    const { columns, data, units } = sensorData;

    const idx = columns.reduce(
      (acc, col, i) => {
        acc[col] = i;
        return acc;
      },
      {} as Record<string, number>
    );

    const labels: string[] = [];
    const ax: number[] = [],
      ay: number[] = [],
      az: number[] = [];
    const gx: number[] = [],
      gy: number[] = [],
      gz: number[] = [];

    for (const row of data) {
      const t = new Date(row[idx["t"]]);
      const label = `${t.getHours().toString().padStart(2, "0")}:${t
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}.${t
        .getMilliseconds()
        .toString()
        .padStart(3, "0")}`;

      labels.push(label);

      ax.push(row[idx["ax"]]);
      ay.push(row[idx["ay"]]);
      az.push(row[idx["az"]]);

      gx.push(row[idx["gx"]]);
      gy.push(row[idx["gy"]]);
      gz.push(row[idx["gz"]]);
    }

    const baseOptions = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        top: "top",
        right: "center",
        textStyle: { color: labelColor },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLabel: { color: labelColor },
        axisLine: { lineStyle: { color: labelColor } },
      },
      dataZoom: [
        { type: "inside", throttle: 50 },
        { type: "slider", height: 20, bottom: 0, handleSize: "80%" },
      ],
      toolbox: {
        feature: {
          restore: { title: "Resetar" },
          saveAsImage: { title: "Salvar Imagem" },
        },
        iconStyle: { borderColor: labelColor },
        top: 0,
        right: 20,
      },
      backgroundColor: "transparent",
      textStyle: { color: labelColor },
    };

    return {
      accel: {
        ...baseOptions,
        title: {
          text: `Acelerômetro (${units["ax"] || "g"})`, // Usa a unidade vinda do backend
          left: "left",
          textStyle: { color: labelColor },
        },
        yAxis: {
          type: "value",
          name: units["ax"] || "g",
          nameTextStyle: { color: labelColor },
          splitLine: {
            show: true,
            lineStyle: { type: "dashed", opacity: 0.3 },
          },
          axisLabel: { color: labelColor },
        },
        series: [
          {
            name: "X",
            type: "line",
            data: ax,
            showSymbol: false,
            itemStyle: { color: "#ff4d4f" },
          },
          {
            name: "Y",
            type: "line",
            data: ay,
            showSymbol: false,
            itemStyle: { color: "#52c41a" },
          },
          {
            name: "Z",
            type: "line",
            data: az,
            showSymbol: false,
            itemStyle: { color: "#1890ff" },
          },
        ],
      },
      gyro: {
        ...baseOptions,
        title: {
          text: `Giroscópio (${units["gx"] || "rad/s"})`,
          left: "left",
          textStyle: { color: labelColor },
        },
        yAxis: {
          type: "value",
          name: units["gx"] || "rad/s",
          nameTextStyle: { color: labelColor },
          splitLine: {
            show: true,
            lineStyle: { type: "dashed", opacity: 0.3 },
          },
          axisLabel: { color: labelColor },
        },
        series: [
          {
            name: "X",
            type: "line",
            data: gx,
            showSymbol: false,
            itemStyle: { color: "#ff4d4f" },
          },
          {
            name: "Y",
            type: "line",
            data: gy,
            showSymbol: false,
            itemStyle: { color: "#52c41a" },
          },
          {
            name: "Z",
            type: "line",
            data: gz,
            showSymbol: false,
            itemStyle: { color: "#1890ff" },
          },
        ],
      },
    };
  }, [sensorData, labelColor]);

  if (!sensorData || !sensorData.data || sensorData.data.length === 0)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 100,
        }}
      >
        <Typography variant="body1" color="error">
          Nenhum dado de sensor disponível para exibir o gráfico.
        </Typography>
      </Box>
    );

  return (
    <>
      {chartOptions.accel && (
        <div style={{ paddingBlock: 20 }}>
          <ReactECharts
            option={chartOptions.accel}
            style={{ height: 400 }}
            theme={null}
          />
        </div>
      )}
      {chartOptions.gyro && (
        <div style={{ paddingBlock: 20 }}>
          <ReactECharts option={chartOptions.gyro} style={{ height: 400 }} />
        </div>
      )}
    </>
  );
}
