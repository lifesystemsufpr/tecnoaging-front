export type PerformanceClassification =
  | "Excelente"
  | "Bom"
  | "Regular"
  | "Ruim"
  | "Crítico"
  | "N/A"
  | "Desconhecido";

export interface PatientEvaluation {
  type: string;
  date: string;
  totalTime: string;
}

export interface PatientProfile {
  dateOfBirth?: string;
  birthday?: string;
}

export interface DashboardSeries {
  tug: number[];
  fiveTsts: number[];
}

export interface PatientDashboardData {
  evaluations: PatientEvaluation[];
  evaluationsByMonth: number[];
  mediaDuracao: string;
  variacaoAvaliacoes: number;
  countTUG: number;
  count5TSTS: number;
  recentSeries: DashboardSeries;
}
