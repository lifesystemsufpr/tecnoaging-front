"use client";

import type { ApexOptions } from "apexcharts";
import { TemporalEvaluation } from "../type";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function TemporalEvolutionChart({
  data,
}: {
  data: TemporalEvaluation[];
}) {
  if (!data) return null;

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      zoom: { enabled: false },
    },
    colors: ["#465fff"],
    stroke: {
      width: 3,
      curve: "smooth",
    },
    markers: {
      size: 5,
      colors: ["#465fff"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    xaxis: {
      categories: data.map((d) => d.period),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px", fontFamily: "Outfit" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px", fontFamily: "Outfit" },
        formatter: (val) => `${Math.round(val)}`,
      },
    },
    grid: {
      borderColor: "#f3f4f6",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        opacityFrom: 0.4,
        opacityTo: 0.05,
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val.toLocaleString("pt-BR")} avaliações` },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  const series = [
    {
      name: "Avaliações",
      data: data.map((d) => d.value),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-2 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Evolução Temporal das Avaliações
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Quantidade de avaliações mês a mês
        </p>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={280}
      />
    </div>
  );
}
