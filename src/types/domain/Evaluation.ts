import { HealthProfessional } from "./Health-professional";
import { HealthUnit } from "./Health-unit";
import { Patient } from "./Patient";

export type EvaluationType = "FTSTS" | string;

export interface SensorData {
  id: string;
  timestamp: string; // ISO
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
  participant: Patient;
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

export interface CycleData {
  min: CyclePhases;
  max: CyclePhases;
  avg: CyclePhases;
  totalCycles: number;
}

export interface MotionAnalysisResponse {
  sensor: SensorData;
  derived: DerivedData;
  cycle: CycleData;
}
