export type GenderMode = "all" | "male" | "female";

export interface DashboardResponse {
  summary: Summary;
  monthlyHistory: MonthlyHistoryItem[];
  averageByAgeGroup: AgeGroupAverage[];
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

export interface GenderDistribution {
  MALE: number;
  FEMALE: number;
}

export interface AgeGroupAverage {
  ageRange: string;
  average: number;
}
