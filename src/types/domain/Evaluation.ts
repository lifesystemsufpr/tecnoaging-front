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
  patient: Patient;
  healthcareUnit: HealthUnit;

  date: string;
  time_init: string; // ISO
  time_end: string; // ISO
  totalTime: string; // seconds
  updatedAt: string; // ISO
}

export interface CycleData {
  total: number;
  sit: number;
  stand: number;
}

export interface CycleMinMax extends CycleData {
  cycle: string;
}

export interface CycleMetadata {
  min: CycleMinMax;
  max: CycleMinMax;
  avg: CycleData;
}

export interface CycleCycles {
  [key: string]: CycleData;
}

export type Cycle = CycleCycles & CycleMetadata;

export interface Evaluation extends EvaluationRaw {
  sensorData: SensorData[];
  cicleData?: Cycle;
}
