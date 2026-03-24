export interface CurrentMonthByGender {
  timezone: string;
  month: string;
  year: number;
  total: number;
  male: number;
  female: number;
}

export interface TeamPerformance {
  individual: number;
  teamAverage: number;
  diference: number;
  hasIndividualData: boolean;
}

export interface MonthData {
  monthLabel: string;
  month: number;
  year: number;
  total: 0;
}

export interface MonthlyHistory {
  timezone: string;
  data: MonthData[];
}

export interface DashboardStats {
  currentMonthByGender: CurrentMonthByGender;
  teamPerformance: TeamPerformance;
  monthlyHistory: MonthlyHistory;
}
