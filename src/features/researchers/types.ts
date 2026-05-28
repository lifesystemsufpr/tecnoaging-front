import { User } from "@/core/types";

export type AgeGroup = "70-74" | "75-79" | "80-84" | "85-89" | "≥90";
export type GenderMode = "all" | "male" | "female";

export const AGE_GROUPS: AgeGroup[] = [
  "70-74",
  "75-79",
  "80-84",
  "85-89",
  "≥90",
];

export interface DashboardResponse {
  summary: Summary;
  monthlyHistory: MonthlyHistoryItem[];
  averageByAgeGroup: PercentileEntry[];
}

export interface Summary {
  totalPatients: number;
  totalEvaluations: number;
  currentMonthEvaluations: number;
}

export interface MonthlyHistoryItem {
  month: string;
  total: number;
  byGender: GenderDistribution;
  averageRepetitions: number;
}

export interface PercentileEntry {
  percentile: number;
  values: Record<AgeGroup, number>;
}

export interface GenderDistribution {
  MALE: number;
  FEMALE: number;
}

export interface AgeGroupAverage {
  ageRange: string;
  average: number;
}

export interface ResearcherCreateRequest {
  user: User;
  institutionId: string;
  fieldOfStudy: string;
  email: string;
}
