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

export interface DashboardSeriesItem {
  name: string;
  data: number[];
}

export interface DashboardSeries {
  subtitle: string;
  series: DashboardSeriesItem[];
}

export interface PatientDashboardData {
  totalEvaluations: number;
  monthlyEvaluations: number[];
  averageDuration: string;
  evaluationVariation: number;
  mostPerformedTests: TestSummary[];
  recentSeries: DashboardSeries;
}

//API
export type Trend = "positive" | "negative" | "neutral";
export type ComparisonTrend = "faster" | "slower" | "equal";

export interface EvaluationCountResponse {
  totalEvaluations: number;
  monthlyChange: {
    percentage: number;
    value: number;
    trend: Trend;
  };
}

export interface AverageDurationResponse {
  averageDuration: {
    value: string;
    unit: string;
    display: string;
  };
  comparison: {
    text: string;
    percentage: number;
    trend: ComparisonTrend;
  };
}

export interface MonthlyEvaluationsResponse {
  monthlyData: MonthlyEvaluationItem[];
  totalYear: number;
  currentMonth: number;
  currentYear: number;
}

export interface MonthlyEvaluationItem {
  month: string;
  monthNumber: number;
  count: number;
  date: string;
}

export interface MostPerformedTestsResponse {
  tests: TestSummary[];
  total: number;
  mostPerformed: {
    name: string;
    count: number;
  };
}

export interface TestSummary {
  name: string;
  fullName: string;
  count: number;
  percentage: number;
}

export interface MonthlyAverageResponse {
  subtitle: string;
  evaluationTypes: EvaluationTypeAverage[];
  overallAverage: string;
  month: number;
  year: number;
  periodStart: string;
  periodEnd: string;
}

export interface EvaluationTypeAverage {
  type: string;
  fullName: string;
  averageDuration: string;
  unit: string;
  count: number;
}
