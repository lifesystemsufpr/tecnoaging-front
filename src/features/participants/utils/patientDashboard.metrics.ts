import {
  PatientEvaluation,
  PerformanceClassification,
} from "../types/patient-dashboard.types";

const AGE_REFERENCE_TABLE = [
  { faixa: [20, 29], TUG: [6.0, 0.9], T5STS: [8.5, 1.1] },
  { faixa: [30, 39], TUG: [6.2, 1.0], T5STS: [9.1, 1.2] },
  { faixa: [40, 49], TUG: [6.5, 1.1], T5STS: [9.9, 1.5] },
  { faixa: [50, 59], TUG: [6.7, 1.2], T5STS: [10.7, 1.6] },
  { faixa: [60, 69], TUG: [8.5, 1.2], T5STS: [11.4, 2.1] },
  { faixa: [70, 79], TUG: [9.8, 1.4], T5STS: [13.6, 2.4] },
  { faixa: [80, 200], TUG: [11.5, 2.0], T5STS: [15.9, 3.0] },
];

const CLASSIFICATION_WEIGHTS: Record<string, number> = {
  Excelente: 5,
  Bom: 4,
  Regular: 3,
  Ruim: 2,
  Crítico: 1,
};

export function isFiveTstsType(type: string): boolean {
  return type === "5TSTS" || type === "FTSTS";
}

export function tempoStringParaSegundos(tempoStr?: string): number {
  if (!tempoStr) return 0;

  if (!tempoStr.includes(":")) {
    const raw = Number(tempoStr);
    return Number.isFinite(raw) ? raw : 0;
  }

  const parts = tempoStr.split(":").map(Number);
  if (parts.some((value) => !Number.isFinite(value))) return 0;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return 0;
}

export function formatTempoTotal(totalSegundos: number): string {
  if (totalSegundos >= 60) {
    return `${Math.round(totalSegundos / 60)} min`;
  }

  return `${Math.round(totalSegundos)} s`;
}

export function formatMediaDuracao(mediaSegundos: number): string {
  return `${mediaSegundos.toFixed(1)}s`;
}

export function calcularIdadeAnos(nascimento: string, dataRef: string): number {
  const nasc = new Date(nascimento);
  const ref = new Date(dataRef);

  let idade = ref.getFullYear() - nasc.getFullYear();
  const mes = ref.getMonth() - nasc.getMonth();

  if (mes < 0 || (mes === 0 && ref.getDate() < nasc.getDate())) {
    idade -= 1;
  }

  return idade;
}

export function classificarTempoPorIdade(
  tempo: number,
  idade: number,
  tipo: string
): PerformanceClassification {
  const ref = AGE_REFERENCE_TABLE.find(
    (entry) => idade >= entry.faixa[0] && idade <= entry.faixa[1]
  );

  if (!ref) return "Desconhecido";

  const [media, desvio] = tipo === "TUG" ? ref.TUG : ref.T5STS;

  if (tempo <= media - desvio) return "Excelente";
  if (tempo <= media + desvio) return "Bom";
  if (tempo <= media + 2 * desvio) return "Regular";
  return "Crítico";
}

export function classificarDesempenhoGeral(
  lista: PerformanceClassification[]
): PerformanceClassification {
  if (!lista.length) return "N/A";

  const media =
    lista.reduce((acc, item) => acc + (CLASSIFICATION_WEIGHTS[item] || 0), 0) /
    lista.length;

  if (media >= 4.6) return "Excelente";
  if (media >= 3.6) return "Bom";
  if (media >= 2.6) return "Regular";
  if (media >= 1.6) return "Ruim";
  return "Crítico";
}

export function calcularMediaMensalPorTipo(
  evals: PatientEvaluation[],
  tipo: "TUG" | "5TSTS"
): number[] {
  const soma = Array(12).fill(0);
  const cont = Array(12).fill(0);

  evals.forEach((ev) => {
    const isTypeMatch =
      tipo === "TUG" ? ev.type === "TUG" : isFiveTstsType(ev.type);

    if (isTypeMatch) {
      const mes = new Date(ev.date).getMonth();
      soma[mes] += tempoStringParaSegundos(ev.totalTime);
      cont[mes] += 1;
    }
  });

  return soma.map((total, index) =>
    cont[index] ? Number((total / cont[index]).toFixed(1)) : 0
  );
}
