"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Card, CardContent, Typography } from "@mui/material";
import { DashboardSeries } from "../types/patient-dashboard.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PatientRecentEvaluationChartProps {
  data: DashboardSeries;
}

const MONTH_CATEGORIES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function PatientRecentEvaluationChart({
  data,
}: PatientRecentEvaluationChartProps) {
  const options: ApexOptions = {
    colors: ["#4caf50", "#1565c0"],
    chart: {
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 5 },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Number(val).toFixed(1)} s`,
    },
    tooltip: {
      y: {
        formatter: (val) => `${Number(val).toFixed(1)}s`,
      },
    },
    xaxis: {
      type: "category",
      categories: MONTH_CATEGORIES,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${Number(val).toFixed(0)}s`,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
  };

  const series = [
    {
      name: "Média 5TSTS",
      data: data.fiveTsts,
    },
    {
      name: "Média TUG",
      data: data.tug,
    },
  ];

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          Média Mensal das Avaliações
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          TUG e 5TSTS em segundos
        </Typography>

        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={310}
        />
      </CardContent>
    </Card>
  );
}
