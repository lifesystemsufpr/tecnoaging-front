"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";
import { SensorData } from "@/types/domain/Evaluation";

export default function SensorDataChart({
  sensorData,
  labelColor,
}: {
  sensorData: SensorData[];
  labelColor: string;
}) {
  const chartOptions = React.useMemo(() => {
    if (!sensorData.length) return { accel: null, gyro: null } as any;

    const labels: string[] = [],
      accelX: number[] = [],
      accelY: number[] = [],
      accelZ: number[] = [],
      gyroX: number[] = [],
      gyroY: number[] = [],
      gyroZ: number[] = [];

    sensorData.forEach((item) => {
      const t = new Date(item.timestamp);
      const label = `${t.getHours().toString().padStart(2, "0")}:${t
        .getMinutes()
        .toString()
        .padStart(
          2,
          "0"
        )}:${t.getSeconds().toString().padStart(2, "0")}.${t.getMilliseconds()}`;
      labels.push(label);
      accelX.push(item.accel_x);
      accelY.push(item.accel_y);
      accelZ.push(item.accel_z);
      gyroX.push(item.gyro_x);
      gyroY.push(item.gyro_y);
      gyroZ.push(item.gyro_z);
    });

    const baseOptions = {
      tooltip: { trigger: "axis" },
      legend: { top: "top", right: "center", textStyle: { color: labelColor } },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLabel: { color: labelColor },
      },
      yAxis: {
        type: "value",
        splitLine: { show: true, lineStyle: { type: "dashed" } },
        axisLabel: { color: labelColor },
      },
      dataZoom: [
        { type: "inside", throttle: 50 },
        { type: "slider", height: 20, bottom: 10 },
      ],
      toolbox: {
        feature: { restore: { title: "Resetar", show: true } },
        top: 10,
        right: 20,
      },
      backgroundColor: "transparent",
      textStyle: { color: labelColor },
    };

    return {
      accel: {
        ...baseOptions,
        title: {
          text: "Acelerômetro",
          left: "left",
          textStyle: { color: labelColor },
        },
        series: [
          { name: "Accel X", type: "line", data: accelX, smooth: true },
          { name: "Accel Y", type: "line", data: accelY, smooth: true },
          { name: "Accel Z", type: "line", data: accelZ, smooth: true },
        ],
      },
      gyro: {
        ...baseOptions,
        title: {
          text: "Giroscópio",
          left: "left",
          textStyle: { color: labelColor },
        },
        series: [
          { name: "Gyro X", type: "line", data: gyroX, smooth: true },
          { name: "Gyro Y", type: "line", data: gyroY, smooth: true },
          { name: "Gyro Z", type: "line", data: gyroZ, smooth: true },
        ],
      },
    };
  }, [sensorData, labelColor]);

  if (!sensorData.length) return null;

  return (
    <>
      {chartOptions.accel && (
        <div style={{ paddingBlock: 20 }}>
          <ReactECharts option={chartOptions.accel} style={{ height: 400 }} />
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
