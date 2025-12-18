"use client";
import * as React from "react";
import ReactECharts from "echarts-for-react";

export default function ContinuityChart30s({
  idadePaciente,
  repeticoesPaciente,
  labelColor,
}: {
  idadePaciente: number;
  repeticoesPaciente: number;
  labelColor: string;
}) {
  const option = React.useMemo(() => {
    const referencias30s = [
      { idade: 20, media: 28, desvio: 3 },
      { idade: 30, media: 26, desvio: 3 },
      { idade: 40, media: 24, desvio: 3 },
      { idade: 50, media: 21, desvio: 3 },
      { idade: 60, media: 17, desvio: 3 },
      { idade: 70, media: 14, desvio: 3 },
      { idade: 80, media: 10, desvio: 3 },
      { idade: 90, media: 8, desvio: 2 },
    ];

    const dados = referencias30s;

    // Mapeamento das linhas
    const ideal = dados.map((d) => [d.idade, d.media]);

    // AQUI MUDA A LÓGICA:
    // Para repetições, "Ruim" é fazer MENOS que a média.
    // Subtraí 5 repetições para definir a linha de corte "Ruim/Risco".
    const ruim = dados.map((d) => [d.idade, Math.max(0, d.media - 5)]);

    return {
      title: {
        text: `Gráfico de continuidade - 30sSTS`,
        left: "left",
        textStyle: { color: labelColor },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          // Customização simples para mostrar as infos corretamente no hover
          let res = `<strong>Idade: ${params[0].axisValue}</strong><br/>`;
          params.forEach((item) => {
            res += `${item.marker} ${item.seriesName}: ${item.value[1]} reps<br/>`;
          });
          return res;
        },
      },
      legend: {
        top: 30,
        textStyle: { color: labelColor },
        // Alterei os nomes para fazer sentido com repetições
        data: ["Média Esperada", "Zona de Risco", "Paciente"],
      },
      xAxis: {
        type: "value",
        name: "Idade",
        nameLocation: "middle",
        nameGap: 30,
        min: 20,
        max: 90,
        interval: 10,
        axisLabel: { color: labelColor },
        splitLine: { show: true, lineStyle: { type: "dashed", color: "#ccc" } },
      },
      yAxis: {
        type: "value",
        name: "Repetições", // Eixo Y agora é quantidade
        nameLocation: "middle",
        nameGap: 50,
        axisLabel: { color: labelColor },
      },
      textStyle: { color: labelColor },
      series: [
        {
          name: "Média Esperada",
          type: "line",
          data: ideal,
          smooth: true,
          // Verde continua sendo bom (agora é a linha superior)
          lineStyle: { color: "green", width: 2 },
        },
        {
          name: "Zona de Risco",
          type: "line",
          data: ruim,
          smooth: true,
          // Vermelho agora é a linha inferior (poucas repetições)
          lineStyle: { color: "red", width: 2 },
        },
        {
          name: "Paciente",
          type: "scatter",
          data: [[idadePaciente, repeticoesPaciente]],
          symbol: "circle",
          symbolSize: 12,
          itemStyle: { color: "orange" },
          label: {
            show: true,
            formatter: `Paciente: ${repeticoesPaciente} reps`,
            position: "top",
            color: "orange",
            fontWeight: "bold",
          },
        },
      ],
    };
  }, [idadePaciente, repeticoesPaciente, labelColor]);

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
