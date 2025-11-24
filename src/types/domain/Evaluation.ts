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

export interface Evaluation extends EvaluationRaw {
  sensorData: SensorData[];
}
