import { Gender } from "@/core/enums";
import {
  Evaluation,
  Indicator,
  MotionAnalysisResponse,
} from "@/features/evaluations/types/Evaluation.types";

export const mockStepHistory = [
  { day: "01/02", steps: 48 },
  { day: "04/02", steps: 55 },
  { day: "07/02", steps: 60 },
  { day: "10/02", steps: 63 },
  { day: "13/02", steps: 68 },
  { day: "16/02", steps: 72 },
  { day: "20/02", steps: 78 },
  { day: "24/02", steps: 85 },
];

const mockIndicators: Indicator[] = [
  {
    name: "Steps",
    value: 78,
    maxValue: 120,
    classification: "Normal",
    unit: "passos",
  },
  {
    name: "Cadence",
    value: 39,
    maxValue: 60,
    classification: "Normal",
    unit: "passos/min",
  },
  {
    name: "Total Energy",
    value: 45.2,
    maxValue: 100,
    classification: "Normal",
    unit: "kcal",
  },
];

const mockProcessedData = Array.from({ length: 240 }, (_, i) => ({
  t: i * 0.5,
  val: 0.8 + Math.sin(i * 0.15) * 0.3 + Math.random() * 0.1,
}));

export const mockEvaluationData: Evaluation = {
  id: "mock-2mst-001",
  type: "TMST" as any,
  participantId: "participant-001",
  healthProfessionalId: "hp-001",
  healthcareUnitId: "unit-001",
  healthProfessional: {
    id: "hp-001",
    fullName: "Dr. Ana Silva",
    cpf: "12345678901",
    email: "[EMAIL_ADDRESS]",
    gender: Gender.FEMALE,
    speciality: "Fisioterapia",
  },
  participant: {
    id: "participant-001",
    fullName: "Maria Santos",
    cpf: "98765432100",
    birthday: "1950-03-15",
    gender: Gender.FEMALE,
    weight: 65,
    height: 158,
  },
  healthcareUnit: {
    id: "unit-001",
    name: "UBS Central",
    city: "Curitiba",
    state: "PR",
  },
  date: "2026-03-20",
  time_init: "2026-03-20T14:00:00Z",
  time_end: "2026-03-20T14:02:00Z",
  totalTime: "120",
  updatedAt: "2026-03-20T14:05:00Z",
  sensorData: [],
};

export const mockDetailedData: MotionAnalysisResponse = {
  processed: {
    data: mockProcessedData,
    label: "Acelerômetro (marcha)",
    unit: "g",
  },
  sensor: {
    format: "json",
    columns: ["t", "ax", "ay", "az", "gx", "gy", "gz"],
    units: {
      t: "s",
      ax: "g",
      ay: "g",
      az: "g",
      gx: "°/s",
      gy: "°/s",
      gz: "°/s",
    },
    samplingHz: 50,
    resolution: 16,
    downsampled: false,
    method: "raw",
    originalSampleCount: 6000,
    data: [],
    stats: {},
  },
  derived: {
    participantAgeOnEvaluation: 76,
    indicators: mockIndicators,
    overallClassification: "Normal",
  },
  cycle: [],
};
