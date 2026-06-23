"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { IPeaksData } from "@/features/evaluations/types/Evaluation.types";

type MetricKey = Exclude<keyof IPeaksData, "peak">;

interface MetricMeta {
  label: string;
  unit: string;
  description: string;
}

const METRICS: Record<MetricKey, MetricMeta> = {
  time: { label: "Tempo", unit: "s", description: "Instante do pico (s)" },
  rawVel: { label: "Vel. Bruta", unit: "°/s", description: "Velocidade bruta (deg/s)" },
  phoneXVel: { label: "Vel. Phone X", unit: "°/s", description: "Velocidade eixo X do telefone" },
  phoneYVel: { label: "Vel. Phone Y", unit: "°/s", description: "Velocidade eixo Y do telefone" },
  phoneZVel: { label: "Vel. Phone Z", unit: "°/s", description: "Velocidade eixo Z do telefone" },
  calibratedVel: { label: "Vel. Calibrada", unit: "°/s", description: "Velocidade calibrada (deg/s)" },
};

const METRIC_KEYS = Object.keys(METRICS) as MetricKey[];

function fmt(value: number, unit: string) {
  return `${value.toFixed(3)} ${unit}`;
}

interface TMSTPeaksChartProps {
  peaks: IPeaksData[];
  labelColor?: string;
}

export default function TMSTPeaksChart({
  peaks,
  labelColor = "#374151",
}: TMSTPeaksChartProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<MetricKey>(
    "calibratedVel"
  );

  const meta = METRICS[selectedMetric];

  const option = React.useMemo(() => {
    const xData = peaks.map((p, i) => `Pico ${i + 1}`);
    const yData = peaks.map((p) => Number(p[selectedMetric] ?? 0));

    const maxIdx = yData.indexOf(Math.max(...yData));
    const minIdx = yData.indexOf(Math.min(...yData));

    return {
      backgroundColor: "transparent",
      title: {
        text: `Picos do 2MST — ${meta.label}`,
        subtext: meta.description,
        left: "left",
        textStyle: { color: labelColor, fontSize: 14, fontWeight: "bold" },
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
          const idx = params[0].dataIndex;
          const peak = peaks[idx];

          const rows = METRIC_KEYS.map((key) => {
            const m = METRICS[key];
            const isSelected = key === selectedMetric;
            const val = fmt(Number((peak as any)[key] ?? 0), m.unit);
            return `
              <div style="display:flex;justify-content:space-between;gap:24px;padding:2px 0;${isSelected ? "color:#60A5FA;font-weight:600;" : "color:#D1D5DB;"}">
                <span>${m.label}</span>
                <span>${val}</span>
              </div>`;
          }).join("");

          return `
            <div style="min-width:280px;font-size:12px;font-family:inherit;">
              <div style="font-size:13px;font-weight:700;color:#F9FAFB;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #374151;">
                Pico ${idx + 1}
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
          rotate: peaks.length > 8 ? 30 : 0,
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
            data: [
              {
                type: "max",
                name: "Máx",
                label: {
                  fontSize: 15,
                  color: "#fff",
                  formatter: (p: { value: number }) => p.value.toFixed(2),
                },
                itemStyle: { color: "#10B981" },
              },
              {
                type: "min",
                name: "Mín",
                label: {
                  fontSize: 15,
                  color: "#fff",
                  formatter: (p: { value: number }) => p.value.toFixed(2),
                },
                itemStyle: { color: "#EF4444" },
              },
            ],
          },
          markLine: {
            silent: true,
            lineStyle: { color: "#F59E0B", type: "dashed", width: 1.5 },
            label: {
              position: "end",
              formatter: (p: { value: number }) => `Média: ${p.value.toFixed(2)} ${meta.unit}`,
              color: "#F59E0B",
              fontSize: 11,
            },
            data: [{ type: "average", name: "Média" }],
          },
          label: {
            show: peaks.length <= 12,
            position: "top",
            fontSize: 10,
            color: labelColor,
            formatter: (p: { value: number }) => p.value.toFixed(2),
          },
        },
      ],
    };
  }, [peaks, selectedMetric, meta, labelColor]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            id="tmst-metric-select"
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

      <ReactECharts option={option} style={{ height: 380 }} />

      <div
        style={{
          fontSize: 12,
          color: "#6B7280",
          textAlign: "right",
          marginTop: -4,
        }}
      >
        {peaks.length} pico{peaks.length !== 1 ? "s" : ""} detectado{peaks.length !== 1 ? "s" : ""} · Passe o mouse sobre uma barra para ver todos os detalhes
      </div>
    </div>
  );
}

