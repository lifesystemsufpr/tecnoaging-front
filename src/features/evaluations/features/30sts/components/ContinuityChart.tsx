"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { Gender } from "@/core/enums";
import {
  AGE_GROUPS,
  AgeGroup,
  getPercentileValue,
} from "../utils/barScatterPlotData";

// Mapeamento de faixa etária para idade central (para eixo contínuo)
const AGE_GROUP_CENTER: Record<AgeGroup, number> = {
  "70-74": 72,
  "75-79": 77,
  "80-84": 82,
  "85-89": 87,
  "≥90": 92,
};

export default function ContinuityChart({
  idadePaciente,
  repeticoesPaciente,
  participantGender,
  labelColor,
}: {
  idadePaciente: number;
  repeticoesPaciente: number;
  participantGender: Gender;
  labelColor: string;
}) {
  const option = React.useMemo(() => {
    // Dados das linhas de percentis (P25, P50, P75)
    const p25Data = AGE_GROUPS.map((ag) => [
      AGE_GROUP_CENTER[ag],
      getPercentileValue(participantGender, ag, 25) ?? 0,
    ]);
    const p50Data = AGE_GROUPS.map((ag) => [
      AGE_GROUP_CENTER[ag],
      getPercentileValue(participantGender, ag, 50) ?? 0,
    ]);
    const p75Data = AGE_GROUPS.map((ag) => [
      AGE_GROUP_CENTER[ag],
      getPercentileValue(participantGender, ag, 75) ?? 0,
    ]);

    const genderLabel =
      participantGender === Gender.MALE ? "Masculino" : "Feminino";

    return {
      title: {
        text: `Comparativo de repetição por idade`,
        left: "left",
        textStyle: { color: labelColor },
      },
      tooltip: {
        trigger: "axis",
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          let res = `<strong>Idade: ${params[0].axisValue}</strong><br/>`;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params.forEach((item: any) => {
            if (item.seriesName && !item.seriesName.startsWith("_")) {
              res += `${item.marker} ${item.seriesName}: ${item.value[1]} reps<br/>`;
            }
          });
          return res;
        },
      },
      legend: {
        top: 30,
        textStyle: { color: labelColor },
        data: ["P75", "P50 (Mediana)", "P25", "Paciente"],
      },
      grid: {
        left: 60,
        right: 40,
        bottom: 50,
        top: 80,
      },
      xAxis: {
        type: "value",
        name: "Idade",
        nameLocation: "middle",
        nameGap: 30,
        min: 70,
        max: 95,
        interval: 5,
        axisLabel: { color: labelColor },
        splitLine: {
          show: true,
          lineStyle: { type: "dashed", color: "#ccc" },
        },
      },
      yAxis: {
        type: "value",
        name: "Repetições",
        nameLocation: "middle",
        nameGap: 50,
        min: 0,
        axisLabel: { color: labelColor },
        splitLine: {
          lineStyle: { type: "dashed", color: "#ddd" },
        },
      },
      textStyle: { color: labelColor },
      series: [
        // Área inferior invisível (P25) — serve de "base" para o stack
        {
          name: "_baseP25",
          type: "line",
          data: p25Data,
          smooth: true,
          stack: "percentilArea",
          lineStyle: { opacity: 0 },
          symbol: "none",
          areaStyle: { opacity: 0 },
          z: 1,
        },
        // Área entre P25 e P50 (cor verde claro)
        {
          name: "_areaP25_P50",
          type: "line",
          data: p50Data.map((point, i) => [point[0], point[1] - p25Data[i][1]]),
          smooth: true,
          stack: "percentilArea",
          lineStyle: { opacity: 0 },
          symbol: "none",
          areaStyle: {
            color: "rgba(255, 183, 77, 0.3)",
          },
          z: 1,
        },
        // Área entre P50 e P75 (cor azul claro)
        {
          name: "_areaP50_P75",
          type: "line",
          data: p75Data.map((point, i) => [point[0], point[1] - p50Data[i][1]]),
          smooth: true,
          stack: "percentilArea",
          lineStyle: { opacity: 0 },
          symbol: "none",
          areaStyle: {
            color: "rgba(76, 175, 80, 0.25)",
          },
          z: 1,
        },
        // Linhas reais (não stacked) para P25, P50, P75
        {
          name: "P75",
          type: "line",
          data: p75Data,
          smooth: true,
          lineStyle: { color: "#4CAF50", width: 2 },
          itemStyle: { color: "#4CAF50" },
          symbol: "circle",
          symbolSize: 6,
          z: 5,
        },
        {
          name: "P50 (Mediana)",
          type: "line",
          data: p50Data,
          smooth: true,
          lineStyle: { color: "#FF9800", width: 3 },
          itemStyle: { color: "#FF9800" },
          symbol: "circle",
          symbolSize: 6,
          z: 5,
        },
        {
          name: "P25",
          type: "line",
          data: p25Data,
          smooth: true,
          lineStyle: { color: "#F44336", width: 2 },
          itemStyle: { color: "#F44336" },
          symbol: "circle",
          symbolSize: 6,
          z: 5,
        },
        // Ponto do paciente
        {
          name: "Paciente",
          type: "scatter",
          data: [[idadePaciente, repeticoesPaciente]],
          symbol: "diamond",
          symbolSize: 14,
          itemStyle: { color: "#FF4444", borderColor: "#fff", borderWidth: 2 },
          label: {
            show: true,
            formatter: `Paciente: ${repeticoesPaciente} reps`,
            position: "top",
            color: "#FF4444",
            fontWeight: "bold",
          },
          z: 10,
        },
      ],
    };
  }, [idadePaciente, repeticoesPaciente, participantGender, labelColor]);

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
