import { HealthProfessional, HealthUnit, Participant } from "@/core/types";

export type EvaluationType = "FTSTS" | "TTSTS" | "TMST";

export interface SensorData {
  id: string;
  timestamp: string;
  accel_x: number;
  accel_y: number;
  accel_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  evaluationId: string;
}

export interface EvaluationRaw {
  id?: string;
  type: EvaluationType;

  participantId: string;
  healthProfessionalId: string;
  healthcareUnitId: string;

  healthProfessional: HealthProfessional;
  participant: Participant;
  healthcareUnit: HealthUnit;

  date: string;
  time_init: string; // ISO
  time_end: string; // ISO
  totalTime: string; // seconds
  updatedAt: string; // ISO

  profissional_nome?: string;
  unidade_nome?: string;
}

export interface Evaluation extends EvaluationRaw {
  sensorData: SensorData[];
}

export type SensorColumn = "t" | "ax" | "ay" | "az" | "gx" | "gy" | "gz";

export interface SensorStatDetails {
  min: number;
  max: number;
  mean: number;
}

export interface SensorAnalysisData {
  format: string;
  columns: SensorColumn[];
  units: Record<SensorColumn | string, string>;
  samplingHz: number;
  resolution: number;
  downsampled: boolean;
  method: string;
  originalSampleCount: number;
  data: number[][];
  stats: Record<string, SensorStatDetails>;
}

export interface Indicator {
  name: string;
  value: number;
  maxValue: number;
  classification: string;
  unit?: string;
}

export interface DerivedData {
  participantAgeOnEvaluation: number;
  indicators: Indicator[];
  overallClassification: string;
}

export interface STSCyclePhases {
  total: number;
  stand: number;
  sit: number;
}

export interface TMSTCyclePhases {
  total: number;
  stand?: number;
  sit?: number;
}

export type CyclePhases = STSCyclePhases | TMSTCyclePhases;

export interface CycleData {
  min: CyclePhases;
  max: CyclePhases;
  avg: CyclePhases;
  totalCycles: number;
}

export interface BaseCycleDataRaw {
  cycle: number;
  totalTime: number;
  power: number;
  velocityExtension: number;
}

export interface STSCycleDataRaw extends BaseCycleDataRaw {
  standUpTime: number;
  sitDownTime: number;
  velocityFlexion: number;
}

export interface TMSTCycleDataRaw extends BaseCycleDataRaw {
  standUpTime: number;
  sitDownTime: number;
  velocityFlexion: number;
}

export type CycleDataRaw = STSCycleDataRaw | TMSTCycleDataRaw;
export interface TimeseriesPoint {
  t: number;
  val: number;
}

export interface STSProcessedData {
  label: string;
  unit: string;
  data: TimeseriesPoint[];
}

export interface TMSTPico {
  pico: number;
  t_pico_s: number;
  vel_bruta_deg_s: number;
  vel_phoneX_deg_s: number;
  vel_phoneY_deg_s: number;
  vel_phoneZ_deg_s: number;
  vel_calibrada_deg_s: number;
}

export interface TMSTMetricas {
  cv_vel: number;
  cv_tempo: number;
  n_passos: number;
  estrategia: string;
  tempo_dp_s: number;
  tempo_max_s: number;
  tempo_min_s: number;
  slope_deg_s2: number;
  vel_dp_deg_s: number;
  tempo_medio_s: number;
  vel_fim_deg_s: number;
  vel_ini_deg_s: number;
  vel_max_deg_s: number;
  vel_min_deg_s: number;
  delta_vel_deg_s: number;
  vel_media_deg_s: number;
  cadencia_ciclos_min: number;
}

export interface TMSTProcessedData {
  label: string;
  unit: string;
  data: {
    picos: TMSTPico[];
    metricas: TMSTMetricas;
    timeseries: TimeseriesPoint[];
  };
}

export type ProcessedData = STSProcessedData | TMSTProcessedData;

export function isTMSTProcessedData(p: ProcessedData): p is TMSTProcessedData {
  return !Array.isArray((p as TMSTProcessedData).data);
}

export function isSTSProcessedData(p: ProcessedData): p is STSProcessedData {
  return Array.isArray((p as STSProcessedData).data);
}

export interface STSMotionAnalysisResponse {
  processed: STSProcessedData;
  sensor: SensorAnalysisData;
  derived: DerivedData;
  cycle: STSCycleDataRaw[];
}

export interface TMSTMotionAnalysisResponse {
  processed: TMSTProcessedData;
  sensor: SensorAnalysisData;
  derived: DerivedData;
  cycles: TMSTCycleDataRaw[];
}

export type MotionAnalysisResponse =
  | STSMotionAnalysisResponse
  | TMSTMotionAnalysisResponse;

export function isTMSTMotionAnalysis(
  r: MotionAnalysisResponse
): r is TMSTMotionAnalysisResponse {
  return "cycles" in r;
}

export type EvaluationFilters = {
  participantCpf?: string | null;
  participantName?: string | null;
  healthProfessionalName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  type?: string | null;
  page?: number;
  pageSize?: number;
};

export interface RepetitionHistory {
  day: string;
  repetitions: number;
}
