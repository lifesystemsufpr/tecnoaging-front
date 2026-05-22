"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, Typography } from "@/core/components/ui";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PatientMonthlyChartProps {
  data: number[];
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

export function PatientMonthlyChart({ data }: PatientMonthlyChartProps) {
  const options: ApexOptions = {
    colors: ["#1976d2"],
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: "45%",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: MONTH_CATEGORIES,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${Math.round(val)}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${Math.round(val)} avaliações`,
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
      name: "Avaliações",
      data: data.length === 12 ? data : Array(12).fill(0),
    },
  ];

  return (
    <Card variant="outlined" className="rounded-lg">
      <CardContent>
        <Typography variant="h4" className="font-semibold mb-2">
          Avaliações Mensais
        </Typography>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </CardContent>
    </Card>
  );
}
