"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { ChairStandCycle } from "@/features/evaluations/types/Evaluation.types";

// ─── Mapeamento de métricas ────────────────────────────────────────────────────

type MetricKey = keyof Omit<ChairStandCycle, "cycle">;

interface MetricMeta {
  label: string;
  unit: string;
  description: string;
}

const METRICS: Record<MetricKey, MetricMeta> = {
  totalTime: {
    label: "Tempo Total",
    unit: "s",
    description: "Duração total do ciclo",
  },
  standUpTime: {
    label: "Tempo de Levantar",
    unit: "s",
    description: "Tempo da fase de levantamento",
  },
  sitDownTime: {
    label: "Tempo de Sentar",
    unit: "s",
    description: "Tempo da fase de sentar",
  },
  frequency: {
    label: "Frequência",
    unit: "Hz",
    description: "Frequência do ciclo",
  },
  transitionStandUp: {
    label: "Transição (Levantar)",
    unit: "s",
    description: "Tempo de transição ao levantar",
  },
  transitionSitDown: {
    label: "Transição (Sentar)",
    unit: "s",
    description: "Tempo de transição ao sentar",
  },
  velocityFlexionStandUp: {
    label: "Vel. Flexão (Levantar)",
    unit: "°/s",
    description: "Velocidade de flexão ao levantar",
  },
  velocityExtension: {
    label: "Vel. Extensão",
    unit: "°/s",
    description: "Velocidade de extensão",
  },
  velocityFlexion: {
    label: "Vel. Flexão",
    unit: "°/s",
    description: "Velocidade de flexão",
  },
  velocityExtensionSitDown: {
    label: "Vel. Extensão (Sentar)",
    unit: "°/s",
    description: "Velocidade de extensão ao sentar",
  },
  peak1Time: {
    label: "Tempo Pico 1",
    unit: "s",
    description: "Instante do pico 1",
  },
  peak2Time: {
    label: "Tempo Pico 2",
    unit: "s",
    description: "Instante do pico 2",
  },
  peak1Value: {
    label: "Valor Pico 1",
    unit: "°/s",
    description: "Amplitude do pico 1",
  },
  peak2Value: {
    label: "Valor Pico 2",
    unit: "°/s",
    description: "Amplitude do pico 2",
  },
  power: { label: "Potência", unit: "W", description: "Potência estimada" },
};

