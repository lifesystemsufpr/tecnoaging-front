"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartEntry {
  label: string;
  value: number;
}

interface UbsEntry {
  ubs: string;
  absolute: number;
  percentage: number;
}

interface ChartsData {
  ageDistribution: ChartEntry[];
  educationLevel: ChartEntry[];
  participantsPerUbs: UbsEntry[];
}

interface ResearcherChartsProps {
  data: ChartsData;
}


function AgeDistributionChart({ data }: { data: ChartEntry[] }) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 280,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#465fff"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.map((d) => d.label),
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
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => `${val} participantes` },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Participantes",
      data: data.map((d) => d.value),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-2 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Distribuição por Faixa Etária
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Número de participantes por faixa etária
        </p>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={260}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Sub-component: Education Level – Barras Horizontais
// ────────────────────────────────────────────────────────────────
function EducationLevelChart({ data }: { data: ChartEntry[] }) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 280,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#10b981"],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "55%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`,
      style: {
        fontSize: "11px",
        fontFamily: "Outfit",
        colors: ["#fff"],
        fontWeight: "600",
      },
      offsetX: -4,
    },
    xaxis: {
      categories: data.map((d) => d.label),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px", fontFamily: "Outfit" },
        formatter: (val) => `${val}`,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontFamily: "Outfit",
          fontWeight: "500",
        },
      },
    },
    grid: {
      borderColor: "#f3f4f6",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => `${val} participantes` },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Participantes",
      data: data.map((d) => d.value),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-2 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Nível de Escolaridade
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Participantes por nível de ensino
        </p>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={260}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Sub-component: Participants per UBS – Gráfico de Setores (Donut)
// ────────────────────────────────────────────────────────────────
function ParticipantsPerUbsChart({ data }: { data: UbsEntry[] }) {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 280,
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#465fff", "#10b981", "#f59e0b"],
    labels: data.map((d) => d.ubs),
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
              formatter: (val) =>
                Number(val).toLocaleString("pt-BR"),
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
          return `${val.toLocaleString("pt-BR")} participantes (${pct}%)`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const series = data.map((d) => d.absolute);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Participantes por UBS
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Distribuição entre unidades básicas de saúde
        </p>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={280}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Main export
// ────────────────────────────────────────────────────────────────
export default function ResearcherCharts({ data }: ResearcherChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <AgeDistributionChart data={data.ageDistribution} />
      <EducationLevelChart data={data.educationLevel} />
      <ParticipantsPerUbsChart data={data.participantsPerUbs} />
    </div>
  );
}
