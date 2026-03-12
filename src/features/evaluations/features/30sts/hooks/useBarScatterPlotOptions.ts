import { useMemo } from "react";
import { Gender } from "@/core/enums";
import {
  AGE_GROUPS,
  AGE_GROUP_COLORS,
  AgeGroup,
  getAgeGroup,
  getPercentilesForGender,
  getPercentileValue,
} from "../utils/barScatterPlotData";

interface UseBarScatterPlotOptionsParams {
  participantAge: number;
  participantRepetitions: number;
  participantGender: Gender;
  labelColor: string;
}

/**
 * Gera pontos scatter simulados (jitter) em torno da mediana para cada faixa etária.
 */
function generateScatterPoints(
  gender: Gender,
  ageGroupIndex: number,
  ageGroup: AgeGroup
): [number, number][] {
  const points: [number, number][] = [];
  const percentiles = getPercentilesForGender(gender);

  for (const entry of percentiles) {
    const value = entry.values[ageGroup];
    const count = Math.max(1, Math.floor(entry.percentile / 15));
    for (let i = 0; i < count; i++) {
      const jitterX = (Math.random() - 0.5) * 0.6;
      const jitterY = (Math.random() - 0.5) * 0.4;
      points.push([ageGroupIndex + jitterX, value + jitterY]);
    }
  }
  return points;
}

export function useBarScatterPlotOptions({
  participantAge,
  participantRepetitions,
  participantGender,
  labelColor,
}: UseBarScatterPlotOptionsParams) {
  return useMemo(() => {
    const patientAgeGroup = getAgeGroup(participantAge);
    const genderLabel =
      participantGender === Gender.MALE ? "Masculino" : "Feminino";

    // Dados do boxplot: [min (P5), Q1 (P25), mediana (P50), Q3 (P75), max (P90)]
    const boxplotData = AGE_GROUPS.map((ag) => {
      const p5 = getPercentileValue(participantGender, ag, 5) ?? 0;
      const p25 = getPercentileValue(participantGender, ag, 25) ?? 0;
      const p50 = getPercentileValue(participantGender, ag, 50) ?? 0;
      const p75 = getPercentileValue(participantGender, ag, 75) ?? 0;
      const p90 = getPercentileValue(participantGender, ag, 90) ?? 0;
      return [p5, p25, p50, p75, p90];
    });

    // Cores para cada caixa do boxplot via renderItem customizado
    const boxplotColors = AGE_GROUPS.map((ag) => AGE_GROUP_COLORS[ag]);

    // Series de scatter por faixa etária
    const scatterSeries = AGE_GROUPS.map((ag, idx) => ({
      name: ag,
      type: "scatter" as const,
      data: generateScatterPoints(participantGender, idx, ag),
      symbolSize: 5,
      itemStyle: {
        color: AGE_GROUP_COLORS[ag],
        opacity: 0.7,
      },
      z: 3,
    }));

    // Ponto do paciente
    const patientIdx = patientAgeGroup
      ? AGE_GROUPS.indexOf(patientAgeGroup)
      : -1;

    const patientSeries =
      patientIdx >= 0
        ? [
            {
              name: "Paciente",
              type: "scatter" as const,
              data: [[patientIdx, participantRepetitions]],
              symbolSize: 14,
              symbol: "diamond",
              itemStyle: {
                color: "#FF4444",
                borderColor: "#fff",
                borderWidth: 2,
              },
              z: 10,
              label: {
                show: true,
                formatter: `${participantRepetitions}`,
                position: "top" as const,
                color: "#FF4444",
                fontWeight: "bold" as const,
                fontSize: 13,
              },
            },
          ]
        : [];

    return {
      title: {
        text: `Diagrama de caixa (${genderLabel})`,
        subtext: "(Número de levantadas completas em 30 segundos)",
        left: "left",
        textStyle: { color: labelColor, fontSize: 16 },
        subtextStyle: { color: labelColor, fontSize: 12 },
      },
      tooltip: {
        trigger: "item",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          if (params.seriesType === "boxplot") {
            const ageGroup = AGE_GROUPS[params.dataIndex];
            const data = params.data;
            return `<strong>Faixa Etária: ${ageGroup}</strong><br/>
              P90 (máx): ${data[5]}<br/>
              P75 (Q3): ${data[4]}<br/>
              P50 (Mediana): ${data[3]}<br/>
              P25 (Q1): ${data[2]}<br/>
              P5 (mín): ${data[1]}`;
          }
          if (params.seriesName === "Paciente") {
            return `<strong>Paciente</strong><br/>Repetições: ${participantRepetitions}`;
          }
          return "";
        },
      },
      legend: {
        show: false,
      },
      grid: {
        left: 60,
        right: 40,
        bottom: 60,
        top: 80,
      },
      xAxis: {
        type: "category",
        data: AGE_GROUPS,
        name: "Faixa Etária",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { color: labelColor, fontSize: 14, fontWeight: "bold" },
        axisLabel: {
          color: labelColor,
          fontSize: 12,
          fontWeight: "bold",
        },
        axisTick: { alignWithLabel: true },
        boundaryGap: true,
      },
      yAxis: {
        type: "value",
        name: "Repetições",
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: { color: labelColor, fontSize: 14, fontWeight: "bold" },
        min: 0,
        axisLabel: { color: labelColor },
        splitLine: { lineStyle: { type: "dashed", color: "#ddd" } },
      },
      series: [
        {
          name: "Boxplot",
          type: "boxplot",
          data: boxplotData,
          itemStyle: {
            borderWidth: 2,
          },
          // Cores individuais por caixa
          encode: {
            tooltip: [1, 2, 3, 4, 5],
          },
          // Aplicar cores por item
          colorBy: "data" as const,
          color: boxplotColors,
        },
        ...scatterSeries,
        ...patientSeries,
      ],
    };
  }, [participantAge, participantRepetitions, participantGender, labelColor]);
}
