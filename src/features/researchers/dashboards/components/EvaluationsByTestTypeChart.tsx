"use client";

import type { ApexOptions } from "apexcharts";
import { EvaluationsByTestType } from "../type";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface EvaluationsByTestTypeChartProps {
    data: EvaluationsByTestType[];
}

export function EvaluationsByTestTypeChart({ data }: EvaluationsByTestTypeChartProps) {
    const options: ApexOptions = {
        chart: {
            type: "donut",
            height: 300,
            fontFamily: "Outfit, sans-serif",
        },
        colors: ["#465fff", "#10b981", "#f59e0b"],
        labels: data.map((d) => d.label),
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(1)}%`,
            style: {
                fontSize: "12px",
                fontFamily: "Outfit",
                fontWeight: "600",
            },
            dropShadow: { enabled: false },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total",
                            fontSize: "13px",
                            fontFamily: "Outfit",
                            color: "#6b7280",
                            formatter: (w) => {
                                const total = w.globals.seriesTotals.reduce(
                                    (a: number, b: number) => a + b,
                                    0
                                );
                                return total.toLocaleString("pt-BR");
                            },
                        },
                        value: {
                            fontSize: "22px",
                            fontFamily: "Outfit",
                            fontWeight: "700",
                            color: "#111827",
                            formatter: (val) => Number(val).toLocaleString("pt-BR"),
                        },
                    },
                },
            },
        },
        legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "center",
            fontFamily: "Outfit",
            fontSize: "13px",
            markers: { size: 8 },
            itemMargin: { horizontal: 12, vertical: 6 },
            labels: { colors: "#6b7280" },
        },
        stroke: { width: 0 },
        tooltip: {
            y: {
                formatter: (val, { seriesIndex }) => {
                    const pct = data[seriesIndex]?.percentage.toFixed(1);
                    return `${val.toLocaleString("pt-BR")} avaliações (${pct}%)`;
                },
            },
        },
    };

    const series = data.map((d) => d.absolute);

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Avaliações por Tipo de Teste
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Distribuição percentual e absoluta por tipo
                </p>
            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={300}
            />
        </div>
    );
}