const METRIC_KEYS = Object.keys(METRICS) as MetricKey[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: number, unit: string): string {
  return `${value.toFixed(3)} ${unit}`;
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface ChairStandCyclesChartProps {
  cycles: ChairStandCycle[];
  labelColor?: string;
}

export default function ChairStandCyclesChart({
  cycles,
  labelColor = "#374151",
}: ChairStandCyclesChartProps) {
  const [selectedMetric, setSelectedMetric] =
    React.useState<MetricKey>("totalTime");

  const meta = METRICS[selectedMetric];

  const option = React.useMemo(() => {
    const xData = cycles.map((c) => `Ciclo ${c.cycle}`);
    const yData = cycles.map((c) => c[selectedMetric]);

    const maxIdx = yData.indexOf(Math.max(...yData));
    const minIdx = yData.indexOf(Math.min(...yData));

    return {
      backgroundColor: "transparent",
      title: {
        text: `Ciclos de Chair Stand — ${meta.label}`,
        subtext: meta.description,
        left: "left",
        textStyle: { color: "#1c55f2", fontSize: 16, fontWeight: "bold" },
        subtextStyle: { color: "#9CA3AF", fontSize: 12 },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "#1F2937",
        borderColor: "#374151",
        borderWidth: 1,
        padding: [10, 14],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const cycleIndex = params[0].dataIndex;
          const cycle = cycles[cycleIndex];

          const rows = METRIC_KEYS.map((key) => {
            const m = METRICS[key];
            const isSelected = key === selectedMetric;
            const val = fmt(cycle[key], m.unit);
            return `
              <div style="display:flex;justify-content:space-between;gap:24px;padding:2px 0;${isSelected ? "color:#60A5FA;font-weight:600;" : "color:#D1D5DB;"}">
                <span>${m.label}</span>
                <span>${val}</span>
              </div>`;
          }).join("");

          return `
            <div style="min-width:280px;font-size:12px;font-family:inherit;">
              <div style="font-size:13px;font-weight:700;color:#F9FAFB;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #374151;">
                Ciclo ${cycle.cycle}
              </div>
              ${rows}
            </div>`;
        },
      },
      grid: { left: 60, right: 24, bottom: 40, top: 80 },
      xAxis: {
        type: "category",
        data: xData,
        axisLabel: {
          color: labelColor,
          fontSize: 11,
          rotate: cycles.length > 8 ? 30 : 0,
        },
        axisLine: { lineStyle: { color: "#E5E7EB" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: `${meta.label} (${meta.unit})`,
        nameLocation: "middle",
        nameGap: 48,
        nameTextStyle: { color: "#6B7280", fontSize: 11 },
        axisLabel: {
          color: labelColor,
          fontSize: 11,
          formatter: (v: number) => v.toFixed(2),
        },
        splitLine: { lineStyle: { type: "dashed", color: "#F3F4F6" } },
      },
      series: [
        {
          type: "bar",
          data: yData.map((v, i) => ({
            value: v,
            itemStyle: {
              color:
                i === maxIdx
                  ? "#10B981"
                  : i === minIdx
                    ? "#EF4444"
                    : {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                          { offset: 0, color: "#6366F1" },
                          { offset: 1, color: "#818CF8" },
                        ],
                      },
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barMaxWidth: 48,
          markPoint: {
            symbolSize: 45,
          },
          markLine: {
            silent: true,
            lineStyle: { color: "#F59E0B", type: "dashed", width: 1.5 },
            label: {
              position: "end",
              formatter: (p: { value: number }) =>
                `Média: ${p.value.toFixed(2)} ${meta.unit}`,
              color: "#F59E0B",
              fontSize: 11,
            },
            data: [{ type: "average", name: "Média" }],
          },
          label: {
            show: cycles.length <= 12,
            position: "top",
            fontSize: 10,
            color: labelColor,
            formatter: (p: { value: number }) => p.value.toFixed(2),
          },
        },
      ],
    };
  }, [cycles, selectedMetric, meta, labelColor]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Seletor de métrica */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            whiteSpace: "nowrap",
          }}
        >
          Métrica exibida:
        </span>
        <div style={{ position: "relative", display: "inline-block" }}>
          <select
            id="chair-stand-metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricKey)}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              backgroundColor: "#F9FAFB",
              border: "1.5px solid #E5E7EB",
              borderRadius: 8,
              padding: "6px 36px 6px 12px",
              fontSize: 13,
              color: "#111827",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
              minWidth: 200,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {METRIC_KEYS.map((key) => (
              <option key={key} value={key}>
                {METRICS[key].label} ({METRICS[key].unit})
              </option>
            ))}
          </select>
          <span
            style={{
              pointerEvents: "none",
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            ▾
          </span>
        </div>

        {/* Legenda inline */}
        <div
          style={{
            display: "flex",
            gap: 14,
            fontSize: 12,
            color: "#6B7280",
            marginLeft: "auto",
          }}
        >
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: "#10B981",
                marginRight: 4,
              }}
            />
            Máximo
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: "#EF4444",
                marginRight: 4,
              }}
            />
            Mínimo
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "linear-gradient(#6366F1, #818CF8)",
                marginRight: 4,
              }}
            />
            Demais
          </span>
        </div>
      </div>

      {/* Gráfico */}
      <ReactECharts option={option} style={{ height: 380 }} />

      {/* Resumo dos ciclos */}
      <div
        style={{
          fontSize: 12,
          color: "#6B7280",
          textAlign: "right",
          marginTop: -4,
        }}
      >
        {cycles.length} ciclo{cycles.length !== 1 ? "s" : ""} detectado
        {cycles.length !== 1 ? "s" : ""} · Passe o mouse sobre uma barra para
        ver todos os detalhes
      </div>
    </div>
  );
}
