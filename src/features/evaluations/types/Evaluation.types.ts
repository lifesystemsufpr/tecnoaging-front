import { HealthProfessional, HealthUnit, Participant } from "@/core/types";

export type EvaluationType = "FTSTS" | "TTSTS";

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

  patientId: string;
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

export interface SensorData {
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

export interface CyclePhases {
  total: number;
  stand: number;
  sit: number;
}

export interface CycleDataRaw {
  cycle: number;
  totalTime: number;
  standUpTime: number;
  sitDownTime: number;
  power: number;
  velocityExtension: number;
  velocityFlexion: number;
}

export interface CycleData {
  min: CyclePhases;
  max: CyclePhases;
  avg: CyclePhases;
  totalCycles: number;
}

export interface ProcessedData {
  data: {
    t: number;
    val: number;
  }[];
  label: string;
  unit: string;
}

export interface MotionAnalysisResponse {
  processed: ProcessedData;
  sensor: SensorData;
  derived: DerivedData;
  cycle: CycleDataRaw[];
}

export type EvaluationFilters = {
  patientCpf?: string | null;
  patientName?: string | null;
  healthProfessionalName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  type?: string | null;
  page?: number;
  pageSize?: number;
};

export interface RepetitionHistory {
  date: string;
  repetitions: number;
}
