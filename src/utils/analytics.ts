import { SensorData, Evaluation } from "@/types/domain/Evaluation";
import { EvaluationType } from "@/types/domain/Evaluation";
import { calcularIdadeAnos } from "./format";

export function classificarTempoPorIdade(
  tempo: number,
  idade: number,
  tipo: EvaluationType
) {
  const tabela = [
    { faixa: [20, 29], TUG: [6.0, 0.9], "5TSTS": [8.5, 1.1] },
    { faixa: [30, 39], TUG: [6.2, 1.0], "5TSTS": [9.1, 1.2] },
    { faixa: [40, 49], TUG: [6.5, 1.1], "5TSTS": [9.9, 1.5] },
    { faixa: [50, 59], TUG: [6.7, 1.2], "5TSTS": [10.7, 1.6] },
    { faixa: [60, 69], TUG: [8.5, 1.2], "5TSTS": [11.4, 2.1] },
    { faixa: [70, 79], TUG: [9.8, 1.4], "5TSTS": [13.6, 2.4] },
    { faixa: [80, 200], TUG: [11.5, 2.0], "5TSTS": [15.9, 3.0] },
  ];

  const ref = tabela.find((r) => idade >= r.faixa[0] && idade <= r.faixa[1]);
  if (!ref) return "Desconhecido";
  const [media, desvio] = tipo === "TUG" ? ref.TUG : ref["5TSTS"];

  if (tempo <= media - desvio) return "Excelente";
  if (tempo <= media + desvio) return "Bom";
  if (tempo <= media + 2 * desvio) return "Regular";
  return "Crítico";
}

export function calcularIndicadores(
  sensorData: SensorData[],
  evaluationDetails: Evaluation
) {
  if (!sensorData || sensorData.length === 0) return null;
  if (evaluationDetails.type !== "FTSTS") return null;

  const t0 = new Date(sensorData[0].timestamp).getTime();
  const tN = new Date(sensorData[sensorData.length - 1].timestamp).getTime();
  const tempo = (tN - t0) / 1000;

  const accelNorm = sensorData.map((d) => {
    if (d.accel_z === undefined) d.accel_z = 0;
    return Math.sqrt(d.accel_x ** 2 + d.accel_y ** 2 + d.accel_z ** 2);
  });

  const media = accelNorm.reduce((sum, v) => sum + v, 0) / accelNorm.length;
  const potencia = Math.sqrt(
    accelNorm.reduce((sum, v) => sum + v ** 2, 0) / accelNorm.length
  );
  const fadiga = Math.sqrt(
    accelNorm.reduce((sum, v) => sum + (v - media) ** 2, 0) / accelNorm.length
  );

  const ladoPositivo = sensorData.filter((d) => d.accel_x >= 0).length;
  const ladoNegativo = sensorData.filter((d) => d.accel_x < 0).length;
  const simetria = Math.abs(ladoPositivo - ladoNegativo) / sensorData.length;
  const idade = calcularIdadeAnos(
    evaluationDetails.patient?.birthday,
    evaluationDetails.date
  );

  const tempoClassificacao = classificarTempoPorIdade(tempo, idade, "5TSTS");

  function classificar(
    valor: number,
    faixas: [number, number, string][]
  ): string {
    for (let [min, max, label] of faixas) {
      if (valor >= min && valor <= max) return label;
    }
    return "Desconhecido";
  }

  return [
    {
      name: "Tempo",
      value: Number(tempo.toFixed(2)),
      maxValue: 60,
      classificacao: tempoClassificacao,
    },
    {
      name: "Potência",
      value: Number(potencia.toFixed(2)),
      maxValue: 20,
      classificacao: classificar(potencia, [
        [15, Infinity, "Excelente"],
        [12, 14.99, "Bom"],
        [9, 11.99, "Regular"],
        [6, 8.99, "Ruim"],
        [0, 5.99, "Crítico"],
      ]),
    },
    {
      name: "Fadiga",
      value: Number(fadiga.toFixed(2)),
      maxValue: 10,
      classificacao: classificar(fadiga, [
        [0, 2, "Excelente"],
        [2.01, 4, "Bom"],
        [4.01, 6, "Regular"],
        [6.01, 8, "Ruim"],
        [8.01, Infinity, "Crítico"],
      ]),
    },
    {
      name: "Simetria",
      value: Number((simetria * 10).toFixed(2)),
      maxValue: 10,
      classificacao: classificar(simetria * 10, [
        [0, 2, "Excelente"],
        [2.01, 4, "Bom"],
        [4.01, 6, "Regular"],
        [6.01, 8, "Ruim"],
        [8.01, Infinity, "Crítico"],
      ]),
    },
  ];
}

export function classificarDesempenhoGeral(itens: any[]) {
  const pesos: { [key: string]: number } = {
    Excelente: 5,
    Bom: 4,
    Regular: 3,
    Ruim: 2,
    Crítico: 1,
  };

  const total = itens.reduce(
    (acc, item) => acc + (pesos[item.classificacao] || 0),
    0
  );
  const media = total / itens.length;

  if (media >= 4.6) return "Excelente";
  if (media >= 3.6) return "Bom";
  if (media >= 2.6) return "Regular";
  if (media >= 1.6) return "Ruim";
  return "Crítico";
}
